<template>
  <el-main class="image-main">
    <div class="top">
      <div v-for="i in 100" :key="i">{{ i }}</div>
    </div>
    <div class="bottom">分页</div>
  </el-main>
</template>

<script setup></script>

<style scoped lang="scss">
.image-main {
  border-right: 1px solid #eee;
  position: relative;
  .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  .bottom {
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    bottom: 0;
    @apply flex items-center justify-center;
  }
}
</style>
