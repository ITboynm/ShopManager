<template>
  <el-container class="bg-white rounded" :style="{ height: `${h}px` }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleOpenCreate"
        >新增图库分类</el-button
      >
      <el-button type="warning" size="small" @click="handleOpenUploadFile"
        >上传图片</el-button
      >
    </el-header>
    <el-container>
      <image-aside ref="imageAsideRef" />
      <image-main ref="imageMainRef" />
    </el-container>
  </el-container>
</template>

<script setup>
import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";
import { ref } from "vue";
const imageAsideRef = ref(null);
const imageMainRef = ref(null);
// 新增分类
const handleOpenCreate = () => imageAsideRef.value.handleCreate();
// 上传图片
const handleOpenUploadFile = () => imageMainRef.value.openUploadFile();
// 获取浏览器可视区范围
const windowHeight = window.innerHeight || document.body.clientHeight;
// 获取展示区高度
const h = windowHeight - 60 - 44 - 22;
</script>

<style scoped lang="scss">
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
