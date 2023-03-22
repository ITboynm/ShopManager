<template>
  <div id="" :style="{ height: `${$windowHeight.value - 60 - 44 - 24}px` }">
    <panel />
    <!-- 搜索 -->
    <Search
      v-model="queryform"
      @search="handleQuery"
      @reset="getData(pager)"
      @resetCreateForm="resetCreateForm"
    >
      <SearchItem label="时间选择" prop="type" :span="7">
        <el-radio-group v-model="queryform.type">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </SearchItem>
      <template #moreSearch>
        <SearchItem label="开始时间" prop="starttime">
          <el-date-picker
            v-model="queryform.starttime"
            type="date"
            placeholder="开始日期"
            style="width: 90%"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
        <SearchItem label="结束时间" prop="endtime">
          <el-date-picker
            v-model="queryform.endtime"
            type="date"
            placeholder="结束日期"
            style="width: 90%"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
        <SearchItem label="关键词" prop="keyword" class="mb-2">
          <el-input
            v-model="queryform.keyword"
            placeholder="关键词"
            clearable
          ></el-input>
        </SearchItem>
      </template>
    </Search>

    <el-card shadow="never" class="border-0 relative pb-[50px]">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        :style="{
          height: `${$windowHeight.value - 60 - 44 - 22 - 260 - 30}px`,
        }"
      >
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="头像" width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="200">
          <template #default="{ row }">
            <div class="text-xs">
              <p>用户：{{ row.username }}</p>
              <p>昵称：{{ row.nickname }}</p>
              <p>姓名：{{ row.user_info.name }}</p>
              <p>电话：{{ row.phone }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="推广用户数量"
          prop="share_num"
          align="center"
          width="200"
        />
        <el-table-column
          label="订单数量"
          prop="share_order_num"
          align="center"
        />
        <el-table-column label="订单金额" prop="order_price" align="center" />
        <el-table-column label="账户佣金" prop="commission" align="center" />
        <el-table-column
          label="已提现金额"
          prop="cash_out_price"
          width="160"
          align="center"
        />
        <el-table-column label="提现次数" prop="cash_out_time" align="center" />
        <el-table-column
          label="未提现金额"
          width="200"
          prop="no_cash_out_price"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              text
              @click="openDataDrawer(row.id, 'user')"
              >推广人</el-button
            >
            <el-button
              type="primary"
              size="small"
              text
              @click="openDataDrawer(row.id, 'order')"
              >推广订单</el-button
            >
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
    <dataDrawer ref="dataDrawerRef" />
    <dataDrawer ref="orderDataDrawerRef" type="order" />
  </div>
</template>

<script setup>
import panel from "@/views/distribution/panel.vue";
// import dataDrawer from "@/views/distribution/dataDrawer.vue";
import { ref, defineAsyncComponent } from "vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import distributionApi from "@/api/distribution";
import { useTableInit } from "@/composables/useCommon";
const dataDrawer = defineAsyncComponent(() =>
  import("@/views/distribution/dataDrawer.vue")
);

// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  changeCurrent,
  loading,
  queryform,
  tableData,
  pager,
} = useTableInit({
  queryApi: distributionApi.getAgents,
  queryform: {
    keyword: "",
    type: "all",
    starttime: null,
    endtime: null,
  },

  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    tableData.value = res.list;
  },
});
const resetCreateForm = () => {
  queryform.keyword = queryform.starttime = queryform.endtime = null;
};
const dataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
const openDataDrawer = (id, type) => {
  (type == "user" ? dataDrawerRef : orderDataDrawerRef).value.open(id);
};
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
