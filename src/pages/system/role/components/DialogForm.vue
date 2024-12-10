<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="t('pages.common.actions.create')"
    :width="680"
    :footer="false"
    destroy-on-close
    @opened="handleDialogOpened"
  >
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="120" label-align="right" @submit="onSubmit">
        <!-- 角色名称 -->
        <t-form-item label="角色名称" name="roleName">
          <t-input v-model="formData.roleName" clearable placeholder="请输入角色名称" />
        </t-form-item>
        <!-- 角色权限字符串 -->
        <t-form-item label="角色权限字符" name="roleKey">
          <t-input v-model="formData.roleKey" clearable placeholder="请输入角色权限字符" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="roleSort" :rules="[{ required: true, message: '请输入显示顺序' }]">
          <t-input-number v-model="formData.roleSort" />
        </t-form-item>
        <!-- 数据范围 -->
        <t-form-item label="数据范围" name="dataScope">
          <t-select v-model="formData.dataScope">
            <t-option value="1">全部数据权限</t-option>
            <t-option value="2">自定数据权限</t-option>
            <t-option value="3">本部门数据权限</t-option>
            <t-option value="4">本部门及以下数据权限</t-option>
          </t-select>
        </t-form-item>
        <!-- 菜单树选择项是否关联显示 -->
        <t-form-item label="菜单树选择项是否关联显示" name="menuCheckStrictly">
          <t-switch v-model="formData.menuCheckStrictly" />
        </t-form-item>
        <!-- 部门树选择项是否关联显示 -->
        <t-form-item label="部门树选择项是否关联显示" name="deptCheckStrictly">
          <t-switch v-model="formData.deptCheckStrictly" />
        </t-form-item>
        <!-- 角色状态 -->
        <t-form-item label="角色状态" name="status">
          <t-select v-model="formData.status">
            <t-option value="0">正常</t-option>
            <t-option value="1">停用</t-option>
          </t-select>
        </t-form-item>
        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-input v-model="formData.remark" clearable placeholder="请输入备注" />
        </t-form-item>
        <!-- 菜单组 -->
        <t-form-item label="菜单组" name="menuIds">
          <t-checkbox-group v-model="formData.menuIds">
            <t-checkbox value="1">菜单 1</t-checkbox>
            <t-checkbox value="2">菜单 2</t-checkbox>
            <!-- 根据实际情况添加更多菜单选项 -->
          </t-checkbox-group>
        </t-form-item>
        <!-- 部门组 -->
        <t-form-item label="部门组" name="deptIds">
          <t-checkbox-group v-model="formData.deptIds">
            <t-checkbox value="1">部门 1</t-checkbox>
            <t-checkbox value="2">部门 2</t-checkbox>
            <!-- 根据实际情况添加更多部门选项 -->
          </t-checkbox-group>
        </t-form-item>
        <!-- 超级管理员 -->
        <t-form-item label="超级管理员" name="superAdmin">
          <t-switch v-model="formData.superAdmin" />
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
import { ref, watch } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { addRole } from '@/api/system/role';
import { t } from '@/locales';
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
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    await addRole(formData.value);
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
