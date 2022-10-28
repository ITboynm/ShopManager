import managerApi from '@/api/manager'
import operateToken from '@/utils/auth'
export default {
    // 登录
    async login({ commit }, params) {
        try {
            let token = await managerApi.login(params)
            operateToken.setToken(token)
            return Promise.resolve(token)
        } catch (error) {
            return Promise.reject(error)
        }

    },
    // 退出登录
    async logout({ commit }) {
        try {
            let res = await managerApi.logout()
            // 移除cookie里面的token
            operateToken.removeToken()
            // 清除用户状态
            commit('saveUserInfo', '')
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }

    },
    // 获取用户信息
    async getUserInfo({ commit }) {
        try {
            const userInfo = await managerApi.getUserInfo()
            commit('saveUserInfo', userInfo)
            return Promise.resolve(userInfo)
        } catch (error) {
            return Promise.reject(error)
        }
    },
}