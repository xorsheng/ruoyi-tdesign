<template>
  <div>
    <t-card :bordered="false">
      <advance-search :fields="fields" @submit="handleFormSubmit" @reset="handleFormReset" />
    </t-card>
    <t-card :bordered="false">
      <template #header>
        <t-row justify="space-between" style="width: 100%">
          <t-col>
            <t-space>
              <t-button v-for="(action, index) in actions" :key="index" v-bind="action.props" @click="action.handler()">
                {{ action.label }}
              </t-button>
            </t-space>
          </t-col>
          <t-col>
            <t-tooltip content="列配置">
              <t-button theme="default" shape="circle" @click="columnControllerVisible = true">
                <template #icon> <setting1-icon /> </template>
              </t-button>
            </t-tooltip>
          </t-col>
        </t-row>
      </template>
      <dialog-form v-model:visible="formDialogVisible" :data="formData" :mode="mode" @submit="handleDialogSubmit" />
      <dialog-upload v-model:visible="uploadDialogVisible" :upload-fn="uploadData" @success="fetchData" />
      <t-table
        v-model:display-columns="displayColumns"
        v-model:column-controller-visible="columnControllerVisible"
        :data="data"
        :columns="COLUMNS"
        :column-controller="COLUMNS_CONTROLLER_CONFIG"
        :row-key="ROW_KEY"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="rehandleSelectChange"
      >
        <template #sex="{ row }">
          <dict-tag :status="row.sex" :options="dicts.sys_user_sex" />
        </template>
        <template #status="{ row }">
          <dict-tag :status="row.status" :options="dicts.sys_normal_disable" />
        </template>
        <template #op="slotProps">
          <t-space v-if="slotProps.row.userId !== 1">
            <t-link v-for="(op, index) in ops" :key="index" v-bind="op.props" @click="op.handler(slotProps)">
              {{ op.label }}
            </t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选项？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SysUser',
};
</script>

<script setup lang="ts">
import { omit, pick } from 'lodash';
import { AddIcon, Delete1Icon, Download1Icon, Setting1Icon, Table1Icon, Upload1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getDictOptions } from '@/api/system/dict';
import { delUserByIds, getExportData, getImportTemplate, getUserList, uploadData } from '@/api/system/user';
import AdvanceSearch from '@/components/advance-search/index.vue';
import DialogUpload from '@/components/dialog-upload/index.vue';
import DictTag from '@/components/dict-tag/index.vue';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import DialogForm from './components/DialogForm.vue';
import { COLUMNS, COLUMNS_CONTROLLER_CONFIG, INIT_PAGE, INITIAL_DATA, ROW_KEY } from './constants';

const store = useSettingStore();
const router = useRouter();
const fields = [
  // { label: '创建部门', name: 'createDept', type: 'input' },
  // { label: '创建者', name: 'createBy', type: 'input' },
  // { label: '创建时间', name: 'createTime', type: 'input' },
  // { label: '更新者', name: 'updateBy', type: 'input' },
  // { label: '更新时间', name: 'updateTime', type: 'input' },
  // { label: '请求参数', name: 'params', type: 'input' },
  // { label: '用户ID', name: 'userId', type: 'input' },
  // { label: '部门ID', name: 'deptId', type: 'input' },
  { label: '用户账号', name: 'userName', type: 'input' },
  { label: '用户昵称', name: 'nickName', type: 'input' },
  // { label: '用户类型（sys_user系统用户）', name: 'userType', type: 'input' },
  // { label: '用户邮箱', name: 'email', type: 'input' },
  { label: '手机号码', name: 'phonenumber', type: 'input' },
  { label: '用户性别', name: 'sex', type: 'input' },
  // { label: '密码', name: 'password', type: 'input' },
  { label: '帐号状态', name: 'status', type: 'input' },
  // { label: '备注', name: 'remark', type: 'input' },
  // { label: '角色组', name: 'roleIds', type: 'input' },
  // { label: '岗位组', name: 'postIds', type: 'input' },
  // { label: '数据权限 当前角色ID', name: 'roleId', type: 'input' },
  // { label: '排除不查询的用户(工作流用)', name: 'excludeUserIds', type: 'input' },
  // { label: '超级管理员', name: 'superAdmin', type: 'input' },
  { label: '创建时间', name: 'params.dateRange', type: 'date-range-picker' },
];
const searchData = ref<components['schemas']['SysUserBo']>({
  userName: undefined,
  nickName: undefined,
  params: {},
});

const handleFormSubmit = (data: components['schemas']['SysUserBo']) => {
  const [beginTime, endTime] = data.params.dateRange as unknown as [string, string];
  searchData.value = omit(data, 'params.dateRange');
  searchData.value.params.beginTime = beginTime;
  searchData.value.params.endTime = endTime;
  fetchData();
};
const handleFormReset = (data: components['schemas']['SysUserBo']) => {
  searchData.value = data;
  fetchData();
};

const formDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const staticColumn = ['row-select', 'status', 'op'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat(['userName', 'nickName', 'deptId', 'phonenumber']),
);
const columnControllerVisible = ref(false);
const data = ref([]);
const selectedRowKeys = ref([]);
const pagination = ref<PaginationProps & components['schemas']['PageQuery']>({ ...INIT_PAGE });
const dataLoading = ref(false);
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});

const handleDialogSubmit = async () => {
  fetchData();
};
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const result = await getUserList({
      ...searchData.value,
      ...pick(pagination.value, ['pageNum', 'pageSize']),
    });
    if ('rows' in result) {
      const { rows, total } = result;
      data.value = rows;
      pagination.value = {
        ...pagination.value,
        total,
      };
    }
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};
const actions: Action<ButtonProps>[] = [
  {
    label: '新建',
    props: {
      theme: 'primary',
      shape: 'rectangle',
      icon: () => h(AddIcon),
    },
    handler: () => {
      formDialogVisible.value = true;
      formData.value = { ...INITIAL_DATA };
      mode.value = 'create';
    },
  },
  {
    label: '导出',
    props: {
      theme: 'success',
      shape: 'rectangle',
      icon: () => h(Download1Icon),
    },
    handler: () => {
      handleClickExport();
    },
  },
  {
    label: '导入',
    props: {
      theme: 'warning',
      shape: 'rectangle',
      icon: () => h(Upload1Icon),
    },
    handler: () => {
      uploadDialogVisible.value = true;
    },
  },
  {
    label: '删除',
    props: {
      theme: 'danger',
      shape: 'rectangle',
      disabled: selectedRowKeys.value.length === 0,
      icon: () => h(Delete1Icon),
    },
    handler: () => {
      handleClickDeleteBatch();
    },
  },
  {
    label: '下载模板',
    props: {
      theme: 'default',
      shape: 'rectangle',
      icon: () => h(Table1Icon),
    },
    handler: () => {
      getImportTemplate();
    },
  },
];

const ops: Action<LinkProps>[] = [
  {
    label: '详情',
    props: {
      theme: 'primary',
    },
    handler: (slotProps) => handleClickDetail(slotProps),
  },
  {
    label: '编辑',
    props: {
      theme: 'primary',
    },
    handler: (slotProps) => handleClickEdit(slotProps),
  },
  {
    label: '分配角色',
    props: {
      theme: 'primary',
    },
    handler: (slotProps) => handleClickRole(slotProps),
  },
  {
    label: '删除',
    props: {
      theme: 'danger',
    },
    handler: (slotProps) => handleClickDelete(slotProps),
  },
];

const deleteItems = ref<components['schemas']['SysUserVo'][]>([]);
const confirmVisible = ref(false);
const mode = ref<'create' | 'edit' | 'view'>('create');
const confirmBody = computed(() => {
  const items = deleteItems.value.map((i) => i.userName).join(', ');
  return `确认删除删【${items}】？`;
});

onMounted(async () => {
  dicts.value = await getDictOptions(['sys_normal_disable', 'sys_user_sex']);
  fetchData();
});

const onConfirmDelete = async () => {
  await delUserByIds(deleteItems.value.map((i) => i.userId));
  fetchData();
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
};

const onCancel = () => {
  confirmVisible.value = false;
};

const rehandleSelectChange: TableProps['onSelectChange'] = (val) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange: TableProps['onPageChange'] = (curr, rows) => {
  pagination.value = {
    ...pagination.value,
    current: curr.current,
    pageSize: curr.pageSize,
    pageNum: curr.current,
  };
  fetchData();
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickExport = async () => {
  getExportData(searchData.value);
};
const handleClickDeleteBatch = () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.warning('请先选择要删除的数据');
    return;
  }
  deleteItems.value = selectedRowKeys.value.map((id: number) => data.value.find((item: any) => item[ROW_KEY] === id));
  confirmVisible.value = true;
};
const handleClickDetail = (row: { row: components['schemas']['SysUserVo'] }) => {
  formData.value = { ...INITIAL_DATA, ...pick(row.row, ['userId']) };
  mode.value = 'view';
  formDialogVisible.value = true;
};

const handleClickEdit = (row: { row: components['schemas']['SysUserVo'] }) => {
  formData.value = { ...INITIAL_DATA, ...pick(row.row, ['userId']) };
  mode.value = 'edit';
  formDialogVisible.value = true;
};

const handleClickRole = (row: { row: components['schemas']['SysUserVo'] }) => {
  const { userId } = row.row;
  router.push({
    path: `/system/user-mgr/role/${userId}`,
  });
};

const handleClickDelete = (row: { row: components['schemas']['SysUserVo'] }) => {
  deleteItems.value = [row.row];
  confirmVisible.value = true;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
