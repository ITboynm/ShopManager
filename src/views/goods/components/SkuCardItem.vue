<template>
  <div v-loading="itemLoading">
    <el-tag
      effect="plain"
      v-for="(tag, index) in item.goodsSkusCardValue"
      :key="index"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      <el-input
        v-model="tag.text"
        placeholder="选项值"
        class="!w-20 ml-[-10px] tagClass"
        size="small"
        @change="handleChange($event, tag)"
      >
        {{ tag.text }}
      </el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 !w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="small"
      @click="showInput"
    >
      + 添加选项值
    </el-button>
  </div>
</template>

<script setup>
import { initSkusCardItem } from "@/composables/useSku";
import { ElInput } from "element-plus";
const props = defineProps({
  skuCardId: [Number, String],
});

const {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  itemLoading,
  handleChange,
} = initSkusCardItem(props.skuCardId);
</script>

<style scoped lang="scss">
.tagClass {
  :deep(.el-input__wrapper) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
