<template>
  <t-dialog v-model:visible="formVisible" header="导入数据" :width="680" :footer="false" destroy-on-close>
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="120" @submit="onSubmit">
        <t-form-item label="Excel文件" name="files" help="仅允许导入xls、xlsx格式的文件">
          <t-upload
            ref="uploadRef"
            v-model="formData.files"
            :abridge-name="[8, 6]"
            theme="file-input"
            placeholder="点击选择需要上传的Excel文件"
            :auto-upload="false"
            :max="1"
            :request-method="requestMethod"
            :accept="'.xls,.xlsx'"
            :size-limit="sizeLimit"
            :before-upload="beforeUpload"
            @success="handleSuccess"
            @fail="handleFail"
            @validate="onValidate"
          ></t-upload>
        </t-form-item>
        <t-form-item label="更新数据" name="updateSupport">
          <t-checkbox v-model="formData.updateSupport">是否更新已经存在的数据</t-checkbox>
        </t-form-item>
        <t-form-item class="form-actions">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit" :disabled="isSubmitting">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <t-dialog
    v-model:visible="errVisible"
    theme="danger"
    attach="body"
    header="错误"
    :cancel-btn="null"
    @confirm="errVisible = false"
  >
    <div>{{ errMsg }}</div>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SizeLimitObj, SubmitContext, UploadFile, UploadProps } from 'tdesign-vue-next';
import { computed, PropType, ref } from 'vue';

export interface FormData {
  files: UploadProps['value'];
  updateSupport: boolean;
}

const INITIAL_DATA: FormData = {
  files: [],
  updateSupport: false,
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // upload fn
  uploadFn: {
    type: Function,
    required: true,
  },
  // 文件大小限制，默认50MB
  sizeLimit: {
    type: Object as PropType<SizeLimitObj>,
    default: () => ({
      size: 50,
      unit: 'MB',
      message: '文件大小超过限制',
    }),
  },
});

const emit = defineEmits(['update:visible', 'success']);

const formVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const formData = ref({ ...INITIAL_DATA });
const uploadRef = ref();
const errVisible = ref(false);
const errMsg = ref('');
const isSubmitting = ref(false);

const requestMethod: UploadProps['requestMethod'] = (file) => {
  return new Promise((resolve) => {
    props
      .uploadFn({ file: (file as UploadFile).raw }, { updateSupport: formData.value.updateSupport })
      .then((res: { code: number; msg: string }) => {
        if (res.code === 200) {
          resolve({
            status: 'success',
            response: {
              url: '',
            },
          });
        } else {
          resolve({
            status: 'fail',
            error: res.msg,
            response: {},
          });
        }
      });
  });
};

const handleSuccess: UploadProps['onSuccess'] = ({ file }) => {
  MessagePlugin.success(`文件 ${file.name} 上传成功`);
  formData.value = { ...INITIAL_DATA };
  formVisible.value = false;
  isSubmitting.value = false;
  emit('success');
};

const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
  errMsg.value = file.response?.error || '上传失败，请稍后再试';
  errVisible.value = true;
  formData.value.files = [];
  isSubmitting.value = false;
};

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (!validTypes.includes(file.type)) {
    MessagePlugin.error('仅允许上传xls、xlsx格式的文件');
    return false;
  }
  return true;
};

const onValidate: UploadProps['onValidate'] = ({ type }) => {
  if (type === 'FILE_OVER_SIZE_LIMIT') {
    MessagePlugin.error('文件大小超过限制，请选择更小的文件。');
  }
};

const onSubmit = ({ firstError }: SubmitContext) => {
  if (!firstError) {
    isSubmitting.value = true;
    uploadRef.value?.uploadFiles();
  } else {
    MessagePlugin.warning(firstError);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

const rules: FormRules<FormData> = {
  files: [{ required: true, message: '请选择文件', type: 'error' }],
};
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
