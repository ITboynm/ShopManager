import request from '@/utils/request';

export default {
    // 登录
    login(params) {
        return request({
            url: '/admin/login',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 退出登录
    logout(params) {
        return request({
            url: '/admin/logout',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 获取管理员信息
    getUserInfo(params){
        return request({
            url: '/admin/getinfo',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 修改密码
    updatePassword(params) {
        return request({
            url: '/admin/updatepassword',
            method: 'post',
            data: params,
            mock: false
        })
    },
}