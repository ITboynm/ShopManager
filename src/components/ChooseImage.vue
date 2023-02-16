<template>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" color="rgba(107, 114, 128, 0.5)"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <span>1111</span>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
const submit = () => {};
</script>

<style scoped lang="scss">
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded  flex justify-center items-center cursor-pointer hover:(bg-gray-100);
  border: 0.5px solid rgba(107, 114, 128, 0.3);
}
</style>
