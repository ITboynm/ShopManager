<template>
  <div
    id="goods"
    :style="{ height: `${$windowHeight.value - 60 - 44 - 24}px` }"
  >
    <div class="goods-aside">
      <el-tabs
        tab-position="left"
        v-model="queryform.tab"
        class="h-[100%]"
        @tab-change="getData(pager, { tab: queryform.tab })"
      >
        <el-tab-pane
          v-for="(item, index) in tabbars"
          :key="index"
          :label="item.name"
          :name="item.key"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="goods-main">
      <!-- 搜索 -->
      <Search
        v-model="queryform"
        :rules="queryRules"
        @search="handleQuery"
        @reset="getData(pager)"
        @resetCreateForm="resetCreateForm"
      >
        <SearchItem :prop="'no'">
          <el-input
            v-model="queryform.no"
            size="small"
            placeholder="订单编号"
          ></el-input>
        </SearchItem>
        <template #moreSearch>
          <SearchItem label="收货人" prop="name">
            <el-input
              v-model="queryform.name"
              placeholder="收货人"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem label="手机号" prop="phone">
            <el-input
              v-model="queryform.phone"
              placeholder="手机号"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem label="开始时间" prop="starttime">
            <el-date-picker
              v-model="queryform.starttime"
              type="date"
              placeholder="开始日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
          <SearchItem label="结束时间" prop="endtime" class="mb-2">
            <el-date-picker
              v-model="queryform.endtime"
              type="date"
              placeholder="结束日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
        </template>
      </Search>
      <el-card
        shadow="never"
        class="border-0 relative"
        :style="{ height: `${$windowHeight.value - 60 - 44 - 22 - 78}px` }"
      >
        <!-- 新增和刷新 -->
        <ListHeader
          layout="refresh,download"
          @refresh="getData(pager)"
          @download="handleExportExcel"
        >
          <el-popconfirm
            v-if="queryform.tab != 'delete'"
            title="是否删除选中项?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            width="158px"
            @confirm="handleDelete(multiSelectionIds)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"
                >批量删除</el-button
              >
            </template>
          </el-popconfirm>
          <div v-else class="inline-block ml-[12px]">
            <el-popconfirm
              title="是否彻底删除选中项?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              width="178px"
              @confirm="handleShopStatus(multiSelectionIds, 'destroy')"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"
                  >彻底删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="是否恢复选中项?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              width="158px"
              @confirm="handleShopStatus(multiSelectionIds, 'res')"
            >
              <template #reference>
                <el-button type="warning" size="small" icon="RefreshLeft"
                  >恢复商品</el-button
                >
              </template>
            </el-popconfirm>
          </div>
        </ListHeader>

        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="loading"
          ref="multipleTableRef"
          @selection-change="handleSelectionChange"
          :max-height="$windowHeight.value - (60 + 44 + 22 + 78 + 48 + 80)"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品" width="340">
            <template #default="{ row }">
              <div>
                <div class="flex text-sm">
                  <div class="flex-1">
                    <p>订单号：</p>
                    <small>{{ row.no }}</small>
                  </div>
                  <div>
                    <p>下单时间：</p>
                    <small>{{ row.create_time }}</small>
                  </div>
                </div>
                <div
                  class="flex py-2 items-center"
                  v-for="(item, index) in row.order_items"
                  :key="index"
                >
                  <el-image
                    :src="
                      item.goods_item
                        ? item.goods_item.cover
                        : 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
                    "
                    fit="cover"
                    :lazy="true"
                    style="width: 30px; height: 30px"
                  ></el-image>
                  <p class="text-blue-500 ml-2">
                    {{
                      item.goods_item ? item.goods_item.title : "商品已被删除"
                    }}
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
          <el-table-column align="center" label="买家" width="220">
            <template #default="{ row }">
              <p>{{ row.user.nickname || row.user.username }}</p>
              <small>(用户ID：{{ row.user.id }})</small>
            </template>
          </el-table-column>
          <el-table-column label="交易状态" align="left">
            <template #default="{ row }">
              <div>
                付款状态：
                <el-tag
                  v-if="row.payment_method == 'wechat'"
                  type="success"
                  size="small"
                  >微信支付</el-tag
                >
                <el-tag v-else-if="row.payment_method == 'alipay'" size="small"
                  >支付宝支付</el-tag
                >
                <el-tag v-else type="info" size="small">未支付</el-tag>
              </div>
              <div>
                发货状态：
                <el-tag
                  :type="row.ship_data ? 'success' : 'info'"
                  size="small"
                  >{{ row.ship_data ? "已发货" : "未发货" }}</el-tag
                >
              </div>
              <div>
                收货状态：
                <el-tag
                  :type="row.ship_status == 'received' ? 'success' : 'info'"
                  size="small"
                  >{{
                    row.ship_status == "received" ? "已收货" : "未收货"
                  }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button
                class="px-1"
                type="primary"
                size="small"
                text
                @click="openInfoModal(row)"
                >订单详情</el-button
              >
              <el-button
                v-if="queryform.tab === 'noship'"
                class="px-1 !ml-0"
                type="primary"
                size="small"
                text
                @click="shipOrder(row)"
                >订单发货</el-button
              >
              <el-button
                v-if="queryform.tab === 'refunding'"
                class="px-1 !ml-0"
                type="primary"
                size="small"
                text
                @click="handleRefund(row.id, 1)"
                >同意退款</el-button
              >
              <el-button
                v-if="queryform.tab === 'refunding'"
                class="px-1 !ml-0"
                type="primary"
                size="small"
                text
                @click="handleRefund(row.id, 0)"
                >拒绝退款</el-button
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
      <ExportExcel :tabs="tabbars" ref="ExportExcelRef" />
      <InfoModal ref="InfoModalRef" :info="info" />
      <FormDrawer
        title="填写快递单号"
        ref="formDrawerRef"
        @submit="handleSubmit"
        @reset="resetShipForm"
      >
        <el-form
          :model="shipForm"
          ref="DrawerRef"
          label-width="100px"
          :inline="false"
        >
          <el-form-item label="快递公司" prop="express_company">
            <el-input
              v-model="shipForm.express_company"
              placeholder="请输入快递公司"
            />
          </el-form-item>
          <el-form-item label="快递单号" prop="express_no">
            <el-input
              v-model="shipForm.express_no"
              placeholder="请输入快递单号"
            />
          </el-form-item>
        </el-form>
      </FormDrawer>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, reactive, toRaw } from "vue";
