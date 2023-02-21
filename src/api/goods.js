import request from "@/utils/request";
// 商品管理接口
export default {
  // 新增商品
  setGoods(params) {
    return request({
      url: `/goods`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品
  updateGoods(id, params) {
    return request({
      url: `/goods/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  //  批量上架/下架商品
  changeGoodsStatus(id, params) {
    return request({
      url: `/goods/changestatus`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  //  商品列表
  getGoodsStatus({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/goods/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 批量删除商品
  deleteGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/goods/delete_all`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 批量恢复商品
  restoreGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/goods/restore`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 彻底删除商品
  destroyGoods(ids) {
    const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
    return request({
      url: `/goods/destroy`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 审核商品
  checkGoods(id, params) {
    return request({
      url: `/goods/${id}/check`,
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
      url: `/goods/banners/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 查看商品资料
  readGoods(id, params) {
    return request({
      url: `/goods/read/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 更新商品规格
  updateGoodsSkus(id, params) {
    return request({
      url: `/goods/updateskus/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 添加商品规格选项
  setGoodsSkusCard(params) {
    return request({
      url: `/goods_skus_card`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品规格选项
  updateGoodsSkusCard(id, params) {
    return request({
      url: `/goods_skus_card/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除商品规格选项
  deleteGoodsSkusCard(id, params) {
    return request({
      url: `/goods_skus_card/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 排序商品规格选项
  sortGoodsSkusCard(params) {
    return request({
      url: `/goods_skus_card/sort`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 添加商品规格选项的值
  createGoodsSkusCardValue(params) {
    return request({
      url: `/goods_skus_card_value`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品规格选项的值
  updateGoodsSkusCardValue(id, params) {
    return request({
      url: `/goods_skus_card_value/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除商品规格选项的值
  deleteGoodsSkusCardValue(id, params) {
    return request({
      url: `/goods_skus_card_value/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 选择设置商品规格和选项
  setGoodsSkusCardValue(id, params) {
    return request({
      url: `/goods_skus_card_value/${id}/set`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
