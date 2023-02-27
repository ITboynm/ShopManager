import request from "@/utils/request";
import { queryParams } from "@/utils/utils";
// 分销接口
export default {
  // 分销数据统计
  getAgentStatistics(params) {
    return request({
      url: `/agent/statistics`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 	分销推广员列表
  getAgents({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/agent/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 推广订单列表
  getUserBills({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/user_bill/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 获取分销配置
  getDistributionSetting(params) {
    return request({
      url: `/distribution_setting/get`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  //修改分销配置
  setDistributionSetting(params) {
    return request({
      url: `/distribution_setting/set`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
