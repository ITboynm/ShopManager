<template>
  <el-drawer :title="drawerTitle" v-model="dialogVisible" size="70%">
    <!-- 搜索 -->
    <el-form :model="queryform" size="small">
      <el-form-item label="时间选择">
        <el-radio-group v-model="queryform.type">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="queryform.starttime"
          type="date"
          placeholder="开始日期"
          style="width: 90%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="queryform.endtime"
          type="date"
          placeholder="结束日期"
          style="width: 90%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="queryform.level">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">一级推广</el-radio-button>
          <el-radio-button :label="2">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData(pager)">搜索</el-button>
        <el-button @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      :style="{ height: `${$windowHeight - 60 - 44 - 22 - 240}px` }"
    >
      <template v-if="type === 'user'">
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
        <el-table-column label="用户信息" prop="username" />
        <el-table-column label="推广数" prop="share_num" align="center" />
        <el-table-column
          label="推广订单数"
          prop="share_order_num"
          align="center"
        />
        <el-table-column label="绑定时间" prop="create_time" align="center" />
      </template>
      <template v-else>
        <el-table-column label="订单号">
          <template #default="{ row }">
            {{ row.order.no }}
          </template>
        </el-table-column>
        <el-table-column label="用户名|昵称|手机">
          <template #default="{ row }">
            <div v-if="!row.order.user">该用户已被删除</div>
            <div v-else>
              {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{
                row.order.user.phone
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" />
        <el-table-column label="返佣金额" prop="commission" />
      </template>
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
  </el-drawer>
</template>
<script setup>
import { ref, computed } from "vue";
import distributionApi from "@/api/distribution";
import { useTableInit } from "@/composables/useCommon";

const props = defineProps({
  type: {
    type: String,
    default: "user",
  },
});
const drawerTitle = computed(() =>
  props.type === "user" ? "推广人列表" : "推广订单列表"
);
const dialogVisible = ref(false);

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
  queryApi: (() => {
    return props.type === "user"
      ? distributionApi.getAgents
      : distributionApi.getUserBills;
  })(),
  queryform: {
    type: "all",
    starttime: null,
    endtime: null,
    level: 0,
    user_id: 0,
  },
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    tableData.value = res.list;
  },
});

const resetSearchForm = () => {
  queryform.type = "all";
  queryform.starttime = null;
  queryform.endtime = null;
  queryform.level = 0;
  getData(pager)
};

const open = (id) => {
  dialogVisible.value = true;
  queryform.user_id = id;
  getData();
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
