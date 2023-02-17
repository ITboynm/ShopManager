<template>
  <div id="">
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${h}px` }"
    >
      <!-- 新增和刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate" icon="Plus"
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
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.with || 'auto'"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="180" align="center">
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
              title="是否删除该公告?"
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
import moment from "moment";
import noticeApi from "@/api/notice";
import { notification } from "@/utils/utils";
import FormDrawer from "@/components/FormDrawer.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
const rules = {
  title: [
    {
      required: true,
      message: "公告标题不能为空",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "公告内容不能为空",
      trigger: "blur",
    },
  ],
};

// 表格列头
const columns = [
  {
    label: "公告标题",
    prop: "title",
  },
  {
    label: "发布时间",
    prop: "create_time",
    with: 380,
    formatter: (row) => {
      return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
];
const { getData,handleDelete, changeCurrent, loading, tableData, pager } = useTableInit({
  queryApi: noticeApi.getNotices,
  deleteApi:noticeApi.deleteNotice
});

const {
  formDrawerRef,
  DrawerRef,
  isEdit,
  createForm,
  handleCreate,
  handleEdit,
  handleSubmit,
} = useInitForm({
  text: "公告",
  createForm: {
    editId: null,
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  createApi: noticeApi.setNotice,
  editApi: noticeApi.updateNotice,
  getData,
  pager,
});


// 获取浏览器可视区范围
const windowHeight = window.innerHeight || document.body.clientHeight;
// 获取展示区高度
const h = windowHeight - 60 - 44 - 22;
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%];
  height: 60px;
}
</style>