import orderApi from "@/api/order";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { tabbars } from "@/views/order/parameter";
import { useTableInit } from "@/composables/useCommon";
import ExportExcel from "@/views/order/ExportExcel.vue";
// import InfoModal from "@/views/order/InfoModal.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import { fetchData, showModal, showPromptModal } from "@/utils/utils";
const InfoModal = defineAsyncComponent(() =>
  import("@/views/order/InfoModal.vue")
);

const formDrawerRef = ref(null);
// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  handleDelete,
  multipleTableRef,
  multiSelectionIds,
  handleSelectionChange,
  changeCurrent,
  handleShopStatus,
  loading,
  queryform,
  queryRules,
  queryformRef,
  columns,
  tableData,
  pager,
} = useTableInit({
  queryApi: orderApi.getOrders,
  deleteApi: orderApi.deleteOrders,
  queryform: {
    no: "",
    tab: "all",
    starttime: null,
    endtime: null,
    name: "",
    phone: "",
  },
  xss: {
    xssValid: ["no", "name", "phone"],
    validNames: ["订单编号", "收货人", "手机号"],
  },
  queryRules: {},
  columns: [
    {
      label: "实际付款",
      prop: "total_price",
      align: "center",
      with: 220,
    },
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.okLoading = false;
      item.unLoading = false;
      return item;
    });
  },
});

const resetCreateForm = () => {
  queryform.starttime =
    queryform.endtime =
    queryform.name =
    queryform.phone =
      null;
};

const ExportExcelRef = ref(null);
const handleExportExcel = () => ExportExcelRef.value.open();

const InfoModalRef = ref(null);
const info = ref(null);
const openInfoModal = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const k in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[k].value);
      }
      o.sku = s.join(",");
    }
    return o;
  });
  info.value = row;
  InfoModalRef.value.open();
};

// 退款处理
const handleRefund = (id, agree) => {
  (agree
    ? showModal("是否要同意该订单退款?")
    : showPromptModal("请输入拒绝的理由")
  ).then(async ({ value }) => {
    let data = { agree };
    if (!agree) {
      data.disagree_reason = value;
    }
    const res = await fetchData(
      orderApi.handleRefund,
      { fetchId: id, fetchContent: data },
      "操作"
    );
    res.error ? console.log(error) : getData(pager);
  });
};
// 发货处理
const DrawerRef = ref(null);
const shipForm = reactive({
  express_company: "",
  express_no: "",
});
const shipId = ref(0);
const shipOrder = (row) => {
  // express_company	String  快递公司
  // express_no  String  快递单号
  shipId.value = row.id;
  formDrawerRef.value.open();
};
const resetShipForm = () => {
  DrawerRef.value.resetFields();
};
const handleSubmit = async () => {
  formDrawerRef.value.showLoading();
  const res = await fetchData(
    orderApi.orderShip,
    {
      fetchId: shipId.value,
      fetchContent: toRaw(shipForm),
    },
    "发货"
  );
  res.error ? console.log(res.error) : getData(pager);
  formDrawerRef.value.close();
  formDrawerRef.value.hideLoading();
};
</script>

<style scoped lang="scss">
#goods {
  @apply flex h-[100%] w-[100%];

  .goods-aside {
    :deep(.el-tabs__header) {
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
    }

    :deep(.el-tabs__nav-wrap)::after {
      background-color: transparent;
    }
  }

  .goods-main {
    flex: 1;
  }
}

.opr {
  :deep(.el-button) {
    @apply px-1;
  }
}

.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
