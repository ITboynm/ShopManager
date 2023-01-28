<template>
  <div class="home">
    <el-row :gutter="20">
      <template v-if="panels.length == 0">
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
                <!-- card body -->
                <span class="text-3xl font-bold text-gray-500">
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </span>
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <template v-else>
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in panels"
          :key="index"
        >
          <el-card shadow="hover" class="border-0">
            <template #header>
              <div class="flex justify-between">
                <span class="text-sm">{{ item.title }}</span>
                <el-tag :type="item.unitColor" effect="plain">
                  {{ item.unit }}
                </el-tag>
              </div>
            </template>
            <!-- card body -->
            <span class="text-3xl font-bold text-gray-500">
              <count-to :value="item.value"></count-to>
            </span>
            <el-divider />
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ item.subTitle }}</span>
              <span>{{ item.subValue }}</span>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <home-navs />
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <home-chart v-permission="['getStatistics3,GET']"/>
      </el-col>
      <el-col :span="12" :offset="0">
        <home-card
          title="店铺及商品提示"
          tip="店铺及商品提示"
          :btns="goods"
          class="mb-4"
          v-permission="['getStatistics2,GET']"
        />
        <home-card
          title="交易提示"
          tip="需要立即处理的交易订单"
          :btns="order"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CountTo from "@/components/CountTo.vue";
import HomeNavs from "@/components/HomeNavs.vue";
import HomeChart from "@/components/HomeChart.vue";
import HomeCard from "@/components/HomeCard.vue";
import statisticsApi from "@/api/statistics";

// 统计数据
const panels = ref([]);

const getStatistics1 = async () => {
  let panelsData = await statisticsApi.getStatistics1();
  panels.value = panelsData.panels;
};
const goods = ref([]);
const order = ref([]);
const getStatistics2 = async () => {
  let res = await statisticsApi.getStatistics2();
  goods.value = res.goods;
  order.value = res.order;
};
getStatistics1();
getStatistics2();
</script>

<style scoped lang="scss"></style>
