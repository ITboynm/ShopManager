<template>
  <div id="">
    <el-card shadow="never" class="border-0 relative" :style="{ height: `${$windowHeight - 60 - 44 - 22}px` }">
      <template #header>
        <div>
          <!-- 新增和刷新 -->
          <ListHeader @create="handleCreate" @refresh="getData(pager)"></ListHeader>
        </div>
      </template>
      <!-- card body -->
      <div class="treeBox" :style="{ height: `${$windowHeight - 60 - 44 - 22 - 70 - 55}px` }">
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" class="custom-tree-node"
          @node-click="handleNodeClick" v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
          <template #default="{ node, data }">
            <div class="flex items-center w-[100%]">
              <el-tag size="small" :type="data.menu ? '' : 'info'">
                {{ data.menu ? "菜单" : "权限" }}</el-tag>
              <el-icon v-if="data.icon" :size="16" class="mx-2">
                <component :is="data.icon"></component>
              </el-icon>
              <span>{{ data.name }}</span>

              <div class="ml-auto">
                <el-switch :model-value="data.status" :active-value="1" :inactive-value="0"
                  @change="handleStatusChange($event, data)" @click.native.stop :loading="data.statusLoading">
                </el-switch>
                <el-button text type="primary" size="small" icon="EditPen" class="ml-12"
                  @click.stop="handleEdit(data)">修改</el-button>
                <el-button text type="warning" size="small" icon="Plus"
                  @click.stop="handleAddChild(data.id)">增加</el-button>
                <el-popconfirm :title="data.menu ? '是否删除该菜单?' : '是否删除该权限?'" confirm-button-text="确认"
                  cancel-button-text="取消" width="158px" @confirm="handleDelete(data.id)">
                  <template #reference>
                    <el-button text type="danger" size="small" @click.native.stop icon="Delete">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>
    <FormDrawer :title="isEdit ? '编辑' : '新增'" ref="formDrawerRef" @submit="handleSubmit">
      <el-form :model="createForm" ref="DrawerRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader v-model="createForm.rule_id" :options="selectRules" :props="{
            label: 'name',
            children: 'child',
            value: 'id',
            checkStrictly: true,
            emitPath: false,
          }" placeholder="请选择上级菜单" />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="createForm.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="createForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="createForm.menu == 1">
          <IconSelect v-model:selectIcon="createForm.icon"></IconSelect>
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="createForm.menu == 1 && createForm.rule_id > 0">
          <el-input v-model="createForm.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="createForm.menu == 0">
          <el-input v-model="createForm.condition" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="createForm.menu == 0">
          <el-select v-model="createForm.method" placeholder="请选择请求方式">
            <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="createForm.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import ListHeader from "@/components/ListHeader.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import IconSelect from "@/components/IconSelect.vue";
import ruleApi from "@/api/rule";
import { ref } from "vue";
import { cloneDeep } from "lodash";
import { useTableInit, useInitForm } from "@/composables/useCommon";
import { recursionTree } from '@/utils/utils'
const defaultExpandedKeys = ref([]);
const selectRules = ref([]);
const { getData, handleDelete, handleStatusChange, loading, tableData, pager } =
  useTableInit({
    queryApi: ruleApi.getRules,
    deleteApi: ruleApi.deleteRule,
    updateStateApi: ruleApi.updateRuleStatus,
    onSuccessInit: async (res) => {
      selectRules.value = res.rules;
      pager.total = res.totalCount;
      let cloneList = cloneDeep(res.list)
      await recursionTree({
        arr: cloneList,
        key: 'statusLoading',
        value: false
      })
      console.log(cloneList)
      tableData.value = cloneList;
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

// 添加子分类
const handleAddChild = (id) => {
  handleCreate()
  createForm.rule_id = id
  createForm.status = 1
}
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
