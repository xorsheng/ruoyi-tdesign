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
        <template #status="{ row }">
          <dict-tag :status="row.status" :options="dicts.sys_normal_disable" />
        </template>
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
  name: 'SysPost',
};
</script>

<script setup lang="ts">
import { pick } from 'lodash';
import { AddIcon, Delete1Icon, Download1Icon, Setting1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, h, onMounted, ref } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { delPostByIds, getExportData, getPostList } from '@/api/system/post';
import AdvanceSearch from '@/components/advance-search/index.vue';
import DictTag from '@/components/dict-tag/index.vue';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import DialogForm from './components/DialogForm.vue';
import { COLUMNS, COLUMNS_CONTROLLER_CONFIG, INIT_PAGE, INITIAL_DATA, ROW_KEY } from './constants';

const store = useSettingStore();

const fields = computed(() => {
  return [
    // { label: '创建部门', name: 'createDept', type: 'input' },
    // { label: '创建者', name: 'createBy', type: 'input' },
    // { label: '创建时间', name: 'createTime', type: 'input' },
    // { label: '更新者', name: 'updateBy', type: 'input' },
    // { label: '更新时间', name: 'updateTime', type: 'input' },
    // { label: '请求参数', name: 'params', type: 'input' },
    // { label: '岗位ID', name: 'postId', type: 'input' },
    { label: '部门', name: 'deptId', type: 'input' },
    // { label: '归属部门id（部门树）', name: 'belongDeptId', type: 'input' },
    { label: '岗位编码', name: 'postCode', type: 'input' },
    { label: '岗位名称', name: 'postName', type: 'input' },
    // { label: '岗位类别编码', name: 'postCategory', type: 'input' },
    // { label: '显示顺序', name: 'postSort', type: 'input' },
    { label: '状态', name: 'status', type: 'select' },
    // { label: '备注', name: 'remark', type: 'input' },
  ];
});
const searchData = ref<components['schemas']['SysPostBo']>({
  deptId: undefined,
  postCode: undefined,
  postName: undefined,
  postSort: undefined,
});

const handleFormSubmit = (data: components['schemas']['SysPostBo']) => {
  searchData.value = data;
  fetchData();
};
const handleFormReset = (data: components['schemas']['SysPostBo']) => {
  searchData.value = data;
  fetchData();
};

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const staticColumn = ['row-select', 'status', 'op'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat(['postCode', 'postCategory', 'postName', 'deptName', 'postSort', 'createTime']),
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
    const result = await getPostList({
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
    label: '删除',
    props: {
      theme: 'danger',
    },
    handler: (slotProps) => handleClickDelete(slotProps),
  },
];

const deleteItems = ref<components['schemas']['SysPostVo'][]>([]);
const confirmVisible = ref(false);
const mode = ref<'create' | 'edit' | 'view'>('create');
const confirmBody = computed(() => {
  const items = deleteItems.value.map((i) => i.postName).join(', ');
  return `确认删除删【${items}】？`;
});

onMounted(async () => {
  dicts.value = await getDictOptions(['sys_normal_disable']);
  fetchData();
});

const onConfirmDelete = async () => {
  await delPostByIds(deleteItems.value.map((i) => i.postId));
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
const rehandlePageChange: TableProps['onPageChange'] = (curr) => {
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
const handleClickDetail = (row: { row: components['schemas']['SysPostVo'] }) => {
  formData.value = { ...INITIAL_DATA, ...row.row };
  mode.value = 'view';
  formDialogVisible.value = true;
};

const handleClickEdit = (row: { row: components['schemas']['SysPostVo'] }) => {
  formData.value = { ...INITIAL_DATA, ...row.row };
  mode.value = 'edit';
  formDialogVisible.value = true;
};
const handleClickDelete = (row: { row: components['schemas']['SysPostVo'] }) => {
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
