<template>
  <div id="goods" :style="{ height: `${$windowHeight - 60 - 44 - 24}px` }">
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
        @resetCreateForm="queryform.category_id = null"
      >
        <SearchItem :prop="'title'">
          <el-input
            v-model="queryform.title"
            size="small"
            placeholder="商品名称"
          ></el-input>
        </SearchItem>
        <template #moreSearch>
          <SearchItem :prop="'category_id'">
            <el-select
              v-model="queryform.category_id"
              placeholder="商品分类"
              size="small"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>
      <el-card
        shadow="never"
        class="border-0 relative"
        :style="{ height: `${$windowHeight - 60 - 44 - 22 - 78}px` }"
      >
        <!-- 新增和刷新 -->
        <ListHeader
          layout="create,refresh"
          @create="handleCreate"
          @refresh="getData(pager)"
        ></ListHeader>

        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="loading"
          :max-height="$windowHeight - (60 + 44 + 22 + 78 + 48 + 80)"
        >
          <el-table-column label="商品" width="300">
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
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? "上架中" : "仓库" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="审核状态"
            width="120"
            align="center"
            v-if="queryform.tab !== 'delete'"
          >
            <template #default="{ row }">
              <div v-if="row.ischeck == 0">
                <el-button type="success" size="small" plain>
                  审核通过
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  plain
                  class="mt-2"
                  style="margin-left: 0"
                >
                  审核拒绝
                </el-button>
              </div>
              <span v-else>
                <el-tag
                  :type="row.ischeck == 1 ? 'success' : 'danger'"
                  effect="dark"
                >
                  {{ row.ischeck == 1 ? "通过" : "拒绝" }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div class="opr" v-if="queryform.tab !== 'delete'">
                <el-button
                  size="small"
                  type="primary"
                  text
                  icon="EditPen"
                  @click="handleEdit(scope.row)"
                  >修改</el-button
                >
                <el-button size="small" type="primary" text icon="List"
                  >商品规格</el-button
                >
                <el-button size="small" type="primary" text icon="Picture"
                  >设置轮播图</el-button
                >
                <el-button size="small" type="primary" text icon="Tickets"
                  >商品详情</el-button
                >

                <el-popconfirm
                  title="是否删除该商品?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  width="158px"
                  @confirm="handleDelete(scope.row.id)"
                >
                  <template #reference>
                    <el-button size="small" type="primary" icon="Delete" text
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </div>
              <span v-else>暂无操作</span>
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
    <FormDrawer
      :title="isEdit ? '编辑' : '新增'"
      ref="formDrawerRef"
      @submit="handleSubmit"
      @reset="reset"
    >
      <el-form
        :model="createForm"
        ref="DrawerRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="createForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model:avatar="createForm.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="所属管理员" prop="role_id">
          <el-select v-model="createForm.role_id" placeholder="请选择管理员">
            <el-option
              v-for="item in selectData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="createForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import moment from "moment";
import goodsApi from "@/api/goods";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";

const selectData = ref([]);
// 商品分类
const category_list = ref([]);
// 初始化表格数据、搜索、分页、删除、状态
const {
  getData,
  handleQuery,
  handleQueryRest,
  handleDelete,
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
  queryform: {
    title: "",
    tab: "all",
    category_id: null,
  },
  queryRules: {
    title: {
      required: true,
      message: "商品名称不能为空",
      trigger: "blur",
    },
  },
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
    tableData.value = res.list;
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
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  rules: {},
  createApi: goodsApi.setGoods,
  editApi: goodsApi.updateGoods,
  getData,
  pager,
});

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];
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
