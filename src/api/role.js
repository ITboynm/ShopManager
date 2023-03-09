import request from "@/utils/request";
// 角色接口
export default {
    // 新增角色
    setRole(params) {
        return request({
            url: `/admin/role`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 修改角色
    updateRole(id, params) {
        return request({
            url: `/admin/role/${id}`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 删除角色
    deleteRole(id, params) {
        return request({
            url: `/admin/role/${id}/delete`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 角色列表
    getRoles({ page, limit } = { page: 1, limit: 10 }, params) {
        return request({
            url: `/admin/role/${page}?limit=${limit}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 修改角色状态
    updateRoleStatus(id, params) {
        return request({
            url: `/admin/role/${id}/update_status`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    //  配置角色权限
    setRoleRules(params) {
        return request({
            url: `/admin/role/set_rules`,
            method: "post",
            data: params,
            // mock: false
        });
    },
};
