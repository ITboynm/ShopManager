import request from "@/utils/request";
// 菜单权限接口
export default {
  // 获取菜单权限
  getRules({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/rule/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 增加菜单权限
  setRule(params) {
    return request({
      url: `/rule`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改菜单权限
  updateRule(id, params) {
    return request({
      url: `/rule/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除菜单权限
  deleteRule(id, params) {
    return request({
      url: `/rule/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改菜单权限状态
  updateRuleStatus(id, params) {
    return request({
      url: `/rule/${id}/update_status`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
