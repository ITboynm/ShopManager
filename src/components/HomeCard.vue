<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">{{ title }}</span>
        <el-tag type="danger" effect="plain">
          {{ tip }}
        </el-tag>
      </div>
    </template>
    <!-- card body -->
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item, index) in btns" :key="index">
        <el-card shadow="never" class="gray-box">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl">{{ item.value }}</span>
            <span class="text-xs mt-2 text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
const props = defineProps({
  title: String,
  tip: String,
  btns: Array,
});
</script>

<style scoped lang="scss">
.gray-box {
  border: 0 !important;
  --tw-bg-opacity: 1;
  background-color: rgba(246, 246, 246, var(--tw-bg-opacity)) !important;
}
</style>
