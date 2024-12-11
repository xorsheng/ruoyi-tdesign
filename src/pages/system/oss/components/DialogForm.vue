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
        <!-- ossId -->
        <t-form-item label="ossId" name="ossId">
          <t-input-number v-model="formData.ossId" :readonly="isView" />
        </t-form-item>
        <!-- 文件名 -->
        <t-form-item label="文件名" name="fileName">
          <t-input v-model="formData.fileName" :readonly="isView" clearable placeholder="请输入文件名" />
        </t-form-item>
        <!-- 原名 -->
        <t-form-item label="原名" name="originalName">
          <t-input v-model="formData.originalName" :readonly="isView" clearable placeholder="请输入原名" />
        </t-form-item>
        <!-- 文件后缀名 -->
        <t-form-item label="文件后缀名" name="fileSuffix">
          <t-input v-model="formData.fileSuffix" :readonly="isView" clearable placeholder="请输入文件后缀名" />
        </t-form-item>
        <!-- URL 地址 -->
        <t-form-item label="URL 地址" name="url">
          <t-input v-model="formData.url" :readonly="isView" clearable placeholder="请输入 URL 地址" />
        </t-form-item>
        <!-- 服务商 -->
        <t-form-item label="服务商" name="service">
          <t-input v-model="formData.service" :readonly="isView" clearable placeholder="请输入服务商" />
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
