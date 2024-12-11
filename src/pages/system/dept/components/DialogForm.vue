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
        <!-- 上级部门 ID -->
        <t-form-item label="上级部门" name="parentId">
          <t-tree-select
            v-model="formData.parentId"
            :readonly="isView"
            style="width: 100%"
            :data="deptTree"
            :keys="{
              label: 'deptName',
              value: 'deptId',
            }"
            placeholder="请选择部门"
            filterable
          ></t-tree-select>
        </t-form-item>
        <!-- 部门名称 -->
        <t-form-item label="部门名称" name="deptName">
          <t-input v-model="formData.deptName" :readonly="isView" clearable placeholder="请输入部门名称" />
        </t-form-item>
        <!-- 部门类别编码 -->
        <t-form-item label="部门类别编码" name="deptCategory">
          <t-input v-model="formData.deptCategory" :readonly="isView" clearable placeholder="请输入部门类别编码" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="orderNum">
          <t-input-number v-model="formData.orderNum" :readonly="isView" />
        </t-form-item>
        <!-- 负责人 -->
        <t-form-item label="负责人" name="leader">
          <t-input v-model="formData.leader" :readonly="isView" />
        </t-form-item>
        <!-- 联系电话 -->
        <t-form-item label="联系电话" name="phone">
          <t-input v-model="formData.phone" :readonly="isView" clearable placeholder="请输入联系电话" />
        </t-form-item>
        <!-- 邮箱 -->
        <t-form-item label="邮箱" name="email">
          <t-input v-model="formData.email" :readonly="isView" clearable placeholder="请输入邮箱" />
        </t-form-item>
        <!-- 部门状态 -->
        <t-form-item label="部门状态" name="status">
          <t-select v-model="formData.status" :readonly="isView">
            <t-option value="0">正常</t-option>
            <t-option value="1">停用</t-option>
          </t-select>
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
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

import { addDept, getDeptList } from '@/api/system/dept';
import { getDictOptions } from '@/api/system/dict';
import { t } from '@/locales';
import { components } from '@/types/schema';
import { buildTree } from '@/utils/tree';

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
const deptTree = ref<components['schemas']['SysDeptVo'][]>([]);
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});

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

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    if (props.mode === 'create') {
      //
    } else if (props.mode === 'edit') {
      //
    } else {
      console.warn('未知操作类型');
    }
    await addDept(formData.value);
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
  const depts = await getDeptList();
  deptTree.value = buildTree(depts, 'deptId', 'parentId', 'children');
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
