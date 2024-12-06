<template>
  <t-dialog v-model:visible="formVisible" header="导入数据" :width="680" :footer="false" destroy-on-close>
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="120" @submit="onSubmit">
        <t-form-item label="Excel文件" help="仅允许导入xls、xlsx格式的文件">
          <t-upload
            ref="uploadRef"
            v-model="formData.files"
            :abridge-name="[8, 6]"
            theme="file-input"
            placeholder="未选择文件"
            :auto-upload="false"
            :max="1"
            :request-method="requestMethod"
            @success="handleSuccess"
            @fail="handleFail"
          ></t-upload>
        </t-form-item>
        <t-form-item label="更新数据" name="updateSupport">
          <t-checkbox v-model="formData.updateSupport">是否更新已经存在的数据</t-checkbox>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
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
    <div v-html="errMsg"></div>
  </t-dialog>
</template>

<script setup lang="ts">
import {
  FormRules,
  MessagePlugin,
  SubmitContext,
  UploadFile,
  UploadInstanceFunctions,
  UploadProps,
} from 'tdesign-vue-next';
import { ref, watch } from 'vue';

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
  uploadFn: Function,
});
const emit = defineEmits(['update:visible', 'success']);

const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const uploadRef = ref<UploadInstanceFunctions>();
const errVisible = ref(false);
const errMsg = ref('');
const requestMethod: UploadProps['requestMethod'] = (file) => {
  return new Promise((resolve) => {
    props
      .uploadFn({ file: (file as UploadFile).raw }, { updateSupport: formData.value.updateSupport })
      .then((res: { code: number; msg: string }) => {
        console.log('upload', res);
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
  emit('success');
};
const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
  errMsg.value = file.response.error;
  errVisible.value = true;
  formData.value.files = [];
};

const onSubmit = ({ firstError }: SubmitContext) => {
  if (!firstError) {
    uploadRef.value.uploadFiles();
  } else {
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

const rules: FormRules<FormData> = {
  files: [{ required: true, message: '请选择文件', type: 'error' }],
};
</script>
