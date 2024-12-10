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
        <!-- 部门 id -->
        <t-form-item label="部门 id" name="deptId">
          <t-input-number v-model="formData.deptId" />
        </t-form-item>
        <!-- 父部门 ID -->
        <t-form-item label="父部门 ID" name="parentId">
          <t-input-number v-model="formData.parentId" />
        </t-form-item>
        <!-- 部门名称 -->
        <t-form-item label="部门名称" name="deptName" :rules="[{ required: true, message: '请输入部门名称' }]">
          <t-input v-model="formData.deptName" clearable placeholder="请输入部门名称" />
        </t-form-item>
        <!-- 部门类别编码 -->
        <t-form-item label="部门类别编码" name="deptCategory">
          <t-input v-model="formData.deptCategory" clearable placeholder="请输入部门类别编码" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="orderNum" :rules="[{ required: true, message: '请输入显示顺序' }]">
          <t-input-number v-model="formData.orderNum" />
        </t-form-item>
        <!-- 负责人 -->
        <t-form-item label="负责人" name="leader">
          <t-input-number v-model="formData.leader" />
        </t-form-item>
        <!-- 联系电话 -->
        <t-form-item label="联系电话" name="phone">
          <t-input v-model="formData.phone" clearable placeholder="请输入联系电话" />
        </t-form-item>
        <!-- 邮箱 -->
        <t-form-item label="邮箱" name="email">
          <t-input v-model="formData.email" clearable placeholder="请输入邮箱" />
        </t-form-item>
        <!-- 部门状态 -->
        <t-form-item label="部门状态" name="status">
          <t-select v-model="formData.status">
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
import { ref, watch } from 'vue';

import { addDept } from '@/api/system/dept';
import { getDictOptions } from '@/api/system/dict';
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
    await addDept(formData.value);
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
