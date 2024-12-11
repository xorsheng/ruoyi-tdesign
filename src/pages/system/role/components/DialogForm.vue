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
          <t-input v-model="formData.roleName" :readonly="isView" clearable placeholder="请输入角色名称" />
        </t-form-item>
        <!-- 角色权限字符串 -->
        <t-form-item label="角色权限字符" name="roleKey">
          <t-input v-model="formData.roleKey" :readonly="isView" clearable placeholder="请输入角色权限字符" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="roleSort" :rules="[{ required: true, message: '请输入显示顺序' }]">
          <t-input-number v-model="formData.roleSort" :readonly="isView" />
        </t-form-item>
        <!-- 数据范围 -->
        <t-form-item label="数据范围" name="dataScope">
          <t-select v-model="formData.dataScope" :readonly="isView">
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
              <t-checkbox v-model="formData.menuCheckStrictly" :readonly="isView">父子联动</t-checkbox>
            </t-space>
            <t-tree
              ref="tree"
              v-model="allCheckedKeys"
              v-model:expanded="allExpandedKeys"
              :data="menuTree"
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
        <!-- 角色状态 -->
        <t-form-item label="角色状态" name="status">
          <t-select
            v-model="formData.status"
            :readonly="isView"
            clearable
            :options="dicts.sys_normal_disable"
            :keys="{
              label: 'dictLabel',
              value: 'dictValue',
            }"
            placeholder="请选择角色状态"
          >
          </t-select>
        </t-form-item>
        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="formData.remark" :readonly="isView" clearable placeholder="请输入备注" />
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

import { getDictOptions } from '@/api/system/dict';
import { getMenuTreeSelectOptions } from '@/api/system/menu';
import { addRole, editRole } from '@/api/system/role';
import { t } from '@/locales';
import { components } from '@/types/schema';

import { INITIAL_DATA, RULES } from '../constants';

interface Props {
  data: typeof INITIAL_DATA;
  visible: boolean;
  mode: 'create' | 'edit' | 'view';
}
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  visible: false,
  mode: 'create',
});
const emit = defineEmits(['update:visible', 'submit']);

const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const menuTree = ref<components['schemas']['TreeLong'][]>();
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});
const tree = ref<TreeInstanceFunctions>();
const valueMode = ref<TreeProps['valueMode']>('all');
const allCheckedKeys = ref([]);
const allExpandedKeys = ref<TreeProps['expanded']>([]);
const expandAll = ref(false);
const checkedAll = ref(false);

const handleExpandAll: CheckboxProps['onChange'] = (checked) => {
  if (checked) {
    allExpandedKeys.value = menuTree.value.map((i) => i.id);
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
  switch (props.mode) {
    case 'create':
      return t('pages.common.actions.create');
    case 'edit':
      return t('pages.common.actions.edit');
    case 'view':
      return t('pages.common.actions.view');
    default:
      return '';
  }
});

const isView = computed(() => props.mode === 'view');

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    formData.value.menuIds = allCheckedKeys.value;

    if (props.mode === 'create') {
      await addRole(formData.value);
    } else if (props.mode === 'edit') {
      await editRole(formData.value);
    } else {
      console.warn('未知操作类型');
    }
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
  menuTree.value = await getMenuTreeSelectOptions();
  dicts.value = await getDictOptions(['sys_normal_disable']);
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
