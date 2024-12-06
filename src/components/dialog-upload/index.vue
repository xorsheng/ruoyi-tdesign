<template>
  <t-dialog v-model:visible="formVisible" :header="t('pages.common.actions.import')" :width="680" :footer="false">
    <template #body>
      <t-form ref="form" :data="formData" :rules="RULES" :label-width="100" @submit="onSubmit">
        <t-form-item>
          <t-upload
            ref="uploadRef"
            v-model="files"
            :theme="display"
            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            :headers="{ a: 'N1', b: 'N2' }"
            :placeholder="multiple ? '文件数量不超过 5 个' : '要求文件大小在 1M 以内'"
            :multiple="multiple"
            :auto-upload="autoUpload"
            :upload-all-files-in-one-request="uploadInOneRequest"
            :is-batch-upload="isBatchUpload"
            :size-limit="{ size: 1, unit: 'MB' }"
            :max="5"
            :disabled="disabled"
            draggable
            :allow-upload-duplicate-file="true"
            @select-change="handleSelectChange"
            @fail="handleFail"
            @success="handleSuccess"
            @one-file-success="onOneFileSuccess"
            @validate="onValidate"
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
import {
  MessagePlugin,
  SubmitContext,
  UploadInstanceFunctions,
  UploadProps,
  UploadSelectChangeContext,
} from 'tdesign-vue-next';
import { ref, watch } from 'vue';

import { t } from '@/locales';

import { INITIAL_DATA, RULES } from './constants';

interface Props {
  visible: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const uploadRef = ref<UploadInstanceFunctions>();
const files = ref<UploadProps['value']>([]);
const display = ref<UploadProps['theme']>('file');
const multiple = ref(false);
const uploadInOneRequest = ref(false);
const autoUpload = ref(true);
const isBatchUpload = ref(false);
const disabled = ref(false);

const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
function handleSelectChange(files: File[], context: UploadSelectChangeContext) {
  console.log('onSelectChange', files, context);
}
const handleSuccess: UploadProps['onSuccess'] = (params) => {
  console.log('success', params);
  MessagePlugin.success('上传成功');
};
// 多文件上传，一个文件一个请求场景，每个文件也会单独触发上传成功的事件
const onOneFileSuccess: UploadProps['onOneFileSuccess'] = (params) => {
  console.log('onOneFileSuccess', params);
};
// 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
const onValidate: UploadProps['onValidate'] = (params) => {
  const { files, type } = params;
  console.log('onValidate', type, files);
  const messageMap = {
    FILE_OVER_SIZE_LIMIT: '文件大小超出限制，已自动过滤',
    FILES_OVER_LENGTH_LIMIT: '文件数量超出限制，仅上传未超出数量的文件',
    // if you need same name files, setting allowUploadDuplicateFile={true} please
    FILTER_FILE_SAME_NAME: '不允许上传同名文件',
    BEFORE_ALL_FILES_UPLOAD: 'beforeAllFilesUpload 方法拦截了文件',
    CUSTOM_BEFORE_UPLOAD: 'beforeUpload 方法拦截了文件',
  };
  MessagePlugin.warning(messageMap[type]);
};

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
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

const emit = defineEmits(['update:visible']);
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
</script>
