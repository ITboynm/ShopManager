import request from "@/utils/request";
// 规格接口
export default {
  // 获取商品规格列表
  getSkus({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/admin/skus/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 增加商品规格
  setSkus(params) {
    return request({
      url: `/admin/skus`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品规格
  updateSkus(id, params) {
    return request({
      url: `/admin/skus/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除/批量删除商品规格
  deleteSkus(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/admin/skus/delete_all`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改规格状态
  updateSkusStatus(id, params) {
    return request({
      url: `/admin/skus/${id}/update_status`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
