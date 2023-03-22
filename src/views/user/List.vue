<template>
  <div id="">
    <!-- 搜索 -->
    <Search v-model="queryform" :rules="queryRules" @search="handleQuery" @reset="getData(pager)"
      @resetCreateForm="queryform.user_level_id = null">
      <SearchItem prop="keyword">
        <el-input v-model="queryform.keyword" size="small" placeholder="手机号/邮箱/会员昵称"></el-input>
      </SearchItem>
      <template #moreSearch>
        <SearchItem prop="user_level_id">
          <el-select v-model="queryform.user_level_id" placeholder="会员等级" size="small">
            <el-option v-for="item in levelSelectData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </SearchItem>
      </template>
    </Search>
    <el-card shadow="never" class="border-0 relative" :style="{ height: `${$windowHeight.value - 60 - 44 - 22 - 78}px` }">
      <!-- 新增和刷新 -->
      <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData(pager)"></ListHeader>

      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
        :max-height="$windowHeight.value - (60 + 44 + 22 + 78 + 48 + 80)">
        <el-table-column label="会员" width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
              <div class="ml-3">
                <h6>{{ row.username }}</h6>
                <small>ID:{{ row.id }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"
          :width="item.with || 'auto'" :align="item.align || ''" :formatter="item.formatter" />
        <el-table-column label="登录注册" width="380" align="center">
          <template #default="{ row }">
            <p>
              注册时间：{{ moment(row.create_time).format("YYYY-MM-DD HH:mm:ss") }}
            </p>
            <p v-if="row.last_login_time">
              最后登录时间：{{ moment(row.last_login_time).format("YYYY-MM-DD HH:mm:ss") }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
              :disabled="row.super == 1" @change="handleStatusChange($event, row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div>
              <el-button size="small" type="primary" text icon="EditPen" @click="handleEdit(scope.row)">修改</el-button>
              <el-popconfirm title="是否删除该用户?" confirm-button-text="确认" cancel-button-text="取消" width="158px"
                @confirm="handleDelete(scope.row.id)">
                <template #reference>
                  <el-button size="small" type="primary" icon="Delete" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="changeCurrent" background layout="prev, pager, next" :total="pager.total"
          :page-size="pager.limit" :current-page="pager.page" />
      </div>
    </el-card>
    <FormDrawer :title="isEdit ? '编辑' : '新增'" ref="formDrawerRef" @submit="handleSubmit" @reset="reset">
      <el-form :model="createForm" ref="DrawerRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model:avatar="createForm.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="createForm.user_level_id" placeholder="会员等级" size="small">
            <el-option v-for="item in levelSelectData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="createForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="createForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="createForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import moment from "moment";
import userApi from "@/api/user";
import FormDrawer from "@/components/FormDrawer.vue";
// import ChooseImage from "@/components/ChooseImage.vue";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
const ChooseImage = defineAsyncComponent(() => import("@/components/ChooseImage.vue"));


const levelSelectData = ref([]);

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
  queryformRef,
  columns,
  tableData,
  pager,
} = useTableInit({
  queryApi: userApi.getUsers,
  deleteApi: userApi.deleteUser,
  updateStateApi: userApi.updateUserStatus,
  queryform: {
    keyword: "",
    user_level_id: null
  },
  columns: [
    {
      label: "会员等级",
      prop: "user_level",
      with: 200,
      align: 'center',
      formatter: (row) => {
        return row.user_level?.name || ' - ';
      },
    }
  ],
  onSuccessInit: (res) => {
    pager.total = res.totalCount;
    levelSelectData.value = res.user_level
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
  rules,
  createForm,
  handleCreate,
  handleEdit,
  handleSubmit,
} = useInitForm({
  text: "用户",
  createForm: {
    editId: null,
    username: "",
    password: "",
    user_level_id: null,
    nickname: '默认昵称',
    phone: null,
    email: '',
    status: 1,
    avatar: "",
  },
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur",
      },
      { min: 3, max: 10, message: "用户名的长度在3~10位", trigger: "blur" },
    ]
  },
  createApi: userApi.setUser,
  editApi: userApi.updateUser,
  getData,
  pager,
});

</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
  height: 60px;
}
</style>
