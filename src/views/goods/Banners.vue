<template>
  <el-drawer
    v-model="dialogVisible"
    v-if="dialogVisible"
    title="设置轮播图"
    size="50%"
    destroy-on-close
    :before-close="handleClose"
  >
    <el-form :model="bannerForm" ref="bannerFormRef" label-width="80px">
      <el-form-item label="轮播图">
        <ChooseImage
          :limit="9"
          :checkMore="true"
          ref="chosseImageRef"
          v-model:avatar="bannerForm.banners"
        ></ChooseImage>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onBannerSubmit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import ChooseImage from "@/components/ChooseImage.vue";
import { notification } from "@/utils/utils";
import goodsApi from "@/api/goods";
const chosseImageRef = ref(null);
const dialogVisible = ref(false);
const bannerFormRef = ref(null);
const loading = ref(false);
const bannerForm = reactive({
  banners: [],
});
const goodsId = ref(0);
const onBannerSubmit = async () => {
  loading.value = true;
  try {
    const res = await goodsApi.setGoodsBanners(
      goodsId.value,
      bannerForm.banners
    );
    if (res.length) {
      handleClose();
      notification("设置轮播图成功");
      emits("reloadData");
    } else {
      notification("设置轮播图失败", "error");
    }
    loading.value = false;
  } catch (error) {
    concole.table(error);
    loading.value = false;
    notification("设置轮播图失败", "error");
  }
};

const open = async (row) => {
  row.bannerStatus = true
  try {
    goodsId.value = row.id;
    const res = await goodsApi.readGoods(goodsId.value);
    bannerForm.banners = res.goodsBanner.map((item) => item.url);
    row.bannerStatus = false
    dialogVisible.value = true;
  } catch (error) {
    concole.table(error);
    notification("获取轮播图数据失败", "error");
    row.bannerStatus = false
  }
};
const handleClose = () => {
  bannerForm.banners = [];
  dialogVisible.value = false;
};
const emits = defineEmits(["reloadData"]);
defineExpose({
  open,
});
</script>

<style scoped lang="scss"></style>
