<template>
  <el-form-item label="规格选项">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :loading="item.loading"
      :key="item.id"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdateSkuCard(item)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)"
                ><More
              /></el-icon>
            </template>
          </el-input>
          <div>
            <el-button
              size="small"
              icon="Top"
              text
              :type="index == 0 ? 'danger' : 'success'"
              :disabled="index == 0"
              :loading="item.upLoading"
              @click="sortCard('up', index, item)"
            ></el-button>
            <el-button
              size="small"
              text
              :type="index == sku_card_list.length - 1 ? 'danger' : 'success'"
              icon="Bottom"
              :loading="item.downLoading"
              :disabled="index == sku_card_list.length - 1"
              @click="sortCard('down', index, item)"
            ></el-button>
            <el-popconfirm
              title="是否删除该规格项?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              width="170px"
              @confirm="handleDeleteSkuCard(item)"
            >
              <template #reference>
                <el-button
                  text
                  size="small"
                  icon="Delete"
                  :loading="item.delLoading"
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <el-button
      type="success"
      size="small"
      icon="Position"
      :loading="btnLoading"
      @click="addSkuCardEvent"
      >添加规格</el-button
    >
    <ChooseSku ref="ChooseSkuRef"></ChooseSku>
  </el-form-item>
</template>

<script setup>
import SkuCardItem from "@/views/goods/components/SkuCardItem.vue";
import ChooseSku from "@/components/ChooseSku.vue";
import { ref } from "vue";
import {
  sku_card_list,
  addSkuCardEvent,
  btnLoading,
  handleUpdateSkuCard,
  handleDeleteSkuCard,
  handleChooseSetGoods,
  sortCard,
} from "@/composables/useSku";
const ChooseSkuRef = ref(null);
const handleChooseSku = (item) => {
  ChooseSkuRef.value.open((val) => {
    handleChooseSetGoods(item.id, {
      name: val.name,
      value: val.list,
    });
  });
};
</script>

<style scoped lang="scss">
:deep(.el-card__header) {
  @apply p-2 bg-gray-100;
}
</style>
