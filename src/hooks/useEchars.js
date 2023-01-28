import * as echarts from "echarts";

/**
 *
 * @param { Object } ele - DOM节点
 * @param { Object } option - echars配置项
 * @returns
 */
const useEchars = ({ ele, param = {}, mock = false }) => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(ele);
  //默认示例 检测是否引入成功 由mock操作
  let defaultOption = {
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };
  // 未传配置则采用默认配置
  let option = mock ? defaultOption : param;
  // 绘制图表
  myChart.setOption(option);
  //图表自适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
  return myChart;
};

const delEchars = (chart) => {
  echarts.dispose(chart);
};
export { useEchars, delEchars };
