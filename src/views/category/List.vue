<template>
  <div id="">
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${$windowHeight.value - 60 - 44 - 22}px` }"
    >
      <template #header>
        <div>
          <!-- 新增和刷新 -->
          <ListHeader
            layout="create,refresh"
            @create="handleCreate"
            @refresh="getData(pager)"
          ></ListHeader>
        </div>
      </template>
      <!-- card body -->
      <div
        class="treeBox"
        :style="{ height: `${$windowHeight.value - 60 - 44 - 22 - 70 - 55}px` }"
      >
        <el-tree
          :data="tableData"
          :props="{ label: 'name', children: 'child' }"
          class="custom-tree-node"
          v-loading="loading"
          node-key="id"
        >
          <template #default="{ node, data }">
            <div class="flex items-center w-[100%]">
              <span class="ml-2">{{ data.name }}</span>

              <div class="ml-auto">
                <el-button
                  text
                  type="warning"
                  size="small"
                  icon="Star"
                  class="mr-12"
                  :loading="data.categoryLoading"
                  @click="openGoodsDrawer(data)"
                  >推荐商品</el-button
                >
                <el-switch
                  :model-value="data.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange($event, data)"
                  @click.native.stop
                  :loading="data.statusLoading"
                >
                </el-switch>
                <el-button
                  text
                  type="primary"
                  size="small"
                  icon="EditPen"
                  class="ml-12"
                  @click.stop="handleEdit(data)"
                  >修改</el-button
                >
                <el-popconfirm
                  title="是否删除该分类?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  width="158px"
                  @confirm="handleDelete(data.id)"
                >
                  <template #reference>
                    <el-button
                      text
                      type="danger"
                      size="small"
                      @click.native.stop
                      icon="Delete"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
    </el-card>
    <FormDrawer
      :title="isEdit ? '编辑' : '新增'"
      ref="formDrawerRef"
      @submit="handleSubmit"
    >
      <el-form
        :model="createForm"
        ref="DrawerRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="createForm.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import ListHeader from "@/components/ListHeader.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import categoryApi from "@/api/category";
import GoodsDrawer from "@/views/category/components/GoodsDrawer.vue";
import { cloneDeep } from "lodash";
import { useTableInit, useInitForm } from "@/composables/useCommon";
import { ref, getCurrentInstance } from "vue";
const {
  appContext: {
    config: { globalProperties: ctx },
  },
} = getCurrentInstance();
const goodsDrawerRef = ref(null);
const { getData, handleDelete, handleStatusChange, loading, tableData, pager } =
  useTableInit({
    queryApi: categoryApi.getCategorys,
    deleteApi: categoryApi.deleteCategory,
    updateStateApi: categoryApi.updateCategoryStatus,
    onSuccessInit: async (res) => {
      pager.total = res.totalCount;
      let cloneList = cloneDeep(res).map((item) => {
        item.statusLoading = false;
        item.categoryLoading = false;
        return item;
      });
      tableData.value = cloneList;
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
  text: "分类",
  createForm: {
    editId: null,
    name: "",
  },
  // 开启xss过滤
  xss: {
    // 当前this(必传)
    ctx,
    // 只针对desc与title字段进行校验
    xssValid: ["name"],
    // 报错字段映射
    validNames: ["分类名称"],
  },
  createApi: categoryApi.setCategory,
  editApi: categoryApi.updateCategory,
  getData,
  pager,
});

const openGoodsDrawer = (data) => goodsDrawerRef.value.open(data);
</script>

<style lang="scss">
.treeBox {
  overflow-y: auto;
}

.custom-tree-node {
  .el-tree-node__content {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
