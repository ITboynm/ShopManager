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
import { onMounted, ref, reactive, nextTick } from "vue";
import moment from "moment";
import noticeApi from "@/api/notice";
import { notification } from "@/utils/utils";
import FormDrawer from "@/components/FormDrawer.vue";
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
const createForm = reactive({
  editId: null,
  title: "",
  content: "",
});
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
// 测试数据
// const testData = [
//   {
//     id: 13,
//     title: "nip",
//     content: "nip\n",
//     order: 0,
//     create_time: "2022-06-06 14:40:11",
//     update_time: "2022-06-06 14:40:11",
//   },
// ];

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
const getData = async (param = pager) => {
  loading.value = true;
  try {
    const res = await noticeApi.getNotices(param);
    pager.total = res.totalCount;
    tableData.value = res.list;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
// 删除
const handleDelete = async (id) => {
  loading.value = true;
  try {
    const res = await noticeApi.deleteNotice(id);
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
const handleEdit = (row) => {
  isEdit.value = true;
  resetForm();
  formDrawerRef.value.open();
  nextTick(() => {
    Object.assign(createForm, {
      title: row.title,
      content: row.content,
      editId: row.id,
    });
  });
};
// 初始化状态
const resetLoading = () => {
  formDrawerRef.value.hideLoading();
  formDrawerRef.value.close();
  DrawerRef.value.resetFields();
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
        res = await noticeApi.setNotice(createForm);
        if (res) text = "新增";
        pager.page = 1;
      } else {
        res = await noticeApi.updateNotice(createForm.editId, {
          title: createForm.title,
          content: createForm.content,
        });
        if (res) text = "编辑";
      }
      resetLoading();
      await getData();
      notification(`${text}公告成功`);
    } catch (error) {
      notification(`${text}公告失败`, "error");
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
const h = windowHeight - 60 - 44 - 22;
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%];
  height: 60px;
}
</style>
