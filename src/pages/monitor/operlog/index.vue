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
      <dialog-form v-model:visible="formDialogVisible" :data="formData" @submit="handleDialogSubmit" />

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
  </div>
</template>

<script lang="ts">
export default {
  name: 'SysOperLog',
};
</script>

<script setup lang="ts">
import { omit, pick } from 'lodash';
import { AddIcon, Download1Icon, Setting1Icon, Upload1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getOperLogList } from '@/api/monitor/operlog';
import { getDictOptions } from '@/api/system/dict';
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
  { label: '日志主键', name: 'operId', type: 'input' },
  { label: '租户编号', name: 'tenantId', type: 'input' },
  { label: '模块标题', name: 'title', type: 'input' },
  { label: '业务类型（0其它 1新增 2修改 3删除）', name: 'businessType', type: 'input' },
  { label: '业务类型数组', name: 'businessTypes', type: 'input' },
  { label: '方法名称', name: 'method', type: 'input' },
  { label: '请求方式', name: 'requestMethod', type: 'input' },
  { label: '操作类别（0其它 1后台用户 2手机端用户）', name: 'operatorType', type: 'input' },
  { label: '操作人员', name: 'operName', type: 'input' },
  { label: '部门名称', name: 'deptName', type: 'input' },
  { label: '请求URL', name: 'operUrl', type: 'input' },
  { label: '主机地址', name: 'operIp', type: 'input' },
  { label: '操作地点', name: 'operLocation', type: 'input' },
  { label: '请求参数', name: 'operParam', type: 'input' },
  { label: '返回参数', name: 'jsonResult', type: 'input' },
  { label: '操作状态（0正常 1异常）', name: 'status', type: 'input' },
  { label: '错误消息', name: 'errorMsg', type: 'input' },
  { label: '操作时间', name: 'operTime', type: 'input' },
  { label: '消耗时间', name: 'costTime', type: 'input' },
  { label: '请求参数', name: 'params', type: 'input' },
];
const searchData = ref<components['schemas']['SysOperLogBo']>({});

const handleFormSubmit = (data: components['schemas']['SysOperLogBo']) => {
  console.log('提交的数据:', data);
  searchData.value = data;
  fetchData();
};
const handleFormReset = (data: components['schemas']['SysOperLogBo']) => {
  console.log('重置表单', data);
  searchData.value = data;
  fetchData();
};

const formDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const staticColumn = ['row-select', 'status', 'op'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat(['operId', 'title', 'operatorType', 'operName', 'deptName', 'operIp', 'operTime', 'costTime']),
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
    const result = await getOperLogList({
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
        handleClickExport();
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
];

onMounted(async () => {
  dicts.value = await getDictOptions(['sys_normal_disable']);
  fetchData();
});

const router = useRouter();

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange: TableProps['onPageChange'] = (curr, rows) => {
  console.log('分页变化', curr, rows);
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

const handleClickDetail = () => {
  router.push('/detail/base');
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
