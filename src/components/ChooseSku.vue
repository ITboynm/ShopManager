<template>
  <el-dialog
    title="规格选择"
    v-model="dialogVisible"
    destroy-on-close
    width="80%"
    top="3vh"
    @close="handleClose"
  >
    <el-container style="height: 65vh">
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div
            class="sku-list flex justify-between"
            v-for="(item, index) in tableData"
            :class="{ activeSku: activeId == item.id }"
            @click="handleChangeActiveId(item)"
            :key="index"
          >
            {{ item.name }}
            <el-icon><Right /></el-icon>
          </div>
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
      <el-main height="">
        <el-checkbox-group v-model="skuForm.list" size="large">
          <el-checkbox
            v-for="item in mainList"
            border
            :key="item"
            :label="item"
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import skusApi from "@/api/skus";
import { useTableInit } from "@/composables/useCommon";

const { tableData, pager, loading, getData, changeCurrent } = useTableInit({
  queryApi: skusApi.getSkus,
});
const callbackFun = ref(null);
const activeId = ref(0);
const dialogVisible = ref(false);
const skuForm = reactive({
  name: "",
  list: [],
});
const mainList = ref([]);
const handleChangeActiveId = ({ id, name, ...data }) => {
  activeId.value = id;
  mainList.value = [];
  skuForm.name = name;
  mainList.value = data.default.split(",");
};

const submit = async () => {
  if (typeof callbackFun.value == "function") {
    callbackFun.value(skuForm);
  }
  handleClose();
};

const open = (callback = null) => {
  callbackFun.value = callback;
  getData(pager);
  activeId.value = tableData.value[0]?.id || 0;
  skuForm.name = tableData.value[0]?.name || "";
  mainList.value = tableData.value[0]?.default.split(",") || [];
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
  skuForm.list = [];
};

defineExpose({
  open,
});
</script>

<style lang="scss">
.el-dialog__body {
  padding: 0 !important;
}
.activeSku {
  @apply bg-blue-50;
}
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

.sku-list {
  border-bottom: 1px solid #f4f4f4;
  transition: all 0.2s linear;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
  &:hover {
    @apply bg-blue-50;
  }
}
</style>
