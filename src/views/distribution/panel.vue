<template>
  <el-row :gutter="20" class="mb-5">
    <template v-if="loading">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="flex justify-between">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
              <el-skeleton-item variant="h3" style="width: 80%" />
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never">
        <div class="flex items-center">
          <el-icon
            :size="20"
            :style="{ backgroundColor: bgList[index] }"
            class="!text-white !w-[40px] !h-[40px] !rounded-full"
          >
            <User v-if="index == 0" />
            <ShoppingCart v-if="index == 1" />
            <PriceTag v-if="index == 2" />
            <Timer v-if="index == 3" />
          </el-icon>
          <div class="ml-2">
            <h2 class="text-lg font-bold">{{ item.value }}</h2>
            <small class="text-xs text-gray-400">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import distributionApi from "@/api/distribution";
import { fetchData } from "@/utils/utils";
import { onMounted, ref } from "vue";

const list = ref([]);
const loading = ref(false);
const bgList = ["#79bbff", "#eebe77", "#95d475", "#f56c6c"];
const getData = async () => {
  loading.value = true;
  const res = await fetchData(
    distributionApi.getAgentStatistics,
    "",
    "",
    "unnotification"
  );
  res.error ? console.log(res.error) : (list.value = res.panels);
  loading.value = false;
};

onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss"></style>
