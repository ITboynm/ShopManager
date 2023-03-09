import request from "@/utils/request";
// 后台接口
export default {
  // 获统计数据1
  getStatistics1(params) {
    return request({
      url: "/admin/statistics1",
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 获统计数据2
  getStatistics2(params) {
    return request({
      url: "/admin/statistics2",
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 获取图表数据
  getStatistics3(params) {
    return request({
      url: `/admin/statistics3?type=${params}`,
      method: "get",
      data: "",
      // mock: false
    });
  },
};
