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
        <!-- 用户账号 -->
        <t-form-item label="用户账号" name="userName" :rules="[{ required: true, message: '请输入用户账号' }]">
          <t-input v-model="formData.userName" :readonly="isView" clearable placeholder="请输入用户账号" />
        </t-form-item>

        <!-- 用户昵称 -->
        <t-form-item label="用户昵称" name="nickName" :rules="[{ required: true, message: '请输入用户昵称' }]">
          <t-input v-model="formData.nickName" :readonly="isView" clearable placeholder="请输入用户昵称" />
        </t-form-item>

        <!-- 用户邮箱 -->
        <t-form-item label="用户邮箱" name="email" :rules="[{ email: true, message: '请输入正确的邮箱地址' }]">
          <t-input v-model="formData.email" :readonly="isView" clearable placeholder="请输入用户邮箱" />
        </t-form-item>

        <!-- 手机号码 -->
        <t-form-item
          label="手机号码"
          name="phonenumber"
          :rules="[{ telnumber: true, message: '请输入正确的手机号码' }]"
        >
          <t-input v-model="formData.phonenumber" :readonly="isView" clearable placeholder="请输入手机号码" />
        </t-form-item>

        <!-- 用户性别 -->
        <t-form-item label="用户性别" name="sex">
          <t-select
            v-model="formData.sex"
            :readonly="isView"
            clearable
            :options="dicts.sys_user_sex"
            :keys="{
              label: 'dictLabel',
              value: 'dictValue',
            }"
            placeholder="请选择性别"
          >
          </t-select>
        </t-form-item>

        <!-- 部门 -->
        <t-form-item
          label="所属部门"
          name="deptId"
          :rules="[{ required: true, message: '请选择所属部门', type: 'error' }]"
        >
          <t-tree-select
            v-model="formData.deptId"
            :readonly="isView"
            clearable
            :data="deptTree"
            :keys="{
              label: 'label',
              value: 'id',
            }"
            placeholder="请选择部门"
            filterable
            @change="handleDeptChange"
          >
          </t-tree-select>
        </t-form-item>

        <!-- 角色组 -->
        <t-form-item label="角色组" name="roleIds">
          <t-select
            v-model="formData.roleIds"
            :readonly="isView"
            clearable
            :options="roles"
            :keys="{
              label: 'roleName',
              value: 'roleId',
            }"
            placeholder="请选择角色"
            multiple
            filterable
          >
          </t-select>
        </t-form-item>

        <!-- 岗位组 -->
        <t-form-item label="岗位组" name="postIds">
          <t-select
            v-model="formData.postIds"
            :readonly="isView"
            clearable
            :options="posts"
            :keys="{
              label: 'postName',
              value: 'postId',
            }"
            placeholder="请选择岗位"
            multiple
          >
          </t-select>
        </t-form-item>

        <!-- 帐号状态 -->
        <t-form-item
          label="帐号状态"
          name="status"
          :rules="[{ required: true, message: '请选择帐号状态', type: 'error' }]"
        >
          <t-select
            v-model="formData.status"
            :readonly="isView"
            clearable
            :options="dicts.sys_normal_disable"
            :keys="{
              label: 'dictLabel',
              value: 'dictValue',
            }"
            placeholder="请选择帐号状态"
          >
          </t-select>
        </t-form-item>

        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="formData.remark" :readonly="isView" clearable placeholder="请输入备注" />
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
import { MessagePlugin, SubmitContext, TreeSelectProps } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { getPostOptions } from '@/api/system/post';
import { addUser, editUser, getDeptTree, getUserDetail } from '@/api/system/user';
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
const deptTree = ref<components['schemas']['TreeLong'][]>([]);
const roles = ref<components['schemas']['SysRoleVo'][]>([]);
const posts = ref<components['schemas']['SysPostVo'][]>([]);
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
      await addUser(formData.value);
    } else if (props.mode === 'edit') {
      await editUser(formData.value);
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
  const result = await getUserDetail(props.data.userId as unknown as string);
  formData.value = { ...INITIAL_DATA, ...result.user, ...result };
  roles.value = result.roles;
  posts.value = [...(await getPostOptions()), ...result.posts];
  deptTree.value = await getDeptTree();
  dicts.value = await getDictOptions(['sys_user_sex', 'sys_normal_disable']);
  console.log(result, formData.value);
};
const handleDeptChange: TreeSelectProps['onChange'] = async (value) => {
  posts.value = await getPostOptions({
    deptId: value as number,
    postIds: [],
  });
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
