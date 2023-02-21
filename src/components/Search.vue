<template>
  <el-form
    :model="modelValue"
    ref="queryformRef"
    :rules="rules"
    label-width="80px"
    class="queryform"
    inline
    size="normal"
  >
    <el-row :gutter="20">
      <slot></slot>
      <template v-if="showSearch">
        <slot name="moreSearch"></slot>
      </template>
      <SearchItem :span="8">
        <el-button
          type="primary"
          v-if="moreSearch"
          @click="handleShowSearch"
          :icon="showSearch ? 'DArrowLeft' : 'DArrowRight'"
          size="small"
        >
          {{ !showSearch ? "高级检索" : "收起" }}
        </el-button>
        <el-button
          type="primary"
          @click="$emit('search', handleOk)"
          icon="Search"
          size="small"
          >搜索</el-button
        >
        <el-button icon="RefreshLeft" size="small" @click="reset"
          >重置</el-button
        >
      </SearchItem>
    </el-row>
  </el-form>
</template>

<script setup>
import { onMounted, ref, useSlots } from "vue";
import SearchItem from "@/components/SearchItem.vue";
const queryformRef = ref(null);
const moreSearch = ref(false);
const slots = useSlots();
const emits = defineEmits(["search", "reset", "resetCreateForm"]);
defineProps({
  modelValue: Object,
  rules: {
    type: Object,
    default: {},
  },
});
const showSearch = ref(false);
const handleShowSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) emits("resetCreateForm");
};
const reset = () => {
  queryformRef.value.resetFields();
  emits("reset");
};
const handleOk = async () => {
  let isOk = false;
  await queryformRef.value.validate((valid, fields) => {
    if (!valid) return false;
    isOk = true;
  });
  return isOk;
};
onMounted(() => {
    // 判断是否有拓展插槽
  if (slots.moreSearch) moreSearch.value = true;
});
</script>

<style scoped lang="scss">
.queryform {
  margin-bottom: 10px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
