<template>
  <div id="">
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${$windowHeight - 60 - 44 - 22}px` }"
    >
      <template #header>
        <div>
          <!-- 新增和刷新 -->
          <ListHeader
            @create="handleCreate"
            @refresh="getData(pager)"
          ></ListHeader>
        </div>
      </template>
      <!-- card body -->
      <div
        class="treeBox"
        :style="{ height: `${$windowHeight - 60 - 44 - 22 - 70 - 55}px` }"
      >
        <el-tree
          :data="tableData"
          :props="{ label: 'name', children: 'child' }"
          class="custom-tree-node"
          @node-click="handleNodeClick"
          v-loading="loading"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
        >
          <template #default="{ node, data }">
            <div class="flex items-center w-[100%]">
              <el-tag size="small" :type="data.menu ? '' : 'info'">
                {{ data.menu ? "菜单" : "权限" }}</el-tag
              >
              <el-icon v-if="data.icon" :size="16" class="mx-2">
                <component :is="data.icon"></component>
              </el-icon>
              <span>{{ data.name }}</span>

              <div class="ml-auto">
                <el-switch
                  :model-value="data.status"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
                <el-button
                  text
                  type="primary"
                  size="small"
                  icon="EditPen"
                  class="ml-12"
                  >修改</el-button
                >
                <el-button text type="warning" size="small" icon="Plus"
                  >增加</el-button
                >
                <el-button text type="danger" size="small" icon="Delete"
                  >删除</el-button
                >
              </div>
            </div>
          </template>
        </el-tree>
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
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="createForm.title"
            placeholder="请输入公告标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="createForm.content"
            type="textarea"
            placeholder="请输入公告内容"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import ListHeader from "@/components/ListHeader.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ruleApi from "@/api/rule";
import { ref } from "vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
const defaultExpandedKeys = ref([]);
const { getData, handleDelete, changeCurrent, loading, tableData, pager } =
  useTableInit({
    queryApi: ruleApi.getRules,
    onSuccessInit: (res) => {
      pager.total = res.totalCount;
      tableData.value = res.list;
      defaultExpandedKeys.value = res.list.map((item) => item.id);
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
  text: "菜单权限",
  createForm: {
    editId: null,
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: "",
  },
  createApi: ruleApi.setRule,
  editApi: ruleApi.updateRule,
  getData,
  pager,
});
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
