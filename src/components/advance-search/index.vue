<template>
  <t-form ref="form" :data="formData" :label-width="80" colon>
    <t-row :gutter="[16, 16]">
      <t-col :span="10">
        <t-row :gutter="[16, 16]">
          <t-col v-for="field in fields" :key="field.name" :xs="12" :sm="6" :md="3">
            <t-form-item :label="field.label" :name="field.name">
              <component
                :is="getFieldComponent(field)"
                v-bind="field.props"
                v-model="formData[field.name]"
                v-on="field.events && Object.keys(field.events).length ? field.events : {}"
              />
            </t-form-item>
          </t-col>
        </t-row>
      </t-col>
      <t-col :span="2" :md="2" :xs="6">
        <t-button @click="handleSubmit">搜索</t-button>
      </t-col>
    </t-row>
  </t-form>
</template>

<script setup lang="ts">
import { Input, Select } from 'tdesign-vue-next';
import { defineEmits, defineProps, PropType, ref } from 'vue';

// 定义 props 接口
interface Field {
  label: string;
  name: string;
  type: 'input' | 'select' | string; // 支持自定义组件
  props?: Record<string, any>; // 组件属性
  events?: Record<string, Function>; // 组件事件
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    required: true,
  },
});

// 定义 emit
const emit = defineEmits(['submit']);

// 表单数据
const formData = ref<Record<string, any>>({});

// 初始化 formData
props.fields.forEach((field) => {
  if (!(field.name in formData.value)) {
    formData.value[field.name] = '';
  }
});

// 动态选择字段类型组件
const getFieldComponent = (field: Field) => {
  switch (field.type) {
    case 'input':
      return Input;
    case 'select':
      return Select;
    default:
      return field.type; // 支持传递自定义组件名
  }
};

// 提交表单
const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
