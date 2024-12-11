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
        <!-- 客户端 id -->
        <t-form-item label="客户端 id" name="clientId">
          <t-input v-model="formData.clientId" :readonly="isView" clearable placeholder="请输入客户端 id" />
        </t-form-item>
        <!-- 客户端 key -->
        <t-form-item label="客户端 key" name="clientKey" :rules="[{ required: true, message: '请输入客户端 key' }]">
          <t-input v-model="formData.clientKey" :readonly="isView" clearable placeholder="请输入客户端 key" />
        </t-form-item>
        <!-- 客户端秘钥 -->
        <t-form-item label="客户端秘钥" name="clientSecret" :rules="[{ required: true, message: '请输入客户端秘钥' }]">
          <t-input
            v-model="formData.clientSecret"
            :readonly="isView"
            clearable
            placeholder="请输入客户端秘钥"
            type="password"
          />
        </t-form-item>
        <!-- 授权类型 -->
        <t-form-item label="授权类型" name="grantType">
          <t-input v-model="formData.grantType" :readonly="isView" clearable placeholder="请输入授权类型" />
        </t-form-item>
        <!-- 设备类型 -->
        <t-form-item label="设备类型" name="deviceType">
          <t-input v-model="formData.deviceType" :readonly="isView" clearable placeholder="请输入设备类型" />
        </t-form-item>
        <!-- token 活跃超时时间 -->
        <t-form-item label="token 活跃超时时间" name="activeTimeout">
          <t-input-number v-model="formData.activeTimeout" :readonly="isView" />
        </t-form-item>
        <!-- token 固定超时时间 -->
        <t-form-item label="token 固定超时时间" name="timeout">
          <t-input-number v-model="formData.timeout" :readonly="isView" />
        </t-form-item>
        <!-- 状态 -->
        <t-form-item label="状态" name="status">
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

import { addClient } from '@/api/system/client';
import { getDictOptions } from '@/api/system/dict';
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

const isView = computed(() => props.mode === 'view');

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    if (props.mode === 'create') {
      //
    } else if (props.mode === 'edit') {
      //
    } else {
      console.warn('未知操作类型');
    }
    await addClient(formData.value);
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
