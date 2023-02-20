<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    style="width: 5rem"
    class="ml-1"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 添加值
  </el-button>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
const props = defineProps({
  tagval: String,
});
const emits = defineEmits(["update:tagval"]);
const inputValue = ref("");
const dynamicTags = ref([]);
const inputVisible = ref(false);
const InputRef = ref();

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  emits("update:tagval", dynamicTags.value.join(","));
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    emits("update:tagval", dynamicTags.value.join(","));
  }
  inputVisible.value = false;
  inputValue.value = "";
};

watch(
  () => props.tagval,
  (newVal, oldVal) => {
    dynamicTags.value = newVal ? newVal.split(",") : [];
  },
  { deep: true }
);
</script>
