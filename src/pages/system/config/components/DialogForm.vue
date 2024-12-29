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
        <!-- 参数名称 -->
        <t-form-item label="参数名称" name="configName" :rules="[{ required: true, message: '请输入参数名称' }]">
          <t-input v-model="formData.configName" :readonly="isView" clearable placeholder="请输入参数名称" />
        </t-form-item>
        <!-- 参数键名 -->
        <t-form-item label="参数键名" name="configKey" :rules="[{ required: true, message: '请输入参数键名' }]">
          <t-input v-model="formData.configKey" :readonly="isView" clearable placeholder="请输入参数键名" />
        </t-form-item>
        <!-- 参数键值 -->
        <t-form-item label="参数键值" name="configValue" :rules="[{ required: true, message: '请输入参数键值' }]">
          <t-input v-model="formData.configValue" :readonly="isView" clearable placeholder="请输入参数键值" />
        </t-form-item>
        <!-- 系统内置 -->
        <t-form-item label="系统内置" name="configType">
          <t-select v-model="formData.configType" :readonly="isView">
            <t-option value="Y">是</t-option>
            <t-option value="N">否</t-option>
          </t-select>
        </t-form-item>
        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            :readonly="isView"
            style="width: 100%"
            clearable
            placeholder="请输入备注"
          />
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

import { addConfig, editConfig, getConfigDetail } from '@/api/system/config';
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
      await addConfig(formData.value);
    } else if (props.mode === 'edit') {
      await editConfig(formData.value);
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
  if (props.data.configId) {
    const result = await getConfigDetail(props.data.configId as unknown as string);
    formData.value = { ...INITIAL_DATA, ...result };
  }
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
