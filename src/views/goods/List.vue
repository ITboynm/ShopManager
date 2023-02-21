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
        <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData(pager)"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
          :max-height="$windowHeight - (60 + 44 + 22 + 78 + 48 + 80)">
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
            <template #default="scope">
              <div class="opr" v-if="queryform.tab !== 'delete'">
                <el-button size="small" type="primary" text icon="EditPen" @click="handleEdit(scope.row)">修改</el-button>
                <el-button size="small" type="primary" text icon="List">商品规格</el-button>
                <el-button size="small" type="primary" text icon="Picture">设置轮播图</el-button>
                <el-button size="small" type="primary" text icon="Tickets">商品详情</el-button>

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
          <el-cascader v-model="createForm.unit" :options="unitList" :show-all-levels="false" :props='{
            emitPath: false
          }' />
        </el-form-item>
        <el-form-item label="总库存" prop="stock">
          <el-input v-model="createForm.stock" type="number" style="width: 40%;">
            <template #append>{{ createForm.unit }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警" prop="min_stock">
          <el-input v-model="createForm.min_stock" type="number" style="width: 40%;">
            <template #append>{{ createForm.unit }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" prop="min_price">
          <el-input v-model="createForm.min_price" type="number" style="width: 40%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" prop="min_oprice">
          <el-input v-model="createForm.min_oprice" type="number" style="width: 40%;">
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

// 商品单位
const unitList = [{
  value: '数量单位',
  label: '数量单位',
  children: [
    {
      value: '个',
      label: '个',
    },
    {
      value: '双',
      label: '双',
    },
    {
      value: '对',
      label: '对',
    },
    {
      value: '套',
      label: '套',
    },
    {
      value: '张',
      label: '张',
    },
    {
      value: '盒',
      label: '盒',
    },
    {
      value: '件',
      label: '件',
    }
  ]
},
{
  value: '重量单位',
  label: '重量单位',
  children: [
    {
      value: '克',
      label: '克',
    },
    {
      value: '千克',
      label: '千克',
    },
    {
      value: '吨',
      label: '吨',
    },
    {
      value: '斤',
      label: '斤',
    },
    {
      value: 'kg',
      label: 'kg',
    },
    {
      value: 'g',
      label: 'g',
    },
    {
      value: 't',
      label: 't',
    }
  ]
},
{
  value: '长度单位',
  label: '长度单位',
  children: [
    {
      value: '纳米',
      label: '纳米',
    },
    {
      value: '微米',
      label: '微米',
    },
    {
      value: '毫米',
      label: '毫米',
    },
    {
      value: '分米',
      label: '分米',
    },
    {
      value: '米',
      label: '米',
    },
    {
      value: '千米',
      label: '千米',
    },
    {
      value: '公里',
      label: '公里',
    },
    {
      value: '公尺',
      label: '公尺',
    },
    {
      value: 'm',
      label: 'm',
    },
    {
      value: 'km',
      label: 'km',
    },
  ]
},
{
  value: '面积单位',
  label: '面积单位',
  children: [
    {
      value: '平方毫米',
      label: '平方毫米',
    },
    {
      value: '平方分米',
      label: '平方分米',
    },
    {
      value: '平方米',
      label: '平方米',
    },
    {
      value: '平方千米',
      label: '平方千米',
    }
  ]
},
{
  value: '体积单位',
  label: '体积单位',
  children: [
    {
      value: '立方毫米',
      label: '立方毫米',
    },
    {
      value: '立方分米',
      label: '立方分米',
    },
    {
      value: '立方米',
      label: '立方米',
    },
    {
      value: '立方千米',
      label: '立方千米',
    }
  ]
},
{
  value: '钱的单位',
  label: '钱的单位',
  children: [
    {
      value: '分',
      label: '分',
    },
    {
      value: '角',
      label: '角',
    },
    {
      value: '元',
      label: '元',
    },
    {
      value: '美元',
      label: '美元',
    },
    {
      value: '￥',
      label: '￥',
    },
    {
      value: '$',
      label: '$',
    }
  ]
}
]
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
    min_oprice: 1 //最低原价
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
