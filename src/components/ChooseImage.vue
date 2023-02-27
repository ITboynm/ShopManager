<template>
  <div>
    <div class="flex flex-wrap w-[100%]" v-if="!preview">
      <div
        class="choose-image-btn"
        @click="open"
        v-if="!(avatar instanceof Array)"
      >
        <el-icon v-if="!avatar" :size="25" color="rgba(107, 114, 128, 0.5)">
          <Plus />
        </el-icon>
        <el-image
          v-else
          :src="avatar"
          alt=""
          :fit="cover"
          class="h-[100%] w-[100%]"
        />
      </div>
      <div v-else class="flex flex-wrap">
        <div class="choose-image-btn mr-1 order-2" @click="open">
          <el-icon
            v-if="!avatar || avatar instanceof Array"
            :size="25"
            color="rgba(107, 114, 128, 0.5)"
          >
            <Plus />
          </el-icon>
        </div>
        <div v-for="(imgUrl, index) in avatar" :key="index" class="imageDelBox">
          <div class="imageDel" @click="delImages(index)">
            <el-icon color="#f56c6c" size="35">
              <Delete />
            </el-icon>
          </div>
          <el-image
            :src="imgUrl"
            alt=""
            :lazy="true"
            :fit="cover"
            class="choose-image-btn mr-1 mb-1"
          />
        </div>
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
            :limit="limitMoreSize"
            :limitMax="limit"
            :checkMore="checkMore"
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
import { ref, watch, nextTick, computed } from "vue";
import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";
const imageMainRef = ref(null);
const imageAsideRef = ref(null);
const dialogVisible = ref(false);
let isChecked = false;
const props = defineProps({
  avatar: [String, Array],
  limit: {
    type: Number,
    default: null,
  },
  limitSize: {
    type: Number,
    default: 1,
  },
  checkMore: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});
let imageURL = ref(null);
let imageArray = ref([]);
const callbackFun = ref(null);
const limitMoreSize = computed(() => {
  if (props.avatar instanceof Array) return props.limit - props.avatar.length;
  return props.limitSize;
});
watch(
  () => props.avatar,
  (newVal, oldVal) => {
    if (!newVal)
      return (imageURL.value =
        "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png");
    imageURL.value = typeof newVal == "string" ? newVal : [...newVal];
  }
);

const handleChoose = (Url) => {
  if (isChecked) return;
  if ((Url && typeof props.avatar == "string") || !props.avatar) {
    imageURL.value = Url;
  } else if (Url && props.avatar instanceof Array) {
    imageArray.value = Url;
  }
};

const emits = defineEmits(["update:avatar"]);

const open = (callback = null) => {
  callbackFun.value = callback;
  isChecked = false;
  dialogVisible.value = true;
  imageAsideRef.value?.initActiveID();
};

const close = () => {
  isChecked = true;
  dialogVisible.value = false;
  imageMainRef.value.resetChecked();
  imageURL.value = null;
};

const submit = () => {
  if (imageArray.value.length) {
    imageURL.value.push(...imageArray.value);
    imageArray.value = [];
  }
  if (props.preview && typeof callbackFun.value == "function") {
    callbackFun.value(imageURL.value);
  } else {
    emits("update:avatar", imageURL.value);
  }
  close();
};

const delImages = (index) => {
  imageURL.value.splice(index, 1);
  emits("update:avatar", imageURL.value);
};

defineExpose({
  open,
});
</script>

<style lang="scss">
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded flex justify-center items-center cursor-pointer hover: (bg-gray-100) overflow-hidden;
  border: 0.5px solid rgba(107, 114, 128, 0.3);

  img {
    height: 100%;
    width: 100%;
  }
}

.imageDelBox {
  position: relative !important;

  .imageDel {
    position: absolute !important;
    opacity: 0;
    top: 0;
    bottom: 0.25rem;
    left: 0;
    right: 0.25rem;
    z-index: 99;
    transition: all 0.4s;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: rgb(0, 0, 0);
  }

  &:hover .imageDel {
    opacity: 0.6;
  }
}

.chooseImagedDialogClass {
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
