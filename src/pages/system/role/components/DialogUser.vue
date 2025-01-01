<template>
  <t-dialog
    v-model:visible="userVisible"
    :header="dialogTitle"
    :width="800"
    :footer="false"
    destroy-on-close
    @opened="handleDialogOpened"
  >
    <template #body>
      <t-card :bordered="false">
        <advance-search
          :fields="fields"
          :col-props="{ xs: 6, sm: 6, md: 6 }"
          @submit="handleFormSubmit"
          @reset="handleFormReset"
        />
      </t-card>
      <t-card :bordered="false">
        <t-table
          v-model:display-columns="displayColumns"
          v-model:column-controller-visible="columnControllerVisible"
          :data="data"
          :columns="USER_COLUMNS"
          :column-controller="COLUMNS_CONTROLLER_CONFIG"
          row-key="userId"
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
        </t-table>

        <template #footer>
          <t-row justify="center">
            <t-space>
              <t-button v-for="(action, index) in actions" :key="index" v-bind="action.props" @click="action.handler()">
                {{ action.label }}
              </t-button>
            </t-space>
          </t-row>
        </template>
      </t-card>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { omit, pick } from 'lodash';
import { ButtonProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { getUnallocatedUserList, selectAllAuth } from '@/api/system/role';
import AdvanceSearch from '@/components/advance-search/index.vue';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import { COLUMNS_CONTROLLER_CONFIG, INIT_PAGE, USER_COLUMNS } from '../constants';

const store = useSettingStore();

interface Props {
  visible: boolean;
  roleId: string | undefined;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  roleId: undefined,
});
const emit = defineEmits(['update:visible', 'submit']);

const fields = [
  { label: '用户账号', name: 'userName', type: 'input' },
  { label: '用户昵称', name: 'nickName', type: 'input' },
  { label: '手机号码', name: 'phonenumber', type: 'input' },
];
const searchData = ref<components['schemas']['SysUserBo']>({
  userName: undefined,
  nickName: undefined,
  params: {},
  roleId: undefined,
});

const handleFormSubmit = (data: components['schemas']['SysUserBo']) => {
  searchData.value = omit(data, 'params.dateRange');
  fetchData();
};
const handleFormReset = (data: components['schemas']['SysUserBo']) => {
  searchData.value = data;
  fetchData();
};
const userVisible = ref(false);
const staticColumn = ['row-select'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat(['deptName', 'userName', 'nickName', 'phonenumber']),
);
const columnControllerVisible = ref(false);
const data = ref([]);
const selectedRowKeys = ref([]);
const pagination = ref<PaginationProps & components['schemas']['PageQuery']>({ ...INIT_PAGE });
const dataLoading = ref(false);

const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const result = await getUnallocatedUserList({
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
      label: '添加用户',
      props: { theme: 'primary', shape: 'rectangle' },
      handler: async () => {
        await selectAllAuth({
          roleId: props.roleId as unknown as number,
          userIds: selectedRowKeys.value,
        });
        userVisible.value = false;
        MessagePlugin.success('添加用户成功');
        emit('submit');
      },
    },
  ];
});

const dialogTitle = computed(() => {
  return '选择用户';
});

const handleDialogOpened = async () => {
  fetchData();
  dicts.value = await getDictOptions(['sys_normal_disable']);
};

watch(
  () => userVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

watch(
  () => props.visible,
  (val) => {
    userVisible.value = val;
  },
);

watch(
  () => props.roleId,
  (val) => {
    searchData.value.roleId = val as unknown as number;
  },
);

const rehandlePageChange = (curr: { current: number; pageSize: number }) => {
  pagination.value = {
    ...pagination.value,
    current: curr.current,
    pageSize: curr.pageSize,
    pageNum: curr.current,
  };
  fetchData();
};

const rehandleChange = (changeParams: any, triggerAndData: any) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
