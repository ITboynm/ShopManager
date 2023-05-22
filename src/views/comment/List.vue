<template>
  <div id="">
    <!-- 搜索 -->
    <Search
      v-model="queryform"
      :rules="queryRules"
      @search="handleQuery"
      @reset="getData(pager)"
    >
      <SearchItem :prop="'title'">
        <el-input
          v-model="queryform.title"
          size="small"
          placeholder="商品标题"
        ></el-input>
      </SearchItem>
    </Search>
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${$windowHeight.value - 60 - 44 - 22 - 78}px` }"
    >
      <!-- 新增和刷新 -->
      <el-table
        :data="tableData"
        row-key="id"
        stripe
        style="width: 100%"
        v-loading="loading"
        :max-height="$windowHeight.value - (60 + 44 + 22 + 78 + 48 + 80)"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="flex pl-18 pr-4">
              <el-avatar
                :size="50"
                :src="row.user.avatar"
                fit="fill"
                class="mr-3"
              ></el-avatar>
              <div class="flex-1">
                <h6 class="flex items-center mb-2">
                  {{ row.user.nickname || row.user.username }}
                  <small class="text-gray-400 ml-2">{{
                    row.review_time
                  }}</small>
                  <el-button
                    size="small"
                    class="ml-auto"
                    @click="openTextarea(row)"
                    v-if="!row.textareaEdit && !row.extra"
                    >回复</el-button
                  >
                </h6>
                {{ row.review.data }}
                <div class="py-2">
                  <el-image
                    v-for="(item, index) in row.review.image"
                    :key="index"
                    :src="item"
                    fit="cover"
                    :lazy="true"
                    style="width: 100px; height: 100px"
                    class="rounded"
                  ></el-image>
                </div>

                <div v-if="row.textareaEdit">
                  <el-input
                    v-model="textarea"
                    placeholder="请输入评价内容"
                    type="textarea"
                    :rows="2"
                  ></el-input>
                  <div class="py-2">
                    <el-button type="primary" size="small" @click="review(row)"
                      >回复</el-button
                    >
                    <el-button
                      size="small"
                      class="ml-2"
                      @click="closeReview(row)"
                      >取消</el-button
                    >
                  </div>
                </div>

                <template v-else>
                  <div
                    class="mt-3 bg-gray-100 p-3 rounded"
                    v-for="(item, index) in row.extra"
                    :key="index"
                  >
                    <h6 class="flex font-bold">
                      客服
                      <el-button
                        type="info"
                        size="small"
                        class="ml-auto"
                        @click="openTextarea(row, item.data)"
                        >修改</el-button
                      >
                    </h6>
                    <p>{{ item.data }}</p>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="ID" width="70" align="center" prop="id" />
        <el-table-column label="商品" width="250">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image
                :src="row.goods_item ? row.goods_item.cover : ''"
                :lazy="true"
                fit="cover"
                style="height: 50px; width: 50px"
                class="rounded"
              ></el-image>
              <div class="ml-3">
                <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价信息" width="220">
          <template #default="{ row }">
            <p>用户{{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value} 分"
              />
            </p>
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
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              :disabled="row.super == 1"
              @change="handleStatusChange($event, row)"
            >
            </el-switch>
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import moment from "moment";
import commentApi from "@/api/comment";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useTableInit } from "@/composables/useCommon";
import { fetchData, notification } from "@/utils/utils";
const textarea = ref("");
// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  handleStatusChange,
  changeCurrent,
  loading,
  queryform,
  queryformRef,
  columns,
  tableData,
  pager,
} = useTableInit({
  queryApi: commentApi.getGoodsComments,
  updateStateApi: commentApi.updateGoodsCommentStatus,
  queryform: {
    title: "",
  },
  xss: {
    xssValid: ["title"],
    validNames: ["标题"],
  },
  columns: [
    {
      label: "评价时间",
      prop: "review_time",
      with: 180,
      align: "center",
      formatter: (row) => {
        return moment(row.review_time).format("YYYY-MM-DD HH:mm:ss");
      },
    },
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
      item.textareaEdit = false;
      return item;
    });
  },
});

const openTextarea = (row, data = "") => {
  textarea.value = data;
  row.textareaEdit = true;
};

const review = async (row) => {
  if (!textarea.value) return notification("回复内容不能为空", "warning");
  const res = await fetchData(
    commentApi.reviewGoodsComment,
    {
      fetchId: row.id,
      fetchContent: { data: textarea.value },
    },
    "回复"
  );
  res.error ? console.log(res.error) : getData(pager);
};

const closeReview = (row) => {
  textarea.value = "";
  row.textareaEdit = false;
};
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
