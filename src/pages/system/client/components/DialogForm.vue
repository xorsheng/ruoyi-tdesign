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
        <!-- 客户端 key -->
        <t-form-item label="客户端 key" name="clientKey" :rules="[{ required: true, message: '请输入客户端 key' }]">
          <t-input
            v-model="formData.clientKey"
            :readonly="isView"
            :disabled="props.mode !== 'create'"
            clearable
            placeholder="请输入客户端 key"
          />
        </t-form-item>
        <!-- 客户端秘钥 -->
        <t-form-item label="客户端秘钥" name="clientSecret" :rules="[{ required: true, message: '请输入客户端秘钥' }]">
          <t-input
            v-model="formData.clientSecret"
            :readonly="isView"
            :disabled="props.mode !== 'create'"
            clearable
            placeholder="请输入客户端秘钥"
          />
        </t-form-item>
        <!-- 授权类型 -->
        <t-form-item label="授权类型" name="grantType">
          <t-select
            v-model="formData.grantTypeList"
            :readonly="isView"
            :options="dicts['sys_grant_type']"
            :keys="{
              label: 'dictLabel',
              value: 'dictValue',
            }"
            clearable
            placeholder="请选择授权类型"
            multiple
          >
          </t-select>
        </t-form-item>
        <!-- 设备类型 -->
        <t-form-item label="设备类型" name="deviceType">
          <t-select
            v-model="formData.deviceType"
            :options="dicts['sys_device_type']"
            :keys="{
              label: 'dictLabel',
              value: 'dictValue',
            }"
            :readonly="isView"
            clearable
            placeholder="请输入设备类型"
          >
          </t-select>
        </t-form-item>
        <!-- token 活跃超时时间 -->
        <t-form-item label="token 活跃超时时间" name="activeTimeout" label-width="auto">
          <t-input v-model="formData.activeTimeout" type="number" :readonly="isView" suffix="秒" />
        </t-form-item>
        <!-- token 固定超时时间 -->
        <t-form-item label="token 固定超时时间" name="timeout" label-width="auto">
          <t-input v-model="formData.timeout" type="number" :readonly="isView" suffix="秒" />
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

import { addClient, editClient, getClientDetail } from '@/api/system/client';
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
      return '新建';
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
      await addClient(formData.value);
    } else if (props.mode === 'edit') {
      await editClient(formData.value);
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
  if (props.data.id) {
    const result = await getClientDetail(props.data.id as unknown as string);
    formData.value = { ...INITIAL_DATA, ...result };
  }
  dicts.value = await getDictOptions(['sys_normal_disable', 'sys_grant_type', 'sys_device_type']);
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
