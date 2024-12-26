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
        <advance-search :fields="fields" :col-props="{ md: 6 }" @submit="handleFormSubmit" @reset="handleFormReset" />
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
  // { label: '用户性别', name: 'sex', type: 'input' },
  // { label: '密码', name: 'password', type: 'input' },
  // { label: '帐号状态', name: 'status', type: 'input' },
  // { label: '备注', name: 'remark', type: 'input' },
  // { label: '角色组', name: 'roleIds', type: 'input' },
  // { label: '岗位组', name: 'postIds', type: 'input' },
  // { label: '数据权限 当前角色ID', name: 'roleId', type: 'input' },
  // { label: '排除不查询的用户(工作流用)', name: 'excludeUserIds', type: 'input' },
  // { label: '超级管理员', name: 'superAdmin', type: 'input' },
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
    searchData.value.roleId = val;
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
