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
        <!-- 部门 id（单部门） -->
        <t-form-item label="部门" name="deptId">
          <t-tree-select
            v-model="formData.deptId"
            :readonly="isView"
            :data="deptTree"
            :keys="{
              label: 'label',
              value: 'id',
            }"
          />
        </t-form-item>
        <!-- 岗位编码 -->
        <t-form-item label="岗位编码" name="postCode" :rules="[{ required: true, message: '请输入岗位编码' }]">
          <t-input v-model="formData.postCode" :readonly="isView" clearable placeholder="请输入岗位编码" />
        </t-form-item>
        <!-- 岗位名称 -->
        <t-form-item label="岗位名称" name="postName" :rules="[{ required: true, message: '请输入岗位名称' }]">
          <t-input v-model="formData.postName" :readonly="isView" clearable placeholder="请输入岗位名称" />
        </t-form-item>
        <!-- 岗位类别编码 -->
        <t-form-item label="岗位类别编码" name="postCategory">
          <t-input v-model="formData.postCategory" :readonly="isView" clearable placeholder="请输入岗位类别编码" />
        </t-form-item>
        <!-- 显示顺序 -->
        <t-form-item label="显示顺序" name="postSort" :rules="[{ required: true, message: '请输入显示顺序' }]">
          <t-input-number v-model="formData.postSort" :readonly="isView" />
        </t-form-item>
        <!-- 状态 -->
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status" :readonly="isView">
            <t-radio value="0">正常</t-radio>
            <t-radio value="1">停用</t-radio>
          </t-radio-group>
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

import { getDictOptions } from '@/api/system/dict';
import { addPost, editPost, getPostDetail } from '@/api/system/post';
import { getDeptTree } from '@/api/system/user';
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
const deptTree = ref<components['schemas']['TreeLong'][]>([]);
const dicts = ref<Recordable<components['schemas']['SysDictDataVo'][]>>({});

const dialogTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return '新建';
    case 'edit':
      return '编辑';
    case 'view':
      return '查看';
    default:
      return '';
  }
});

const isView = computed(() => props.mode === 'view');

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    if (props.mode === 'create') {
      await addPost(formData.value);
    } else if (props.mode === 'edit') {
      await editPost(formData.value);
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
  if (props.data.postId) {
    const result = await getPostDetail(props.data.postId as unknown as string);
    formData.value = { ...INITIAL_DATA, ...result };
  }
  const depts = await getDeptTree();
  deptTree.value = depts;
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
