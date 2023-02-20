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

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        :max-height="$windowHeight - (48 + 80 + 60 + 44 + 42)"
      >
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
              icon="Setting"
              @click="handleSetRule(scope.row)"
              >配置权限</el-button
            >
            <el-button
              size="small"
              type="primary"
              text
              icon="EditPen"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="是否删除该角色?"
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="createForm.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="createForm.desc"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="createForm.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
    <FormDrawer
      title="配置权限"
      ref="setRuleDrawerRef"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        ref="elTreeRef"
        :data="rulesData"
        :props="{ label: 'name', children: 'child' }"
        :check-strictly="checkStrictly"
        class="custom-tree-node"
        v-loading="loading"
        node-key="id"
        @check="handleTreeCheck"
        :height="$windowHeight - 170"
        show-checkbox
        :default-expanded-keys="defaultExpandedKeys"
      >
        <template #default="{ node, data }">
          <div class="flex items-center w-[100%]">
            <el-tag size="small" :type="data.menu ? '' : 'info'">
              {{ data.menu ? "菜单" : "权限" }}</el-tag
            >
            <el-icon v-if="data.icon" :size="16" class="ml-2">
              <component :is="data.icon"></component>
            </el-icon>
            <span class="ml-2">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from "vue";
import roleApi from "@/api/role";
import ruleApi from "@/api/rule";
import { notification } from "@/utils/utils";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
const setRuleDrawerRef = ref(null);
const elTreeRef = ref(null);
// 默认父子节点关联
const checkStrictly = ref(false)
const defaultExpandedKeys = ref([]);
const rulesData = ref([]);
const roleInfo = reactive({
  id: 0,
  rule_ids: [],
});

// 当前用户拥有的权限id
const roleIds = ref([]);
const {
  getData,
  handleDelete,
  changeCurrent,
  loading,
  tableData,
  handleStatusChange,
  pager,
  columns,
} = useTableInit({
  queryApi: roleApi.getRoles,
  deleteApi: roleApi.deleteRole,
  updateStateApi: roleApi.updateRoleStatus,
  columns: [
    {
      label: "角色名称",
      prop: "name",
    },
    {
      label: "角色描述",
      prop: "desc",
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
  text: "角色",
  createForm: {
    editId: null,
    name: "",
    desc: "",
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "角色名称不能为空",
        trigger: "blur",
      },
    ],
    desc: [
      {
        required: true,
        message: "描述内容不能为空",
        trigger: "blur",
      },
    ],
  },
  createApi: roleApi.setRole,
  editApi: roleApi.updateRole,
  getData,
  pager,
});

const handleSetRule = async ({ id, ...data }) => {
  roleInfo.id = id;
  checkStrictly.value = true
  const res = await ruleApi.getRules();
  rulesData.value = res.list;
  defaultExpandedKeys.value = res.list.map((item) => item.id);
  setRuleDrawerRef.value.open();
  //   获取当前角色拥有的权限id
  roleIds.value = data.rules.map((item) => item.id);
  nextTick(() => {
    elTreeRef.value.setCheckedKeys(roleIds.value);
    checkStrictly.value = false
  });
};

const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  roleInfo.rule_ids = [...checkedKeys, ...halfCheckedKeys];
};

const handleSetRuleSubmit = async () => {
  setRuleDrawerRef.value.showLoading();
  try {
    const res = await roleApi.setRoleRules(roleInfo);
    if (res) {
      getData();
      notification(`设置权限成功`);
    } else {
      notification(`设置权限失败`, "error");
    }
    setRuleDrawerRef.value.hideLoading();
    setRuleDrawerRef.value.close();
  } catch (error) {
    console.log(error);
    setRuleDrawerRef.value.hideLoading();
    notification(`设置权限失败`, "error");
  }
};
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
