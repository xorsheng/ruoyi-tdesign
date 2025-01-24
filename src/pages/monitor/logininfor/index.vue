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
  name: 'SysLogininfor',
};
</script>

<script setup lang="ts">
import { omit, pick } from 'lodash';
import { Download1Icon, Setting1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getLoginInfoList } from '@/api/monitor/logininfor';
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
  // { label: '访问ID', name: 'infoId', type: 'input' },
  // { label: '租户编号', name: 'tenantId', type: 'input' },
  { label: '用户账号', name: 'userName', type: 'input' },
  { label: '客户端', name: 'clientKey', type: 'input' },
  { label: '设备类型', name: 'deviceType', type: 'input' },
  { label: '登录IP地址', name: 'ipaddr', type: 'input' },
  { label: '登录地点', name: 'loginLocation', type: 'input' },
  // { label: '浏览器类型', name: 'browser', type: 'input' },
  // { label: '操作系统', name: 'os', type: 'input' },
  { label: '登录状态', name: 'status', type: 'input' },
  // { label: '提示消息', name: 'msg', type: 'input' },
  { label: '访问时间', name: 'loginTime', type: 'input' },
  // { label: '请求参数', name: 'params', type: 'input' },
];
const searchData = ref<components['schemas']['SysLogininforBo']>({});

const handleFormSubmit = (data: components['schemas']['SysLogininforBo']) => {
  searchData.value = data;
  fetchData();
};
const handleFormReset = (data: components['schemas']['SysLogininforBo']) => {
  searchData.value = data;
  fetchData();
};

const formDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const staticColumn = ['row-select', 'status', 'op'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat(['infoId', 'userName', 'clientKey', 'deviceType', 'ipaddr', 'os', 'browser', 'msg', 'loginTime']),
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
    const result = await getLoginInfoList({
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

const handleClickExport = async () => {};
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
