<template>
  <div id="">
    <el-upload drag :action='config.baseApi + imageApi.uploadImageUrl' :headers="{
      token: operateToken.getToken().token,
    }" multiple name="img" :data="data" :on-success="uploadSuccess" :on-error="uploadError">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
import imageApi from "@/api/image";
import config from "@/config"
import operateToken from "@/utils/auth";
import { notification } from "@/utils/utils";
const props = defineProps({
  data: Object,
});
const emits = defineEmits(["success"]);
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  notification("上传成功", "success");
  emits("success", {
    response,
    uploadFile,
    uploadFiles,
  });
};

const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败";
  notification(msg, "error");
};
</script>

<style scoped lang="scss"></style>
