<template>
  <t-dialog v-model:visible="formVisible" :header="t('pages.common.actions.create')" :width="680" :footer="false">
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="100" @submit="onSubmit">
        <!-- 菜单 ID -->
        <t-form-item label="菜单 ID" name="menuId">
          <t-input-number v-model="formData.menuId" />
        </t-form-item>
        <!-- 父菜单 ID -->
        <t-form-item label="父菜单 ID" name="parentId">
          <t-input-number v-model="formData.parentId" />
        </t-form-item>
        <!-- 菜单名称 -->
        <t-form-item label="菜单名称" name="menuName" :rules="[{ required: true, message: '请输入菜单名称' }]">
          <t-input v-model="formData.menuName" clearable placeholder="请输入菜单名称" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="orderNum" :rules="[{ required: true, message: '请输入显示顺序' }]">
          <t-input-number v-model="formData.orderNum" />
        </t-form-item>
        <!-- 路由地址 -->
        <t-form-item label="路由地址" name="path">
          <t-input v-model="formData.path" clearable placeholder="请输入路由地址" />
        </t-form-item>
        <!-- 组件路径 -->
        <t-form-item label="组件路径" name="component">
          <t-input v-model="formData.component" clearable placeholder="请输入组件路径" />
        </t-form-item>
        <!-- 路由参数 -->
        <t-form-item label="路由参数" name="queryParam">
          <t-input v-model="formData.queryParam" clearable placeholder="请输入路由参数" />
        </t-form-item>
        <!-- 是否为外链 -->
        <t-form-item label="是否为外链" name="isFrame">
          <t-select v-model="formData.isFrame">
            <t-option value="0">是</t-option>
            <t-option value="1">否</t-option>
          </t-select>
        </t-form-item>
        <!-- 是否缓存 -->
        <t-form-item label="是否缓存" name="isCache">
          <t-select v-model="formData.isCache">
            <t-option value="0">缓存</t-option>
            <t-option value="1">不缓存</t-option>
          </t-select>
        </t-form-item>
        <!-- 菜单类型 -->
        <t-form-item label="菜单类型" name="menuType" :rules="[{ required: true, message: '请输入菜单类型' }]">
          <t-input v-model="formData.menuType" clearable placeholder="请输入菜单类型（M 目录 C 菜单 F 按钮）" />
        </t-form-item>
        <!-- 显示状态 -->
        <t-form-item label="显示状态" name="visible">
          <t-select v-model="formData.visible">
            <t-option value="0">显示</t-option>
            <t-option value="1">隐藏</t-option>
          </t-select>
        </t-form-item>
        <!-- 菜单状态 -->
        <t-form-item label="菜单状态" name="status">
          <t-select v-model="formData.status">
            <t-option value="0">正常</t-option>
            <t-option value="1">停用</t-option>
          </t-select>
        </t-form-item>
        <!-- 权限标识 -->
        <t-form-item label="权限标识" name="perms">
          <t-input v-model="formData.perms" clearable placeholder="请输入权限标识" />
        </t-form-item>
        <!-- 菜单图标 -->
        <t-form-item label="菜单图标" name="icon">
          <t-input v-model="formData.icon" clearable placeholder="请输入菜单图标" />
        </t-form-item>
        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-input v-model="formData.remark" clearable placeholder="请输入备注" />
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

import { t } from '@/locales';

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

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
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
