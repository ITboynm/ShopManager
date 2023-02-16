<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in imageList"
          :key="index"
        >
          <el-card
            shadow="hover"
            class="relative mb-3 cursor-pointer"
            :body-style="{
              padding: 0,
            }"
            :class="{ checked: item.checked }"
          >
            <el-image
              :src="item.url"
              :fit="cover"
              :preview-src-list="[item.url]"
              :initial-index="0"
              class="w-full h-[150px]"
            />
            <div class="image-title">{{ item.name }}</div>
            <div class="flex items-center justify-center py-2">
              <el-checkbox
                v-model="item.checked"
                v-if="isChoose"
                @change="handleChooseChange(item)"
              ></el-checkbox>
              <el-button
                type="primary"
                size="small"
                text
                @click="handleimageRename(item.id, item.name)"
                >重命名</el-button
              >
              <el-popconfirm
                title="是否删除该图片?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                width="158px"
                @confirm="handleImageDelete(item.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text style="margin: 0"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        @current-change="changeCurrent"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.limit"
        :current-page="pager.page"
      />
    </div>
  </el-main>
  <el-drawer v-model="drawer" title="上传图片">
    <upload-file
      @success="handleuploadSuccess"
      :data="{ image_class_id }"
    ></upload-file>
  </el-drawer>
</template>

<script setup>
import imageClassApi from "@/api/image_class";
import imageApi from "@/api/image";
import UploadFile from "@/components/UploadFile.vue";
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
  getCurrentInstance,
  computed,
} from "vue";
import { showPromptModal, notification } from "@/utils/utils";
const {
  appContext: {
    config: { globalProperties: ctx },
  },
} = getCurrentInstance();
defineProps({
  isChoose: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["choose"]);
// 是否展示上传图片组件
const drawer = ref(false);

const openUploadFile = () => (drawer.value = true);
// 加载动画
const loading = ref(false);
// 列表数据
const imageList = ref([]);
// 图库分类ID
const image_class_id = ref(0);
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
    const res = await imageClassApi.getImageClassListById(id, param);
    imageList.value = res.list.map((item) => {
      item.checked = false;
      return item;
    });
    pager.total = res.totalCount;
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

// 根据分类id请求数据
const loadData = (cur, id = image_class_id.value) => {
  image_class_id.value = id;
  cur ? (pager.page = cur) : (pager.page = 1);
  getData(image_class_id.value, pager);
};
const changeCurrent = (cur) => {
  loadData(cur);
};
const handleimageRename = (id, name) => {
  showPromptModal("重命名图片", name)
    .then(async ({ value }) => {
      loading.value = true;
      const res = await imageApi.updateImageName(id, { name: value });
      if (res) {
        loadData(pager.page);
        notification("修改图片名称成功", "success");
      } else {
        notification("修改图片名称失败", "error");
      }
      loading.value = false;
    })
    .catch(() => {
      notification("用户取消操作", "info");
    });
};

const handleImageDelete = async (id) => {
  try {
    loading.value = true;
    const res = await imageApi.deleteImage({ ids: [id] });
    if (res) {
      loadData();
      notification("删除图片成功", "success");
    } else {
      notification("删除图片失败", "error");
    }
    loading.value = false;
  } catch (error) {
    notification("删除图片失败", "error");
    loading.value = false;
  }
};

// 选中的图片
const checkedImage = computed(() =>
  imageList.value.filter((item) => item.checked)
);
const handleChooseChange = (item) => {
  if (item.checked && checkedImage.value.length > 1) {
    item.checked = false;
    return notification("至多选中一张图片", "info");
  }
  emits("choose", checkedImage.value[0]?.url);
};

const resetChecked = () => {
  imageList.value.forEach((item) => {
    item.checked = false;
  });
};

ctx.$EventBus.on("changeImageActive", async (id) => {
  await loadData(1, id);
});
// 监听上传成功
const handleuploadSuccess = () => loadData();
defineExpose({
  openUploadFile,
  resetChecked,
});
onBeforeUnmount(() => {
  // 移除指定事件
  ctx.$EventBus.off("changeImageActive");
});
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
    .checked {
      border: 1px solid rgba(59, 130, 246, 1) !important;
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
