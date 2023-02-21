import request from "@/utils/request";
// 商品分类接口
export default {
  // 商品分类列表
  getCategorys(params) {
    return request({
      url: `/category`,
      method: "get",
      data: '',
      // mock: false
    });
  },
};
