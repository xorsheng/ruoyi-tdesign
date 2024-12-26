<template>
  <t-form ref="form" :data="formData" :label-width="labelWidth" colon>
    <t-row :gutter="[16, 16]">
      <t-col :span="formSpan">
        <t-row v-bind="rowProps">
          <t-col v-for="field in fields" :key="field.name" v-bind="colProps">
            <t-form-item :label="field.label" :name="field.name">
              <component
                :is="getFieldComponent(field)"
                v-bind="field.props"
                v-model="formData[field.name]"
                :style="{ width: '100%' }"
                v-on="getFieldEvents(field)"
              />
            </t-form-item>
          </t-col>
        </t-row>
      </t-col>
      <t-col :span="buttonSpan" :md="2" :xs="6">
        <t-space break-line>
          <t-button @click="handleSubmit">搜索</t-button>
          <t-button variant="outline" @click="handleReset">重置</t-button>
        </t-space>
      </t-col>
    </t-row>
  </t-form>
</template>

<script setup lang="ts">
import { ColProps, DateRangePicker, Input, Select } from 'tdesign-vue-next';
import { defineEmits, defineProps, PropType, ref, watch } from 'vue';

// 定义 props 接口
export interface Field {
  label: string;
  name: string;
  type: 'input' | 'select' | 'date-range-picker' | string;
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
  rowProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      gutter: [16, 16],
    }),
  },
  colProps: {
    type: Object as PropType<Partial<ColProps>>,
    default: () => ({
      xs: 12,
      sm: 6,
      md: 3,
    }),
  },
});

const emit = defineEmits(['submit', 'reset']);

const formData = ref<Record<string, any>>({});

// Watch fields to initialize formData properly
watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (!(field.name in formData.value)) {
        if (field.type === 'date-range-picker') {
          formData.value[field.name] = [];
        } else {
          formData.value[field.name] = undefined;
        }
      }
    });
  },
  { immediate: true },
);

// Helper function to get the appropriate component based on field type
const getFieldComponent = (field: Field) => {
  switch (field.type) {
    case 'input':
      return Input;
    case 'select':
      return Select;
    case 'date-range-picker':
      return DateRangePicker;
    default:
      return Input;
  }
};

// Helper function to get events from field
const getFieldEvents = (field: Field) => {
  return field.events && Object.keys(field.events).length ? field.events : {};
};

// 提交表单
const handleSubmit = () => {
  const transformedData = transformData(formData.value);
  emit('submit', transformedData);
};

// 重置表单
const handleReset = () => {
  const resetData = (obj: Record<string, any>) => {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key])) {
        obj[key] = [];
      } else {
        obj[key] = undefined;
      }
    });
  };
  resetData(formData.value);
  emit('reset', formData.value);
};

// 转换表单数据：将嵌套的字段转换为层级结构
const transformData = (data: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const keys = key.split('.');
    let current = result;

    keys.forEach((subKey, index) => {
      if (index === keys.length - 1) {
        current[subKey] = data[key]; // 最后一级直接赋值
      } else {
        current[subKey] = current[subKey] || {}; // 创建嵌套对象
        current = current[subKey];
      }
    });
  });

  return result;
};
</script>
