<template>
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    :destroyOnClose="destroyOnClose"
  >
    <el-form label-width="80px" style="height: 100%">
      <div class="formDrawer">
        <div class="body">
          <slot></slot>
        </div>
        <div class="actions">
          <el-button type="primary" @click="$emit('submit')" :loading="loading">
            {{ props.confirmText }}
          </el-button>
          <el-button @click="close"> 取消 </el-button>
        </div>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
const showDrawer = ref(false);
const loading = ref(false);
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: "45%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
});
const emits = defineEmits(["reset", "submit"]);
// 打开
const open = () => (showDrawer.value = true);

// 关闭
const close = () => {
  showDrawer.value = false;
  emits("reset");
};

const showLoading = () => (loading.value = true);

const hideLoading = () => (loading.value = false);

// 向父组件暴露以下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>

<style scoped lang="scss">
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;

  .body {
    flex: 1;
    overflow-y: auto;
  }

  .actions {
    height: 50px;
    @apply mt-auto flex items-center;
  }
}
</style>
