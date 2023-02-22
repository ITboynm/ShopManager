<template>
  <div id="goods" :style="{ height: `${$windowHeight - 60 - 44 - 24}px` }">
    <div class="goods-aside">
      <el-tabs tab-position="left" v-model="queryform.tab" class="h-[100%]"
        @tab-change="getData(pager, { tab: queryform.tab })">
        <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="goods-main">
      <!-- 搜索 -->
      <Search v-model="queryform" :rules="queryRules" @search="handleQuery" @reset="getData(pager)"
        @resetCreateForm="queryform.category_id = null">
        <SearchItem :prop="'title'">
          <el-input v-model="queryform.title" size="small" placeholder="商品名称"></el-input>
        </SearchItem>
        <template #moreSearch>
          <SearchItem :prop="'category_id'">
            <el-select v-model="queryform.category_id" placeholder="商品分类" size="small" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>
      <el-card shadow="never" class="border-0 relative" :style="{ height: `${$windowHeight - 60 - 44 - 22 - 78}px` }">
        <!-- 新增和刷新 -->
        <ListHeader layout="create,delete,refresh" @create="handleCreate" @refresh="getData(pager)"
          @delete="handleDelete(multiSelectionIds)">
          <el-button v-for="item in upAndDown" size="small" :icon="item ? 'Top' : 'Bottom'" type="info" plain
            @click="handleStatusChange(item, multiSelectionIds)">
            {{ item ? "上架" : "下架" }}
          </el-button>
        </ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" ref="multipleTableRef"
          @selection-change="handleSelectionChange" :max-height="$windowHeight - (60 + 44 + 22 + 78 + 48 + 80)">
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品" width="300">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-image :src="row.cover" fit="cover" :lazy="true" class="w-[50px] h-[50px] mr-3 rounded"></el-image>
                <div class="flex-1">
                  <p>{{ row.title }}</p>
                  <div>
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical" />
                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
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
          <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"
            :width="item.with || 'auto'" :align="item.align || ''" :formatter="item.formatter" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? "上架中" : "仓库" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="120" align="center" v-if="queryform.tab !== 'delete'">
            <template #default="{ row }">
              <div v-if="row.ischeck == 0">
                <el-button type="success" size="small" plain>
                  审核通过
                </el-button>
                <el-button type="danger" size="small" plain class="mt-2" style="margin-left: 0">
                  审核拒绝
                </el-button>
              </div>
              <span v-else>
                <el-tag :type="row.ischeck == 1 ? 'success' : 'danger'" effect="dark">
                  {{ row.ischeck == 1 ? "通过" : "拒绝" }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <div class="opr" v-if="queryform.tab !== 'delete'">
                <el-button size="small" type="primary" text icon="EditPen" @click="handleEdit(row)">修改</el-button>
                <el-button size="small" type="primary" text icon="List" :loading="row.skusStatus"
                  @click="setGoodsSkus(row)">商品规格</el-button>
                <el-button size="small" :type="row.goods_banner.length ? 'primary' : 'danger'" text icon="Picture"
                  :loading="row.bannerStatus" @click="setGoodsBanners(row)">设置轮播图</el-button>
                <el-button size="small" :type="row.content ? 'primary' : 'danger'" text icon="Tickets"
                  :loading="row.contentStatus" @click="setGoodsContent(row)">商品详情</el-button>

                <el-popconfirm title="是否删除该商品?" confirm-button-text="确认" cancel-button-text="取消" width="158px"
                  @confirm="handleDelete(scope.row.id)">
                  <template #reference>
                    <el-button size="small" type="primary" icon="Delete" text>删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
              <span v-else>暂无操作</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change="changeCurrent" background layout="prev, pager, next" :total="pager.total"
            :page-size="pager.limit" :current-page="pager.page" />
        </div>
      </el-card>
      <Banners @reloadData="getData(pager)" ref="bannersForm"></Banners>
      <Content @reloadData="getData(pager)" ref="contentForm"></Content>
      <Skus @reloadData="getData(pager)" ref="skusForm"></Skus>
    </div>
    <FormDrawer :title="isEdit ? '编辑' : '新增'" ref="formDrawerRef" @submit="handleSubmit" @reset="reset">
      <el-form :model="createForm" ref="DrawerRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入商品名称,不能超过60个字符"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <ChooseImage v-model:avatar="createForm.cover"></ChooseImage>
        </el-form-item>
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="createForm.category_id" placeholder="请选择商品分类">
            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input v-model="createForm.desc" placeholder="选填，请输入商品描述" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-cascader v-model="createForm.unit" :options="unitList" :show-all-levels="false" :props="{
            emitPath: false,
          }" />
        </el-form-item>
        <el-form-item label="总库存" prop="stock">
          <el-input v-model="createForm.stock" type="number" style="width: 40%">
            <template #append>{{ createForm.unit }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警" prop="min_stock">
          <el-input v-model="createForm.min_stock" type="number" style="width: 40%">
            <template #append>{{ createForm.unit }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" prop="min_price">
          <el-input v-model="createForm.min_price" type="number" style="width: 40%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" prop="min_oprice">
          <el-input v-model="createForm.min_oprice" type="number" style="width: 40%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示" prop="stock_display">
          <el-radio-group v-model="createForm.stock_display">
            <el-radio :label="1" border>显示</el-radio>
            <el-radio :label="0" border>隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="createForm.status">
            <el-radio :label="1" border>上架</el-radio>
            <el-radio :label="0" border>仓库</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import goodsApi from "@/api/goods";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { tabbars, unitList } from "@/views/goods/parameter";
