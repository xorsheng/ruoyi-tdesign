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
      <t-form
        ref="form"
        :data="formData"
        :rules="DICT_DATA_RULES"
        :label-width="120"
        label-align="right"
        @submit="onSubmit"
      >
        <!-- dictType -->
        <t-form-item label="字典类型" name="dictType">
          <t-input v-model="formData.dictType" :readonly="true" clearable placeholder="请输入字典类型" />
        </t-form-item>

        <!-- 字典标签 -->
        <t-form-item label="字典标签" name="dictLabel" :rules="[{ required: true, message: '请输入字典标签' }]">
          <t-input v-model="formData.dictLabel" :readonly="isView" clearable placeholder="请输入字典标签" />
        </t-form-item>

        <!-- 字典键值 -->
        <t-form-item label="字典键值" name="dictValue" :rules="[{ required: true, message: '请输入字典键值' }]">
          <t-input v-model="formData.dictValue" :readonly="isView" clearable placeholder="请输入字典键值" />
        </t-form-item>

        <!-- 字典排序 -->
        <t-form-item label="字典排序" name="dictSort" :rules="[{ required: true, message: '请输入字典排序' }]">
          <t-input-number v-model="formData.dictSort" :readonly="isView" :min="0" :max="999" />
        </t-form-item>

        <!-- CSS样式 -->
        <t-form-item label="CSS样式" name="cssClass">
          <t-input v-model="formData.cssClass" :readonly="isView" clearable placeholder="请输入样式属性" />
        </t-form-item>

        <!-- 回显样式 -->
        <t-form-item label="回显样式" name="listClass">
          <t-input v-model="formData.listClass" :readonly="isView" clearable placeholder="请输入回显样式" />
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

        <t-form-item v-if="!isView" style="float: right">
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

import { addDictData, editDictData, getDictDataDetail, getDictOptions } from '@/api/system/dict';
import { t } from '@/locales';
import { components } from '@/types/schema';

import { DICT_DATA_INITIAL_DATA, DICT_DATA_RULES } from '../constants';

interface Props {
  data: typeof DICT_DATA_INITIAL_DATA;
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
const formData = ref({ ...DICT_DATA_INITIAL_DATA });
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
      await addDictData(formData.value);
    } else if (props.mode === 'edit') {
      await editDictData(formData.value);
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
  formData.value = { ...DICT_DATA_INITIAL_DATA };
};

const handleDialogOpened = async () => {
  if (props.data.dictCode) {
    const result = await getDictDataDetail(props.data.dictCode as unknown as string);
    formData.value = { ...DICT_DATA_INITIAL_DATA, ...result };
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
