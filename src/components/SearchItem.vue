<template>
  <el-col :span="span" :offset="0">
    <el-form-item :label="label" :prop="prop" :size="size" class="w-[100%]">
      <slot></slot>
    </el-form-item>
  </el-col>
</template>

<script setup>
defineProps({
  span: {
    type: Number,
    default: 4,
  },
  offset: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
  prop: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "small",
  },
});
</script>

<style scoped lang="scss"></style>
