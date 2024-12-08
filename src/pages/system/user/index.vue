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
              <t-button
                v-for="(action, index) in actions"
                :key="index"
                v-bind="omit(action.props, 'icon')"
                @click="action.handler()"
              >
                <template v-if="action.props.icon" #icon>
                  <component :is="action.props.icon"></component>
                </template>
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
      <dialog-form v-model:visible="formDialogVisible" :data="formData" />
      <dialog-upload v-model:visible="uploadDialogVisible" />
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
        @select-change="(value: number[]) => rehandleSelectChange(value)"
      >
        <template #op="slotProps">
          <t-space>
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
  name: 'ListBase',
};
</script>

<script setup lang="ts">
import { omit } from 'lodash';
import { AddIcon, Delete1Icon, Download1Icon, Setting1Icon, Upload1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getUserList } from '@/api/system/user';
import AdvanceSearch from '@/components/advance-search/index.vue';
import DialogUpload from '@/components/dialog-upload/index.vue';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import DialogForm from './components/DialogForm.vue';
import { COLUMNS, COLUMNS_CONTROLLER_CONFIG, INIT_PAGE, INITIAL_DATA, ROW_KEY } from './constants';

const store = useSettingStore();

const fields = [
  { label: '创建部门', name: 'createDept', type: 'input' },
  { label: '创建者', name: 'createBy', type: 'input' },
  { label: '创建时间', name: 'createTime', type: 'input' },
  { label: '更新者', name: 'updateBy', type: 'input' },
  { label: '更新时间', name: 'updateTime', type: 'input' },
  { label: '请求参数', name: 'params', type: 'input' },
  { label: '用户ID', name: 'userId', type: 'input' },
  { label: '部门ID', name: 'deptId', type: 'input' },
  { label: '用户账号', name: 'userName', type: 'input' },
  { label: '用户昵称', name: 'nickName', type: 'input' },
  { label: '用户类型（sys_user系统用户）', name: 'userType', type: 'input' },
  { label: '用户邮箱', name: 'email', type: 'input' },
  { label: '手机号码', name: 'phonenumber', type: 'input' },
  { label: '用户性别（0男 1女 2未知）', name: 'sex', type: 'input' },
  { label: '密码', name: 'password', type: 'input' },
  { label: '帐号状态（0正常 1停用）', name: 'status', type: 'input' },
  { label: '备注', name: 'remark', type: 'input' },
  { label: '角色组', name: 'roleIds', type: 'input' },
  { label: '岗位组', name: 'postIds', type: 'input' },
  { label: '数据权限 当前角色ID', name: 'roleId', type: 'input' },
  { label: '排除不查询的用户(工作流用)', name: 'excludeUserIds', type: 'input' },
  { label: '超级管理员', name: 'superAdmin', type: 'input' },
];
const searchData = ref<components['schemas']['SysUserBo']>({
  userName: undefined,
  nickName: undefined,
});

const handleFormSubmit = (data: Record<string, any>) => {
  console.log('提交的数据:', data);
};
const handleFormReset = (data: Record<string, any>) => {
  console.log('重置表单', data);
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
const pagination = ref<PaginationProps>({ ...INIT_PAGE });
const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const result = await getUserList({
      ...searchData.value,
      ...pagination.value,
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
const actions = computed<Action<ButtonProps>[]>(() => {
  return [
    {
      label: t('pages.common.actions.create'),
      props: {
        theme: 'primary',
        shape: 'rectangle',
        icon: AddIcon,
      },
      handler: () => {
        formDialogVisible.value = true;
      },
    },
    {
      label: t('pages.common.actions.export'),
      props: {
        theme: 'success',
        shape: 'rectangle',
        icon: Download1Icon,
      },
      handler: () => {
        formDialogVisible.value = true;
      },
    },
    {
      label: t('pages.common.actions.import'),
      props: {
        theme: 'warning',
        shape: 'rectangle',
        icon: Upload1Icon,
      },
      handler: () => {
        uploadDialogVisible.value = true;
      },
    },
    {
      label: t('pages.common.actions.delete'),
      props: {
        theme: 'danger',
        shape: 'rectangle',
        disabled: selectedRowKeys.value.length === 0,
        icon: Delete1Icon,
      },
      handler: () => {
        handleClickDeleteBatch();
      },
    },
  ];
});

const ops: Action<LinkProps>[] = [
  {
    label: t('pages.common.ops.detail'),
    props: {
      theme: 'primary',
    },
    handler: () => handleClickDetail(),
  },
  {
    label: t('pages.common.ops.delete'),
    props: {
      theme: 'danger',
    },
    handler: (slotProps) => handleClickDelete(slotProps),
  },
];

const deleteItems = ref([]);
const confirmVisible = ref(false);
const confirmBody = computed(() => {
  const items = deleteItems.value.map((i) => i.index).join(', ');
  return `确认删除删【${items}】？`;
});

onMounted(() => {
  fetchData();
});

const router = useRouter();
const onConfirmDelete = () => {
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
};

const onCancel = () => {
  confirmVisible.value = false;
};

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const handleClickDeleteBatch = () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.warning('请先选择要删除的数据');
    return;
  }
  deleteItems.value = selectedRowKeys.value.map((id: number) => data.value.find((item: any) => item[ROW_KEY] === id));
  confirmVisible.value = true;
};
const handleClickDetail = () => {
  router.push('/detail/base');
};

const handleClickDelete = (row: { row: any }) => {
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
