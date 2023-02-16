<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            v-for="(item, index) in options"
            :key="index"
            :checked="current == item.value"
            style="margin-right: 8px"
            @click="handleChoose(item.value)"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <!-- card body -->
    <div id="chart"></div>
  </el-card>
</template>

<script setup>
import { useEchars, delEchars } from "@/hooks/useEchars";
import { ref, onMounted, onBeforeUnmount } from "vue";
import statisticsApi from "@/api/statistics";
const current = ref("week");
let myChart;
// tab项
const options = [
  {
    text: "近一个月",
    value: "mouth",
  },
  {
    text: "近一周",
    value: "week",
  },
  {
    text: "近24小时",
    value: "hour",
  },
];
// 获取数据配置echars
const Option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  xAxis: {
    data: [],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [],
    },
  ],
};
// tab切换
const handleChoose = async (type) => {
  current.value = type;
  await setOptinons(current.value);
  myChart.setOption(Option);
};
// 设置echars配置项
const setOptinons = async (type) => {
  myChart.showLoading();
  let res = await statisticsApi.getStatistics3(type);
  Option.xAxis.data = res.x;
  Option.series[0].data = res.y;
  Option.title.text = type
  myChart.hideLoading();
};
// 初始化echars
onMounted(async () => {
  let chartDom = document.getElementById("chart");
  if (!chartDom) return;
  myChart = useEchars({ ele: chartDom });
  await setOptinons(current.value);
  myChart.setOption(Option);
});
// 销毁echars，防止打包后白屏
onBeforeUnmount(() => {
  if (myChart) delEchars(myChart);
});
</script>

<style scoped lang="scss">
#chart {
  width: 100%;
  height: 300px;
}
</style>
