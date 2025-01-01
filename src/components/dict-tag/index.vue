<template>
  <t-tag v-if="tagText" :theme="tagTheme" variant="light">
    {{ tagText }}
  </t-tag>
</template>

<script setup lang="ts">
import { TagProps } from 'tdesign-vue-next';
import { computed } from 'vue';

import { components } from '@/types/schema';

const props = defineProps<{
  status: string;
  options: components['schemas']['SysDictDataVo'][];
}>();

const tagTheme = computed(() => {
  const option = props.options.find((opt) => opt.dictValue === props.status);
  return (option && option.listClass ? option.listClass : 'primary') as TagProps['theme'];
});

const tagText = computed(() => {
  const option = props.options.find((opt) => opt.dictValue === props.status);
  return option ? option.dictLabel : '';
});
</script>
