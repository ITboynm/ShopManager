import request from "@/utils/request";
// 商品分类接口
export default {
  // 商品分类列表
  getCategorys(params) {
    return request({
      url: `/category`,
      method: "get",
      data: "",
      // mock: false
    });
  },
  // 增加商品分类
  setCategory(params) {
    return request({
      url: `/category`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品分类
  updateCategory(id, params) {
    return request({
      url: `/category/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改商品分类状态
  updateCategoryStatus(id, params) {
    return request({
      url: `/category/${id}/update_status`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除商品分类
  deleteCategory(id) {
    return request({
      url: `/category/${id}/delete`,
      method: "post",
      data: '',
      // mock: false
    });
  },
  // 分类关联产品列表
  getCategorysItemList(params) {
    return request({
      url: `/app_category_item/list`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 删除关联产品
  deleteCategorysItemList(id, params) {
    return request({
      url: `/app_category_item/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 关联产品
  setCategorysItemList(params) {
    return request({
      url: `/app_category_item`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
