<template>
  <FormDrawer
    title="设置商品详情"
    ref="formDrawerRef"
    destroyOnClose
    @submit="handleSubmit"
  >
    <el-form :model="contentForm" ref="DrawerRef" :inline="false">
      <el-form-item prop="name">
        <Editor v-model="contentForm.content"></Editor>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import Editor from "@/components/Editor.vue";
import { notification } from "@/utils/utils";
import goodsApi from "@/api/goods";
const formDrawerRef = ref(null);
const contentForm = reactive({
  content: [],
});
const goodsId = ref(0);

const open = async (row) => {
  row.contentStatus = true;
  try {
    goodsId.value = row.id;
    const res = await goodsApi.readGoods(goodsId.value);
    contentForm.content = res.content;
    row.contentStatus = false;
    formDrawerRef.value.open();
  } catch (error) {
    console.table(error);
    notification("获取商品详情数据失败", "error");
    row.contentStatus = false;
  }
};
const handleSubmit = async () => {
  formDrawerRef.value.showLoading();
  try {
    const res = await goodsApi.updateGoods(goodsId.value, {
      content: contentForm.content,
    });
    if (res) {
      notification("商品详情修改成功");
      emits('reloadData')
      formDrawerRef.value.close();
    } else {
      notification("商品详情修改失败", "error");
    }
    formDrawerRef.value.hideLoading();
  } catch (error) {
    notification("商品详情修改失败", "error");
    formDrawerRef.value.close();
    formDrawerRef.value.hideLoading();
  }
};
const emits = defineEmits(["reloadData"]);
defineExpose({
  open,
});
</script>

<style scoped lang="scss"></style>
