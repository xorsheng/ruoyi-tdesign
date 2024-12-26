<template>
  <div>
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
        </t-row>
      </template>

      <dialog-user v-model:visible="userDialogVisible" :role-id="props.roleId" @submit="fetchData" />
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
      header="确认取消当前所选用户权限？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SysUserRole',
};
</script>

<script setup lang="ts">
import { omit, pick } from 'lodash';
import { AddIcon, Delete1Icon } from 'tdesign-icons-vue-next';
import { ButtonProps, LinkProps, MessagePlugin, PaginationProps, TableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { cancelAllAuth, getAllocatedUserList } from '@/api/system/role';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { components } from '@/types/schema';

import DialogUser from './components/DialogUser.vue';
import { COLUMNS_CONTROLLER_CONFIG, INIT_PAGE, USER_COLUMNS } from './constants';

const store = useSettingStore();

interface Props {
  roleId: string;
}
const props = withDefaults(defineProps<Props>(), {
  roleId: undefined,
});

const searchData = computed(() => {
  return {
    roleId: props.roleId,
  } as unknown as components['schemas']['SysUserBo'];
});
const userDialogVisible = ref(false);
const staticColumn = ['row-select', 'status', 'op'];
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
    const result = await getAllocatedUserList({
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
      props: {
        theme: 'primary',
        shape: 'rectangle',
        icon: AddIcon,
      },
      handler: () => {
        userDialogVisible.value = true;
      },
    },

    {
      label: '取消授权',
      props: {
        theme: 'danger',
        shape: 'rectangle',
        disabled: selectedRowKeys.value.length === 0,
        icon: Delete1Icon,
      },
      handler: () => {},
    },
  ];
});

const ops: Action<LinkProps>[] = [
  {
    label: '取消授权',
    props: {
      theme: 'danger',
    },
    handler: (slotProps) => handleClickCancelAuth(slotProps),
  },
];

const deleteItems = ref<components['schemas']['SysUserVo'][]>([]);
const confirmVisible = ref(false);
const confirmBody = computed(() => {
  const items = deleteItems.value.map((i) => i.userName).join(', ');
  return `确认取消【${items}】权限？`;
});

onMounted(async () => {
  dicts.value = await getDictOptions(['sys_normal_disable']);
  if (props.roleId) {
    fetchData();
  }
});

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

const handleClickCancelAuth = (row: { row: components['schemas']['SysUserVo'] }) => {
  deleteItems.value = [row.row];
  confirmVisible.value = true;
};

const onConfirmDelete = async () => {
  await cancelAllAuth({
    roleId: props.roleId as unknown as number,
    userIds: deleteItems.value.map((i) => i.userId),
  });
  fetchData();
  confirmVisible.value = false;
  MessagePlugin.success('取消授权成功');
};

const onCancel = () => {
  confirmVisible.value = false;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>
