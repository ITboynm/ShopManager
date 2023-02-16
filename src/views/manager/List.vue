<template>
  <div id="">
    <!-- 搜索 -->
    <el-form
      :model="queryform"
      ref="queryformRef"
      :rules="rules"
      label-width="80px"
      class="queryform"
      inline
      size="normal"
    >
      <el-form-item label="">
        <el-input
          v-model="queryform.keyword"
          class="w-[200px]"
          size="small"
          placeholder="管理员昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
          icon="Search"
          size="small"
          >搜索</el-button
        >
        <el-button icon="RefreshLeft" size="small" @click="handleQueryRest"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${h}px` }"
    >
      <!-- 新增和刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate"
          >新增</el-button
        >
        <el-tooltip effect="dark" content="刷新数据" placement="top">
          <el-button text @click="getData(pager)">
            <el-icon :size="20"><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        :max-height="h - (48 + 80)"
      >
        <el-table-column label="管理员" width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="ml-3">
                <h6>{{ row.username }}</h6>
                <small>ID:{{ row.id }}</small>
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
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              :disabled="row.super == 1"
              @change="handleStatusChange($event, row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
              >暂无操作</small
            >
            <div v-else>
              <el-button
                size="small"
                type="primary"
                text
                icon="EditPen"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-popconfirm
                title="是否删除该管理员?"
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
          <ChooseImage
            @ChooseImage="setImage"
            :Image="createForm.avatar"
          ></ChooseImage>
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
import { onMounted, ref, reactive, nextTick, toRaw } from "vue";
import moment from "moment";
import adminApi from "@/api/admin";
import { notification } from "@/utils/utils";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
const queryformRef = ref(null);
const queryform = reactive({
  keyword: "",
});
// 分页参数
const pager = reactive({
  page: 1,
  limit: 10,
  total: 0,
});
const loading = ref(false);
const tableData = ref([]);
const formDrawerRef = ref(null);
const DrawerRef = ref(null);
const isEdit = ref(false);
const resetForm = () => {
  if (DrawerRef.value) DrawerRef.value.clearValidate();
};
const reset = () => {
  if (DrawerRef.value) DrawerRef.value.resetFields();
};
const selectData = ref([]);
const createForm = reactive({
  editId: null,
  username: "",
  password: "",
  role_id: null,
  status: 1,
  avatar: "",
});
const rules = reactive({
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
    { min: 3, max: 10, message: "用户名的长度在3~10位", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "用户密码不能为空",
      trigger: "blur",
    },
    { min: 3, max: 5, message: "密码的长度在3~5位", trigger: "blur" },
  ],
});
const setImage = (avatar) => {
  createForm.avatar = avatar;
};
// 表格列头
const columns = [
  {
    label: "所属管理员",
    prop: "role",
    align: "center",
    formatter: (row) => {
      return row.role?.name || "-";
    },
  },
  {
    label: "创建时间",
    prop: "create_time",
    with: 380,
    formatter: (row) => {
      return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
];
const getData = async (param = pager, data) => {
  loading.value = true;
  try {
    const res = await adminApi.getManagers(param, data);
    pager.total = res.totalCount;
    selectData.value = res.roles;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
      return item;
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
// 删除
const handleDelete = async (id) => {
  loading.value = true;
  try {
    const res = await adminApi.deleteManager(id);
    if (res) {
      notification("删除成功");
      getData();
    } else {
      notification("删除失败", "error");
    }
    loading.value = false;
  } catch (error) {
    notification("删除失败", "error");
    loading.value = false;
  }
};
// 新增
const handleCreate = async () => {
  resetForm();
  formDrawerRef.value.open();
};
// 编辑
const handleEdit = async (row) => {
  isEdit.value = true;
  resetForm();
  formDrawerRef.value.open();
  nextTick(() => {
    Object.assign(createForm, {
      editId: row.id,
      username: row.username,
      password: row.password,
      role_id: row.role_id,
      status: row.status,
      avatar: row.avatar,
    });
  });
};
// 修改状态
const handleStatusChange = async (status, row) => {
  row.statusLoading = true;
  try {
    const res = await adminApi.updateManagerState(row.id, { status });
    if (res) {
      notification("状态修改成功");
      row.status = status;
    } else {
      notification("状态修改失败", "error");
    }
    row.statusLoading = false;
  } catch (error) {
    notification("状态修改失败", "error");
    row.statusLoading = false;
  }
};
// 查询
const handleQuery = () => {
  queryform.keyword
    ? getData(pager, { keyword: queryform.keyword })
    : getData();
};
// 重置
const handleQueryRest = () => {
  queryform.keyword = "";
  getData();
};
// 初始化状态
const resetLoading = () => {
  formDrawerRef.value.hideLoading();
  formDrawerRef.value.close();
  reset();
};
// 提交
// 提交表单
const handleSubmit = () => {
  DrawerRef.value.validate(async (valid, fields) => {
    if (!valid) return false;
    formDrawerRef.value.showLoading();
    let text = "操作";
    try {
      let res;
      if (!isEdit.value) {
        res = await adminApi.setManager(createForm);
        if (res) text = "新增";
        pager.page = 1;
      } else {
        res = await adminApi.updateManager(createForm.editId, {
          username: createForm.username,
          password: createForm.password,
          role_id: createForm.role_id,
          status: createForm.status,
          avatar: createForm.avatar,
        });
        if (res) text = "编辑";
      }
      resetLoading();
      await getData();
      notification(`${text}管理员成功`);
    } catch (error) {
      notification(`${text}管理员失败`, "error");
      resetLoading();
    }
  });
};
const changeCurrent = async (cur) => {
  pager.page = cur;
  await getData(toRaw(pager));
};
// 获取浏览器可视区范围
const windowHeight = window.innerHeight || document.body.clientHeight;
// 获取展示区高度
const h = windowHeight - 60 - 44 - 22 - 78;
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
.queryform {
  margin-bottom: 10px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  .el-form-item {
    margin-bottom: 0;
  }
}
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