import { useTableInit, useInitForm } from "@/composables/useCommon";
import Banners from "@/views/goods/Banners.vue";
import Content from "@/views/goods/Content.vue";
import Skus from "@/views/goods/Skus.vue";
const selectData = ref([]);
const bannersForm = ref(null);
const contentForm = ref(null);
const skusForm = ref(null);
const upAndDown = computed(() => {
  let data = [];
  switch (queryform.tab) {
    case "all":
      data = [0, 1];
      break;
    case "saling":
      data = [0];
      break;
  }
  return data;
});
// 商品分类
const category_list = ref([]);
// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  handleDelete,
  multipleTableRef,
  multiSelectionIds,
  handleSelectionChange,
  handleStatusChange,
  changeCurrent,
  loading,
  queryform,
  queryRules,
  queryformRef,
  columns,
  tableData,
  pager,
} = useTableInit({
  queryApi: goodsApi.getGoodsStatus,
  deleteApi: goodsApi.deleteGoods,
  updateStateApi: goodsApi.changeGoodsStatus,
  queryform: {
    title: "",
    tab: "all",
    category_id: null,
  },
  queryRules: {},
  columns: [
    {
      label: "实际销量",
      prop: "sale_count",
      align: "center",
      with: 100,
    },
    {
      label: "总库存",
      prop: "stock",
      align: "center",
      with: 90,
    },
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    category_list.value = res.cates;
    tableData.value = res.list.map((item) => {
      item.bannerStatus = false;
      item.contentStatus = false;
      item.skusStatus = false
      return item;
    });
  },
});

const {
  formDrawerRef,
  DrawerRef,
  isEdit,
  rules,
  createForm,
  handleCreate,
  handleEdit,
  handleSubmit,
} = useInitForm({
  text: "管理员",
  createForm: {
    editId: null,
    title: "", //商品名称
    category_id: null, //商品分类
    cover: "", //商品封面
    desc: "", //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 1, //最低销售价
    min_oprice: 1, //最低原价
  },
  rules: {},
  createApi: goodsApi.setGoods,
  editApi: goodsApi.updateGoods,
  getData,
  pager,
});

const setGoodsBanners = (row) => bannersForm.value.open(row);
const setGoodsContent = (row) => contentForm.value.open(row);
const setGoodsSkus = (row) => skusForm.value.open(row);
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
