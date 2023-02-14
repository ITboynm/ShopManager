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
  setImageClass(params) {
    return request({
      url: `/image_class`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改图库分类
  updateImageClass(id, params) {
    return request({
      url: `/image_class/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除图库分类
  deleteImageClass(id, params) {
    return request({
      url: `/image_class/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 指定图库列表接口
  getImageClassListById(id, { page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/image_class/${id}/image/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
};
