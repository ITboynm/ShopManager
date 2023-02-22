<template>
  <div>
    <div class="flex flex-wrap w-[100%]">
      <div
        class="choose-image-btn"
        @click="open"
        v-if="!(avatar instanceof Array)"
      >
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
      <div v-else class="flex flex-wrap">
        <div class="choose-image-btn order-2" @click="open">
          <el-icon
            v-if="!avatar || avatar instanceof Array"
            :size="25"
            color="rgba(107, 114, 128, 0.5)"
            ><Plus
          /></el-icon>
        </div>
        <el-image
          v-for="(imgUrl, index) in avatar"
          :key="index"
          :src="imgUrl"
          alt=""
          :fit="cover"
          class="choose-image-btn mr-1 mb-1"
        />
      </div>
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
          <image-aside ref="imageAsideRef" :isChoose="true" />
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
const props = defineProps({
  avatar: [String, Array],
});
let imageURL = null;
const handleChoose = (Url) => {
  if (!Url) {
    imageURL.pop();
  } else if (typeof props.avatar == "String" || !props.avatar) {
    imageURL = Url;
  } else if (props.avatar instanceof Array) {
    imageURL = [...props.avatar];
    imageURL.push(Url);
  }
};

const emits = defineEmits(["update:avatar"]);

const open = () => {
  dialogVisible.value = true;
  imageAsideRef.value.initActiveID();
};

const close = () => {
  dialogVisible.value = false;
  imageMainRef.value.resetChecked();
  imageURL = null;
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
