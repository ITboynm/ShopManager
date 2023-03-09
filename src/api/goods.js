import request from "@/utils/request";
// 商品管理接口
export default {
  // 新增商品
  setGoods(params) {
    return request({
      url: `/admin/goods`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品
  updateGoods(id, params) {
    return request({
      url: `/admin/goods/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  //  批量上架/下架商品
  changeGoodsStatus(ids, status) {
    let params = { ids, status };
    return request({
      url: `/admin/goods/changestatus`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  //  商品列表
  getGoodsStatus({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/admin/goods/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 批量删除商品
  deleteGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/admin/goods/delete_all`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 批量恢复商品
  restoreGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/admin/goods/restore`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 彻底删除商品
  destroyGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/admin/goods/destroy`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 审核商品
  checkGoods(id, params) {
    return request({
      url: `/admin/goods/${id}/check`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 设置商品轮播图
  setGoodsBanners(id, banners) {
    const params = Array.isArray(banners)
      ? { banners }
      : { banners: [banners] };
    return request({
      url: `/admin/goods/banners/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 查看商品资料
  readGoods(id, params) {
    return request({
      url: `/admin/goods/read/${id}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 查看商品资料 测试用接口（多规格）
  readGoodsTest(id, params) {
    return request({
      url: `/admin/goods/reads/${id}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 更新商品规格
  updateGoodsSkus(id, params) {
    return request({
      url: `/admin/goods/updateskus/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 添加商品规格选项
  setGoodsSkusCard(params) {
    return request({
      url: `/admin/goods_skus_card`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品规格选项
  updateGoodsSkusCard(id, params) {
    return request({
      url: `/admin/goods_skus_card/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除商品规格选项
  deleteGoodsSkusCard(id, params) {
    return request({
      url: `/admin/goods_skus_card/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 排序商品规格选项
  sortGoodsSkusCard(params) {
    return request({
      url: `/admin/goods_skus_card/sort`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 添加商品规格选项的值
  createGoodsSkusCardValue(params) {
    return request({
      url: `/admin/goods_skus_card_value`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品规格选项的值
  updateGoodsSkusCardValue(id, params) {
    return request({
      url: `/admin/goods_skus_card_value/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除商品规格选项的值
  deleteGoodsSkusCardValue(id, params) {
    return request({
      url: `/admin/goods_skus_card_value/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 选择设置商品规格和选项
  setGoodsSkusCardValue(id, params) {
    return request({
      url: `/admin/goods_skus_card_value/${id}/set`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
