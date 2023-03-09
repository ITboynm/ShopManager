import request from "@/utils/request";
// 公告接口
export default {
  // 新增公告
  setNotice(params) {
    return request({
      url: `/admin/notice`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改公告
  updateNotice(id, params) {
    return request({
      url: `/admin/notice/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除公告
  deleteNotice(id, params) {
    return request({
      url: `/admin/notice/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 公告列表
  getNotices({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/admin/notice/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
};
