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
        <!-- 公告 ID -->
        <t-form-item label="公告 ID" name="noticeId">
          <t-input-number v-model="formData.noticeId" />
        </t-form-item>
        <!-- 公告标题 -->
        <t-form-item label="公告标题" name="noticeTitle" :rules="[{ required: true, message: '请输入公告标题' }]">
          <t-input v-model="formData.noticeTitle" clearable placeholder="请输入公告标题" />
        </t-form-item>
        <!-- 公告类型 -->
        <t-form-item label="公告类型" name="noticeType">
          <t-select v-model="formData.noticeType">
            <t-option value="1">通知</t-option>
            <t-option value="2">公告</t-option>
          </t-select>
        </t-form-item>
        <!-- 公告内容 -->
        <t-form-item label="公告内容" name="noticeContent">
          <t-textarea v-model="formData.noticeContent" clearable placeholder="请输入公告内容" />
        </t-form-item>
        <!-- 公告状态 -->
        <t-form-item label="公告状态" name="status">
          <t-select v-model="formData.status">
            <t-option value="0">正常</t-option>
            <t-option value="1">关闭</t-option>
          </t-select>
        </t-form-item>
        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="formData.remark" style="width: 100%" clearable placeholder="请输入备注" />
        </t-form-item>
        <!-- 创建人名称 -->
        <t-form-item label="创建人名称" name="createByName">
          <t-input v-model="formData.createByName" clearable placeholder="请输入创建人名称" />
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
import { addNotice } from '@/api/system/notice';
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
    await addNotice(formData.value);
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
