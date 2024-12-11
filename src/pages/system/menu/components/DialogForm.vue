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
        :rules="RULES"
        :label-width="120"
        label-align="right"
        style="overflow: hidden"
        @submit="onSubmit"
      >
        <t-row :gutter="[20, 20]">
          <t-col :span="12">
            <!-- 父菜单 ID -->
            <t-form-item label="上级菜单" name="parentId">
              <t-tree-select
                v-model="formData.parentId"
                :readonly="isView"
                style="width: 100%"
                :data="menuTree"
                :keys="{
                  label: 'menuName',
                  value: 'menuId',
                }"
                placeholder="请选择菜单"
                filterable
              ></t-tree-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <!-- 菜单类型 -->
            <t-form-item label="菜单类型" name="menuType" :rules="[{ required: true, message: '请输入菜单类型' }]">
              <t-radio-group v-model="formData.menuType" :readonly="isView" style="width: 100%">
                <t-radio value="M">目录</t-radio>
                <t-radio value="C">菜单</t-radio>
                <t-radio value="F">按钮</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <!-- 菜单图标 -->
            <t-form-item label="菜单图标" name="icon">
              <t-input
                v-model="formData.icon"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入菜单图标"
              />
            </t-form-item>
          </t-col>

          <t-col :span="6">
            <!-- 菜单名称 -->
            <t-form-item label="菜单名称" name="menuName" :rules="[{ required: true, message: '请输入菜单名称' }]">
              <t-input
                v-model="formData.menuName"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入菜单名称"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 显示顺序 -->
            <t-form-item label="显示顺序" name="orderNum" :rules="[{ required: true, message: '请输入显示顺序' }]">
              <t-input-number v-model="formData.orderNum" :readonly="isView" style="width: 100%" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 路由地址 -->
            <t-form-item label="路由地址" name="path">
              <t-input
                v-model="formData.path"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入路由地址"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 组件路径 -->
            <t-form-item label="组件路径" name="component">
              <t-input
                v-model="formData.component"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入组件路径"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 路由参数 -->
            <t-form-item label="路由参数" name="queryParam">
              <t-input
                v-model="formData.queryParam"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入路由参数"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 是否为外链 -->
            <t-form-item label="是否为外链" name="isFrame">
              <t-radio-group v-model="formData.isFrame" :readonly="isView" style="width: 100%">
                <t-radio value="0">是</t-radio>
                <t-radio value="1">否</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 是否缓存 -->
            <t-form-item label="是否缓存" name="isCache">
              <t-radio-group v-model="formData.isCache" :readonly="isView" style="width: 100%">
                <t-radio value="0">缓存</t-radio>
                <t-radio value="1">不缓存</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 显示状态 -->
            <t-form-item label="显示状态" name="visible">
              <t-radio-group v-model="formData.visible" :readonly="isView" style="width: 100%">
                <t-radio value="0">显示</t-radio>
                <t-radio value="1">隐藏</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <!-- 菜单状态 -->
            <t-form-item label="菜单状态" name="status">
              <t-radio-group v-model="formData.status" :readonly="isView" style="width: 100%">
                <t-radio value="0">正常</t-radio>
                <t-radio value="1">停用</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <!-- 权限标识 -->
            <t-form-item label="权限标识" name="perms">
              <t-input
                v-model="formData.perms"
                :readonly="isView"
                style="width: 100%"
                clearable
                placeholder="请输入权限标识"
              />
            </t-form-item>
          </t-col>
          <t-col :span="12">
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
          </t-col>
          <t-col :span="12">
            <t-form-item style="float: right">
              <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
              <t-button theme="primary" type="submit">确定</t-button>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

import { getDictOptions } from '@/api/system/dict';
import { addMenu, editMenu, getMenuList } from '@/api/system/menu';
import { t } from '@/locales';
import { components } from '@/types/schema';
import { buildTree } from '@/utils/tree';

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
const menuTree = ref<components['schemas']['SysMenuVo'][]>();
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

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    if (props.mode === 'create') {
      await addMenu(formData.value);
    } else if (props.mode === 'edit') {
      await editMenu(formData.value);
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
  const root: components['schemas']['SysMenuVo'] = { menuId: 0, menuName: '主菜单', children: [] };
  const menus = await getMenuList();
  root.children = buildTree(menus, 'menuId', 'parentId', 'children');
  menuTree.value = [root];
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
