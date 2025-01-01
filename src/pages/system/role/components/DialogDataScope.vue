<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="dialogTitle"
    :width="680"
    :footer="false"
    destroy-on-close
    @opened="handleDialogOpened"
  >
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="120" label-align="right" @submit="onSubmit">
        <!-- 角色名称 -->
        <t-form-item label="角色名称" name="roleName">
          <t-input v-model="formData.roleName" :readonly="true" clearable placeholder="请输入角色名称" />
        </t-form-item>
        <!-- 角色权限字符串 -->
        <t-form-item label="角色权限字符" name="roleKey">
          <t-input v-model="formData.roleKey" :readonly="true" clearable placeholder="请输入角色权限字符" />
        </t-form-item>
        <!-- 数据范围 -->
        <t-form-item label="数据范围" name="dataScope">
          <t-select v-model="formData.dataScope">
            <t-option value="1" label="全部数据权限">全部数据权限</t-option>
            <t-option value="2" label="自定数据权限">自定数据权限</t-option>
            <t-option value="3" label="本部门数据权限">本部门数据权限</t-option>
            <t-option value="4" label="本部门及以下数据权限">本部门及以下数据权限</t-option>
          </t-select>
        </t-form-item>

        <t-form-item v-if="formData.dataScope === '2'" label="菜单权限">
          <t-space direction="vertical">
            <t-space>
              <t-checkbox v-model="expandAll" @change="handleExpandAll">展开/折叠</t-checkbox>
              <t-checkbox v-model="checkedAll" @click="handleCheckAll">全选/全不选</t-checkbox>
              <t-checkbox v-model="formData.menuCheckStrictly">父子联动</t-checkbox>
            </t-space>
            <t-tree
              ref="tree"
              v-model="allCheckedKeys"
              v-model:expanded="allExpandedKeys"
              :data="deptTree"
              :keys="{
                label: 'label',
                value: 'id',
              }"
              checkable
              :check-strictly="!formData.menuCheckStrictly"
              :value-mode="valueMode"
              hover
            />
          </t-space>
        </t-form-item>

        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { CheckboxProps, MessagePlugin, SubmitContext, TreeInstanceFunctions, TreeProps } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

import { getDeptTreeByRoleId } from '@/api/system/dept';
import { getRoleDetail } from '@/api/system/role';
import { components } from '@/types/schema';

import { INITIAL_DATA, RULES } from '../constants';

interface Props {
  data: typeof INITIAL_DATA;
  visible: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  visible: false,
});
const emit = defineEmits(['update:visible', 'submit']);

const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const deptTree = ref<components['schemas']['TreeLong'][]>();
const tree = ref<TreeInstanceFunctions>();
const valueMode = ref<TreeProps['valueMode']>('all');
const allCheckedKeys = ref([]);
const allExpandedKeys = ref<TreeProps['expanded']>([]);
const expandAll = ref(false);
const checkedAll = ref(false);

const handleExpandAll: CheckboxProps['onChange'] = (checked) => {
  if (checked) {
    allExpandedKeys.value = deptTree.value.map((i) => i.id);
  } else {
    allExpandedKeys.value = [];
  }
};

const handleCheckAll: CheckboxProps['onChange'] = (checked) => {
  if (checked) {
    allCheckedKeys.value = tree.value.getItems().map((i) => i.value);
  } else {
    allCheckedKeys.value = [];
  }
};

const dialogTitle = computed(() => {
  return '数据权限';
});

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    formData.value.deptIds = allCheckedKeys.value;

    emit('submit');
    MessagePlugin.success('提交成功');
    formVisible.value = false;
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

const handleDialogOpened = async () => {
  if (props.data.roleId) {
    const result = await getRoleDetail(props.data.roleId as unknown as string);
    formData.value = { ...INITIAL_DATA, ...result };
  }
  const result = await getDeptTreeByRoleId(props.data.roleId as unknown as string);
  allCheckedKeys.value = result.checkedKeys;
  deptTree.value = result.depts;
};

watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
  },
);

watch(
  () => props.data,
  (val) => {
    formData.value = val;
  },
);
</script>
