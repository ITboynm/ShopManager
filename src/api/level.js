import request from "@/utils/request";
// 会员等级接口
export default {
    // 新增会员等级
    setUserLevel(params) {
        return request({
            url: `/user_level`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 修改会员等级
    updateUserLevel(id, params) {
        return request({
            url: `/user_level/${id}`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 删除会员等级
    deleteUserLevel(id, params) {
        return request({
            url: `/user_level/${id}/delete`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 会员等级列表
    getUserLevels({ page, limit } = { page: 1, limit: 10 }, params) {
        return request({
            url: `/user_level/${page}?limit=${limit}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 修改会员等级状态
    updateUserLevelStatus(id, params) {
        return request({
            url: `/user_level/${id}/update_status`,
            method: "post",
            data: params,
            // mock: false
        });
    },
};
