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
            layout="create,refresh,delete"
            @create="handleCreate"
            @refresh="getData(pager)"
            @delete="handleDelete(multiSelectionIds)"
          ></ListHeader>
        </div>
      </template>

      <el-table
        :data="tableData"
        ref="multipleTableRef"
        stripe
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :max-height="$windowHeight.value - (48 + 80 + 60 + 44 + 42)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.with || 'auto'"
          :formatter="item.formatter"
        />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange($event, row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              text
              icon="EditPen"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="是否删除该规格?"
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
    <FormDrawer
      :title="isEdit ? '编辑' : '新增'"
      ref="formDrawerRef"
      @submit="handleSubmit"
    >
      <el-form
        :model="createForm"
        ref="DrawerRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="createForm.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="createForm.order" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="createForm.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model:tagval="createForm.default" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import skusApi from "@/api/skus";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import TagInput from "@/components/TagInput.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
const {
  appContext: {
    config: { globalProperties: ctx },
  },
} = getCurrentInstance();
const {
  getData,
  multipleTableRef,
  multiSelectionIds,
  handleSelectionChange,
  handleDelete,
  changeCurrent,
  loading,
  tableData,
  handleStatusChange,
  pager,
  columns,
} = useTableInit({
  queryApi: skusApi.getSkus,
  deleteApi: skusApi.deleteSkus,
  updateStateApi: skusApi.updateSkusStatus,
  columns: [
    {
      label: "规格名称",
      prop: "name",
    },
    {
      label: "规格值",
      prop: "default",
    },
    {
      label: "排序",
      prop: "order",
    },
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
      return item;
    });
  },
});

const {
  formDrawerRef,
  DrawerRef,
  isEdit,
  createForm,
  handleCreate,
  handleEdit,
  handleSubmit,
  rules,
} = useInitForm({
  text: "规格",
  createForm: {
    editId: null,
    name: "",
    default: "",
    order: 50,
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "规格名称不能为空",
        trigger: "blur",
      },
    ],
    default: [
      {
        required: true,
        message: "规格值不能为空",
        trigger: "blur",
      },
    ],
  },
  // 开启xss过滤
  xss: {
    // 当前this(必传)
    ctx,
    // 只针对desc与title字段进行校验
    xssValid: ["name"],
    // 报错字段映射
    validNames: ["规格名称"],
  },
  createApi: skusApi.setSkus,
  editApi: skusApi.updateSkus,
  getData,
  pager,
});
</script>

<style lang="scss" scoped>
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
.custom-tree-node {
  .el-tree-node__content {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
