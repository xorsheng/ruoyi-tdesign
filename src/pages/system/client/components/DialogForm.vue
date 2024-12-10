<template>
  <t-dialog v-model:visible="formVisible" :header="t('pages.common.actions.create')" :width="680" :footer="false">
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="100" @submit="onSubmit">
        <!-- id -->
        <t-form-item label="id" name="id" :rules="[{ required: true, message: '请输入 id' }]">
          <t-input-number v-model="formData.id" />
        </t-form-item>
        <!-- 客户端 id -->
        <t-form-item label="客户端 id" name="clientId">
          <t-input v-model="formData.clientId" clearable placeholder="请输入客户端 id" />
        </t-form-item>
        <!-- 客户端 key -->
        <t-form-item label="客户端 key" name="clientKey" :rules="[{ required: true, message: '请输入客户端 key' }]">
          <t-input v-model="formData.clientKey" clearable placeholder="请输入客户端 key" />
        </t-form-item>
        <!-- 客户端秘钥 -->
        <t-form-item label="客户端秘钥" name="clientSecret" :rules="[{ required: true, message: '请输入客户端秘钥' }]">
          <t-input v-model="formData.clientSecret" clearable placeholder="请输入客户端秘钥" type="password" />
        </t-form-item>
        <!-- 授权类型 -->
        <t-form-item label="授权类型" name="grantType">
          <t-input v-model="formData.grantType" clearable placeholder="请输入授权类型" />
        </t-form-item>
        <!-- 设备类型 -->
        <t-form-item label="设备类型" name="deviceType">
          <t-input v-model="formData.deviceType" clearable placeholder="请输入设备类型" />
        </t-form-item>
        <!-- token 活跃超时时间 -->
        <t-form-item label="token 活跃超时时间" name="activeTimeout">
          <t-input-number v-model="formData.activeTimeout" />
        </t-form-item>
        <!-- token 固定超时时间 -->
        <t-form-item label="token 固定超时时间" name="timeout">
          <t-input-number v-model="formData.timeout" />
        </t-form-item>
        <!-- 状态 -->
        <t-form-item label="状态" name="status">
          <t-select v-model="formData.status">
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
