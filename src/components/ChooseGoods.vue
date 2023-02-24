<template>
  <el-dialog
    title="商品选择"
    v-model="dialogVisible"
    width="80%"
    top="3vh"
    destroy-on-close
    @close="handleClose"
  >
    <Search
      v-model="queryform"
      style="border: 0"
      @search="handleQuery"
      @reset="
        () => {
          getData(pager);
          queryform.title = '';
        }
      "
    >
      <SearchItem :prop="'keyword'">
        <el-input
          v-model="queryform.title"
          size="small"
          placeholder="商品名称"
        ></el-input>
      </SearchItem>
    </Search>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
      :height="$windowHeight - (60 + 44 + 22 + 78 + 48 + 80)"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.cover"
              fit="cover"
              :lazy="true"
              class="w-[50px] h-[50px] mr-3 rounded"
            ></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <div>
                <span class="text-rose-500">￥{{ row.min_price }}</span>
                <el-divider direction="vertical" />
                <span class="text-gray-500 text-xs"
                  >￥{{ row.min_oprice }}</span
                >
              </div>
              <p class="text-gray-400 text-xs mb-1">
                分类：{{ (row.category && row.category.name) || "未分类" }}
              </p>
              <p class="text-gray-400 text-xs">
                创建时间：{{ row.create_time }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.with || 'auto'"
        :align="item.align || ''"
        :formatter="item.formatter"
      />
      <el-table-column label="价格（元）">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="changeCurrent"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.limit"
        :current-page="pager.page"
      />
    </div>
    <template #footer>
      <div>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import goodsApi from "@/api/goods";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useTableInit } from "@/composables/useCommon";
const emits = defineEmits(["loading", "unLoading"]);
const dialogVisible = ref(false);
// 商品分类
const category_list = ref([]);
// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  loading,
  multipleTableRef,
  resetMultipleTable,
  multiSelectionIds,
  handleSelectionChange,
  changeCurrent,
  queryform,
  queryformRef,
  columns,
  tableData,
  pager,
} = useTableInit({
  queryApi: goodsApi.getGoodsStatus,
  queryform: {
    title: "",
  },
  columns: [
    {
      label: "总库存",
      prop: "stock",
      align: "center",
    },
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    category_list.value = res.cates;
    tableData.value = res.list.map((item) => {
      item.bannerStatus = false;
      item.contentStatus = false;
      item.skusStatus = false;
      return item;
    });
  },
});

const handleClose = () => {
  emits("unLoading");
  resetMultipleTable();
  dialogVisible.value = false;
};

const callbackFun = ref(null);
const open = (callback = null) => {
  emits("loading");
  callbackFun.value = callback;
  dialogVisible.value = true;
};
const submit = () => {
  if (typeof callbackFun.value == "function") {
    callbackFun.value(multiSelectionIds.value);
  }
  handleClose();
};
defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 mb-[-60px] py-2 z-40;
  height: 80px;
}
</style>
