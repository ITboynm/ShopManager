import request from "@/utils/request";
// 会员等级接口
export default {
    // 回复商品评价
    reviewGoodsComment(id, params) {
        return request({
            url: `/admin/goods_comment/review/${id}`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 回复列表
    getGoodsComments({ page, limit } = { page: 1, limit: 10 }, params) {
        return request({
            url: `/admin/goods_comment/${page}?limit=${limit}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 修改回复状态
    updateGoodsCommentStatus(id, params) {
        return request({
            url: `/admin/goods_comment/${id}/update_status`,
            method: "post",
            data: params,
            // mock: false
        });
    },
};
