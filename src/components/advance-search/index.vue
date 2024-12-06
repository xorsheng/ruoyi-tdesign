<template>
  <t-form ref="form" :data="formData" :label-width="labelWidth" colon>
    <t-row :gutter="[16, 16]">
      <t-col :span="formSpan">
        <t-row :gutter="[16, 16]">
          <t-col v-for="field in fields" :key="field.name" :xs="12" :sm="6" :md="3">
            <t-form-item :label="field.label" :name="field.name">
              <component
                :is="getFieldComponent(field)"
                v-bind="field.props"
                v-model="formData[field.name]"
                v-on="getFieldEvents(field)"
              />
            </t-form-item>
          </t-col>
        </t-row>
      </t-col>
      <t-col :span="buttonSpan" :md="2" :xs="6">
        <t-button @click="handleSubmit">搜索</t-button>
      </t-col>
    </t-row>
  </t-form>
</template>

<script setup lang="ts">
import { Input, Select } from 'tdesign-vue-next';
import { defineEmits, defineProps, PropType, ref, watch } from 'vue';

// 定义 props 接口
interface Field {
  label: string;
  name: string;
  type: 'input' | 'select' | string;
  props?: Record<string, any>;
  events?: Record<string, Function>;
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    required: true,
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
  formSpan: {
    type: Number,
    default: 10,
  },
  buttonSpan: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(['submit']);

const formData = ref<Record<string, any>>({});

// Watch fields to initialize formData properly
watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (!(field.name in formData.value)) {
        formData.value[field.name] = undefined;
      }
    });
  },
  { immediate: true },
);

const getFieldComponent = (field: Field) => {
  switch (field.type) {
    case 'input':
      return Input;
    case 'select':
      return Select;
    default:
      return Input;
  }
};

const getFieldEvents = (field: Field) => {
  return field.events && Object.keys(field.events).length ? field.events : {};
};

// 提交表单
const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
