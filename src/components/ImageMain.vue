<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, index) in imageList" :key="index">
          <el-card shadow="hover" class="relative mb-3 cursor-pointer" :body-style="{
            'padding': 0
          }">
            <el-image :src="item.url" :fit="cover" :preview-src-list="[item.url]" :initial-index="0"
              class="w-full h-[150px]" />
            <div class="image-title">{{ item.name }}</div>
            <div class="flex items-center justify-center py-2">
              <el-button type="primary" size="small" text>重命名</el-button>
              <el-button type="primary" size="small" text>删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination @current-change="changeCurrent" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.limit" :current-page="pager.page" />
    </div>
  </el-main>
</template>

<script setup>
import imageApi from "@/api/image";
import { onMounted, onBeforeUnmount, reactive, ref, getCurrentInstance } from 'vue'
const { appContext: { config: { globalProperties: ctx } } } = getCurrentInstance()
// 加载动画
const loading = ref(false);
// 列表数据
const imageList = ref([]);
// 图库分类ID
const image_class_id = ref(0)
// 分页参数
const pager = reactive({
  page: 1,
  limit: 12,
  total: 0,
});
// 获取数据
const getData = async (id, param) => {
  loading.value = true;
  try {
    const res = await imageApi.getImageClassListById(id, param);
    imageList.value = res.list;
    pager.total = res.totalCount;
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

// 根据分类id请求数据
const loadData = (id) => {
  pager.page = 1
  image_class_id.value = id
  getData(image_class_id.value, pager)
}

ctx.$EventBus.on('changeImageActive', id => {
  loadData(id)
})
onBeforeUnmount(() => {
  // 移除指定事件
  ctx.$EventBus.off('changeImageActive')
})
</script>

<style scoped lang="scss">
.image-main {
  border-right: 1px solid #eee;
  position: relative;

  .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;

    .image-title {
      position: absolute;
      top: 122px;
      left: -1px;
      right: -1px;
      @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
    }
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
