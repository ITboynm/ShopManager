import request from "@/utils/request";
// 图片接口
export default {
  // 修改图片名称
  updateImageName(id, params) {
    return request({
      url: `/image/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除图片
  //   参数
  //   { "ids": [ 483 ] //图片ID组成的一维数组}
  deleteImage(params) {
    return request({
      url: `/image/delete_all`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  //   图片上传
  uploadImage(params) {
    return request({
      url: `/image/upload`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  uploadImageUrl: "/image/upload",
};
