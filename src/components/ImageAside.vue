<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <aside-list
        v-for="(item, index) in imageList"
        :key="index"
        :active="activeId == item.id"
        @edit="hanldeEdit"
        @delete="handleDelete"
        @click="handleClick(item.id)"
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
  <FormDrawer title="新增" ref="formDrawerRef" @submit="hanldeCreateSubmit">
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
import imageApi from "@/api/image";
import FormDrawer from "@/components/FormDrawer.vue";
import { onMounted, reactive, ref, toRaw } from "vue";
import { notification } from "@/utils/utils";
const formDrawerRef = ref(null);
const DrawerRef = ref(null);
const createForm = reactive({
  name: "",
  order: 50,
});

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
const getData = async (param) => {
  loading.value = true;
  try {
    const res = await imageApi.getImageClassList(param);
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
const hanldeEdit = (index) => {
  console.log("edit");
};
// 删除
const handleDelete = (index) => {
  console.log("delete");
};
// 点击
const handleClick = (id) => {
  activeId.value = id;
};
// 添加
const handleCreate = () => {
  formDrawerRef.value.open();
};
// 提交表单
const hanldeCreateSubmit = () => {
  DrawerRef.value.validate(async (valid, fields) => {
    if (!valid) return false;
    try {
      const res = await imageApi.setImageClassList(createForm);
      if (res.id) {
        notification("新增图库分类成功");
        formDrawerRef.value.close();
        DrawerRef.value.resetFields();
        getData();
      }
    } catch (error) {
      notification("新增图库分类失败", "error");
      formDrawerRef.value.close();
      DrawerRef.value.resetFields();
    }
  });
};
const changeCurrent = (cur) => {
  pager.page = cur;
  getData(toRaw(pager));
};
defineExpose({
  handleCreate,
});
onMounted(() => {
  getData();
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
