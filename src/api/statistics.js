import request from '@/utils/request';
// 后台接口
export default {
    // 登录
    getStatistics1(params) {
        return request({
            url: '/statistics1',
            method: 'get',
            data: params,
            // mock: false
        })
    }
}