<template>
  <t-dialog v-model:visible="formVisible" :header="t('pages.common.actions.create')" :width="680" :footer="false">
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="100" @submit="onSubmit">
        <!-- 字典主键 -->
        <t-form-item label="字典主键" name="dictId">
          <t-input-number v-model="formData.dictId" />
        </t-form-item>
        <!-- 字典名称 -->
        <t-form-item label="字典名称" name="dictName" :rules="[{ required: true, message: '请输入字典名称' }]">
          <t-input v-model="formData.dictName" clearable placeholder="请输入字典名称" />
        </t-form-item>
        <!-- 字典类型 -->
        <t-form-item label="字典类型" name="dictType" :rules="[{ required: true, message: '请输入字典类型' }]">
          <t-input v-model="formData.dictType" clearable placeholder="请输入字典类型" />
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
