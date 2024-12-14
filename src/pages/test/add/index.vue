<template>
  <div>添加测试页面</div>
  <div>{{ props.testId }}</div>
</template>

<script setup lang="ts">
const props = defineProps({
  testId: { type: Number, default: 0 },
});
</script>
