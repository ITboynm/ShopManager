import request from "@/utils/request";
// 优惠券接口
export default {
  // 新增优惠券
  setCoupon(params) {
    return request({
      url: `/coupon`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 修改优惠券
  updateCoupon(id, params) {
    return request({
      url: `/coupon/${id}`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 删除优惠券
  deleteCoupon(id, params) {
    return request({
      url: `/coupon/${id}/delete`,
      method: "post",
      data: params,
      // mock: false
    });
  },
  // 优惠券列表
  getCoupons({ page, limit } = { page: 1, limit: 10 }, params) {
    return request({
      url: `/coupon/${page}?limit=${limit}`,
      method: "get",
      data: params,
      // mock: false
    });
  },
   // 修改优惠劵状态
   updateCouponStatus(id, params) {
    return request({
      url: `/coupon/${id}/update_status`,
      method: "post",
      data: params,
      // mock: false
    });
  },
};
