import request from "@/utils/request";
// 图库接口
export default {
  // 图库列表接口
  getImageClassList({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/image_class/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
  // 增加图库分类
  setImageClassList(params) {
    return request({
      url: `/image_class`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
