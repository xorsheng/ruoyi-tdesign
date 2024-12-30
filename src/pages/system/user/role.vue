<template>
  <div>
    <t-card title="用户信息" :bordered="false">
      <t-descriptions bordered :column="2">
        <t-descriptions-item label="登录账号">{{ user.userName }}</t-descriptions-item>
        <t-descriptions-item label="用户昵称">{{ user.nickName }}</t-descriptions-item>
        <t-descriptions-item label="分配角色">{{ roleNames }}</t-descriptions-item>
      </t-descriptions>
    </t-card>
    <t-card :bordered="false">
      <t-table
        :data="data"
        :columns="ROLES_COLUMNS"
        row-key="roleId"
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
        <template #flag="{ row }">
          <t-tag v-if="row.flag" theme="success">是</t-tag>
          <t-tag v-else theme="danger">否</t-tag>
        </template>
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
  </div>
</template>

<script lang="ts">
export default {
  name: 'SysUserRole',
};
</script>

<script setup lang="ts">
import { ButtonProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getDictOptions } from '@/api/system/dict';
import { authRole, getAuthRoleByUserId } from '@/api/system/user';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import { INIT_PAGE, ROLES_COLUMNS } from './constants';

const store = useSettingStore();
const router = useRouter();

interface Props {
  userId: string;
}
const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
});
const user = ref<components['schemas']['SysUserVo']>({});
const data = ref([]);
const selectedRowKeys = ref([]);
const pagination = ref<PaginationProps & components['schemas']['PageQuery']>({ ...INIT_PAGE });
const dataLoading = ref(false);
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});
const roleNames = computed(() => {
  if (!user.value) return '';
  if (!user.value.roles) return '';
  return user.value.roles.map((i) => i.roleName).join(',');
});
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const result = await getAuthRoleByUserId(props.userId);
    data.value = result.roles;
    pagination.value = {
      ...pagination.value,
      total: result.roles.length,
    };
    user.value = result.user;
    selectedRowKeys.value = result.user.roles.map((item) => item.roleId);
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const actions: ({ props: ButtonProps } & { label: string; handler: () => void })[] = [
  {
    label: '提交',
    props: { theme: 'primary' },
    handler: async () => {
      if (props.userId) {
        await authRole({
          userId: props.userId,
          roleIds: selectedRowKeys.value,
        });
        MessagePlugin.success('提交成功');
        fetchData();
      }
    },
  },
  {
    label: '返回',
    props: { theme: 'default' },
    handler: () => {
      router.back();
    },
  },
];

onMounted(async () => {
  dicts.value = await getDictOptions(['sys_normal_disable']);
  if (props.userId) {
    fetchData();
  }
});

const rehandleSelectChange = (val: number[]) => {
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

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
