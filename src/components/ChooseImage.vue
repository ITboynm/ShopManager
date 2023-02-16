<template>
  <div>
    <div class="choose-image-btn" @click="open">
      <el-icon v-if="!avatar" :size="25" color="rgba(107, 114, 128, 0.5)"
        ><Plus
      /></el-icon>
      <el-image
        v-else
        :src="avatar"
        alt=""
        :fit="cover"
        class="h-[100%] w-[100%]"
      />
    </div>
    <el-dialog
      title="选择图片"
      v-model="dialogVisible"
      class="chooseImagedDialogClass"
      width="80%"
      top="5vh"
    >
      <el-container class="bg-white rounded container" style="height: 70vh">
        <el-container>
          <image-aside ref="imageAsideRef"  :isChoose="true" />
          <image-main
            ref="imageMainRef"
            :isChoose="true"
            @choose="handleChoose"
          />
        </el-container>
      </el-container>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";
const imageMainRef = ref(null);
const imageAsideRef = ref(null);
const dialogVisible = ref(false);
let imageURL = "";
const handleChoose = (imageUrl) => {
  if (imageUrl) imageURL = imageUrl;
};
const props = defineProps({
  avatar: [String, Array],
});
const emits = defineEmits(["update:avatar"]);

const open = () => {
  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
  imageMainRef.value.resetChecked();
};
const submit = () => {
  emits("update:avatar", imageURL);
  close();
};
</script>

<style lang="scss">
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded  flex justify-center items-center cursor-pointer hover:(bg-gray-100) overflow-hidden;
  border: 0.5px solid rgba(107, 114, 128, 0.3);
  img {
    height: 100%;
    width: 100%;
  }
}

.chooseImagedDialogClass {
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
