import request from "@/utils/request";
// 管理员接口
export default {
  // 登录
  login(params) {
    return request({
      url: "/login",
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 退出登录
  logout(params) {
    return request({
      url: "/logout",
      method: "post",
      data: params,
      mock: false,
    });
  },
  // 获取管理员信息
  getUserInfo(params) {
    return request({
      url: "/getinfo",
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改密码
  updatePassword(params) {
    return request({
      url: "/updatepassword",
      method: "post",
      data: params,
      // mock: false,
    });
  },
  // 获取管理员列表
  getManagers({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/manager/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false,
    });
  },
  // 修改管理员状态
  updateManagerState(id, params) {
    return request({
      url: `/manager/${id}/update_status`,
      method: "post",
      data: params,
      // mock: false,
    });
  },
  // 新增管理员
  setManager(params) {
    return request({
      url: `/manager`,
      method: "post",
      data: params,
      // mock: false,
    });
  },
  // 修改管理员
  updateManager(id, params) {
    return request({
      url: `/manager/${id}`,
      method: "post",
      data: params,
      // mock: false,
    });
  },
   // 删除管理员
   deleteManager(id, params) {
    return request({
      url: `/manager/${id}/delete`,
      method: "post",
      data: params,
      // mock: false,
    });
  },
};
