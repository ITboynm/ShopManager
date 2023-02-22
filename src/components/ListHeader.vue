<template>
  <div class="flex items-center justify-between">
    <div>
      <el-button
        type="primary"
        size="small"
        @click="$emit('create')"
        icon="Plus"
        v-if="btns.includes('create')"
        >新增</el-button
      >
      <el-popconfirm
        title="是否删除选中项?"
        confirm-button-text="确认"
        cancel-button-text="取消"
        width="158px"
        v-if="btns.includes('delete')"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button type="danger" size="small" icon="Delete"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
      <slot></slot>
    </div>
    <el-tooltip
      effect="dark"
      v-if="btns.includes('refresh')"
      content="刷新数据"
      placement="top"
    >
      <el-button text @click="$emit('refresh')">
        <el-icon :size="20"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";

const props = defineProps({
  layout: {
    type: String,
    default: "",
  },
});
const btns = computed(() => props.layout.split(","));
defineEmits(["create", "refresh", "delete"]);
</script>

<style scoped lang="scss"></style>
