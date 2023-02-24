<template>
  <FormDrawer
    ref="formDrawerRef"
    destroyOnClose
    title="推荐商品"
    confirmText="关联"
    @submit="handleOpenChooseGoods"
  >
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="goods_id" align="center" label="ID" width="60" />
      <el-table-column label="商品封面" align="center" width="180">
        <template #default="{ row }">
          <el-image
            :src="row.cover"
            fit="cover"
            :lazy="true"
            style="width: 64px; height: 64px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-popconfirm
            title="是否删除该商品?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            width="158px"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button
                text
                size="small"
                type="danger"
                icon="Delete"
                :loading="row.deleteLoading"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <ChooseGoods
      ref="chooseGoodsRef"
      @loading="formDrawerRef.showLoading"
      @unLoading="formDrawerRef.hideLoading"
    ></ChooseGoods>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseGoods from "@/components/ChooseGoods.vue";
import categoryApi from "@/api/category";
import { ref } from "vue";
import { fetchData } from "@/utils/utils";
const formDrawerRef = ref(null);
const chooseGoodsRef = ref(null);
const tableData = ref([]);
const category_id = ref(0);

// 获取初始化值
const getData = async () => {
  const res = await fetchData(
    categoryApi.getCategorysItemList,
    { category_id: category_id.value },
    "分类商品获取",
    "unnotification"
  );
  !res.error &&
    (tableData.value = res.map((item) => {
      item.deleteLoading = false;
      return item;
    }));
  return res;
};
const open = async (data) => {
  data.categoryLoading = true;
  category_id.value = data.id;
  const res = await getData();
  res.error ? console.log(res.error) : formDrawerRef.value.open();
  data.categoryLoading = false;
};
// 删除
const handleDelete = async (row) => {
  row.deleteLoading = true;
  const res = await fetchData(
    categoryApi.deleteCategorysItemList,
    row.id,
    "分类商品删除"
  );
  res.error ? console.log(res.error) : getData();
};

// 触发关联
const handleOpenChooseGoods = () => {
  chooseGoodsRef.value.open(async (goods_ids) => {
    const res = await fetchData(
      categoryApi.setCategorysItemList,
      {
        category_id: category_id.value,
        goods_ids,
      },
      "关联商品"
    );
    res.error ? console.log(res.error) : getData();
  });
};
defineExpose({
  open,
});
</script>

<style scoped lang="scss"></style>
