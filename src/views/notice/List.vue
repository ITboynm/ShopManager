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
        :max-height="$windowHeight - (48 + 80 + 60 + 44 + 22)"
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
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";

const {
  getData,
  handleDelete,
  changeCurrent,
  loading,
  tableData,
  pager,
  columns,
} = useTableInit({
  queryApi: noticeApi.getNotices,
  deleteApi: noticeApi.deleteNotice,
  columns: [
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
  ],
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
  text: "公告",
  createForm: {
    editId: null,
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  rules: {
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
  },
  createApi: noticeApi.setNotice,
  editApi: noticeApi.updateNotice,
  getData,
  pager,
});
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%];
  height: 60px;
}
</style>
