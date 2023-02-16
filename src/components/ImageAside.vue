<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <aside-list
        v-for="(item, index) in imageList"
        :key="index"
        :active="activeId == item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
      >
        {{ item.name }}
      </aside-list>
    </div>
    <div class="bottom">
      <el-pagination
        @current-change="changeCurrent"
        background
        layout="prev, next"
        :total="pager.total"
        :page-size="pager.limit"
        :current-page="pager.page"
      />
    </div>
  </el-aside>
  <FormDrawer
    :title="isEdit ? '编辑' : '新增'"
    ref="formDrawerRef"
    @submit="handleSubmit"
    @reset="rest"
  >
    <el-form
      :model="createForm"
      ref="DrawerRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="createForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="createForm.order" :min="1" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import AsideList from "@/components/AsideList.vue";
import imageClassApi from "@/api/image_class";
import FormDrawer from "@/components/FormDrawer.vue";
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
  toRaw,
  nextTick,
  getCurrentInstance,
} from "vue";
import { notification, showModal } from "@/utils/utils";

const {
  appContext: {
    config: { globalProperties: ctx },
  },
} = getCurrentInstance();
const formDrawerRef = ref(null);
const DrawerRef = ref(null);
const createForm = reactive({
  name: "",
  order: 50,
});
const isEdit = ref(false);
const resetForm = () => {
  if (DrawerRef.value) DrawerRef.value.clearValidate();
};
const rest = () => {
  DrawerRef.value.resetFields();
};
const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};
// 加载动画
const loading = ref(false);
// 激活状态
const activeId = ref(0);
// 列表数据
const imageList = ref([]);
// 分页参数
const pager = reactive({
  page: 1,
  limit: 10,
  total: 0,
});
// 获取数据
const getData = async (param = { page: pager.page, limit: pager.limit }) => {
  loading.value = true;
  try {
    const res = await imageClassApi.getImageClassList(param);
    imageList.value = res.list;
    pager.total = res.totalCount;
    imageList.value[0] && (activeId.value = imageList.value[0].id);
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};
// 编辑
const handleEdit = (row) => {
  isEdit.value = true;
  resetForm();
  formDrawerRef.value.open();
  nextTick(() => {
    Object.assign(createForm, {
      name: row.name,
      order: row.order,
      editId: row.id,
    });
  });
};
// 删除
const handleDelete = async (id) => {
  loading.value = true;
  try {
    const data = await imageClassApi.deleteImageClass(id);
    if (data) {
      notification("删除成功");
      await getData();
      ctx.$EventBus.emit("changeImageActive", activeId.value);
    } else {
      notification("删除失败", "error");
    }
    loading.value = false;
  } catch (error) {
    notification("删除失败", "error");
    loading.value = false;
  }
};
// 点击切换分类
const handleChangeActiveId = (id) => {
  activeId.value = id;
  ctx.$EventBus.emit("changeImageActive", activeId.value);
};
// 添加
const handleCreate = () => {
  isEdit.value = false;
  resetForm();
  formDrawerRef.value.open();
};
// 初始化状态
const resetLoading = () => {
  formDrawerRef.value.hideLoading();
  formDrawerRef.value.close();
  DrawerRef.value.resetFields();
};
// 提交表单
const handleSubmit = () => {
  DrawerRef.value.validate(async (valid, fields) => {
    if (!valid) return false;
    formDrawerRef.value.showLoading();
    let text = "操作";
    try {
      let res;
      if (!isEdit.value) {
        res = await imageClassApi.setImageClass(createForm);
        if (res) text = "新增";
        pager.page = 1;
      } else {
        res = await imageClassApi.updateImageClass(createForm.editId, {
          name: createForm.name,
          order: createForm.order,
        });
        if (res) text = "编辑";
      }
      resetLoading();
      await getData();
      notification(`${text}图库分类成功`);
      ctx.$EventBus.emit("changeImageActive", activeId.value);
    } catch (error) {
      notification(`${text}图库分类失败`, "error");
      resetLoading();
    }
  });
};
const changeCurrent = async (cur) => {
  pager.page = cur;
  await getData(toRaw(pager));
  ctx.$EventBus.emit("changeImageActive", activeId.value);
};

defineExpose({
  handleCreate,
});
onMounted(async () => {
  await getData();
  ctx.$EventBus.emit("changeImageActive", activeId.value);
});
onBeforeUnmount(() => {
  // 移除指定事件
  ctx.$EventBus.off("changeImageActive");
});
</script>

<style scoped lang="scss">
.image-aside {
  border-right: 1px solid #eee;
  position: relative;

  .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
  }

  .bottom {
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    bottom: 0;
    @apply flex items-center justify-center;
  }
}
</style>
