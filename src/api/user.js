import request from "@/utils/request";
// 用户接口
export default {
    // 新增用户
    setUser(params) {
        return request({
            url: `/user`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 修改用户信息
    updateUser(id, params) {
        return request({
            url: `/user/${id}`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 删除用户
    deleteUser(id, params) {
        return request({
            url: `/user/${id}/delete`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 用户列表
    getUsers({ page, limit } = { page: 1, limit: 10 }, params) {
        return request({
            url: `/user/${page}?limit=${limit}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 修改用户状态
    updateUserStatus(id, params) {
        return request({
            url: `/user/${id}/update_status`,
            method: "post",
            data: params,
            // mock: false
        });
    },
};
