<template>
  <div class="aside-list" :class="{ active: active }">
    <span class="truncate">
      <slot></slot>
    </span>
    <el-icon  class="ml-auto px-1" :size="20" v-if="isChoose"><CaretRight /></el-icon>
    <el-button
      class="ml-auto px-1"
      text
      type="primary"
      size="small"
      v-if="!isChoose"
      @click.stop="$emit('edit')"
    >
      <el-icon :size="12">
        <Edit />
      </el-icon>
    </el-button>
    <el-popconfirm
      title="是否删除该分类?"
      confirm-button-text="确认"
      cancel-button-text="取消"
      width="158px"
      @confirm="$emit('delete')"
    >
      <template #reference>
        <el-button
          text
          class="px-1"
          type="primary"
          v-if="!isChoose"
          @click.native.stop
          size="small"
        >
          <el-icon :size="12">
            <Delete />
          </el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  isChoose: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit", "delete"]);
</script>

<style scoped lang="scss">
.isChoose {
  justify-content: flex-start !important;
}
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex justify-center p-3 text-sm text-gray-600;

  &:hover {
    @apply bg-blue-50;
  }
}

.active {
  @apply bg-blue-50;
}
</style>
