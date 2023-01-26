import adminApi from '@/api/admin'
import operateToken from '@/utils/auth'
export default {
    // 登录
    async login({ commit }, params) {
        try {
            let token = await adminApi.login(params)
            operateToken.setToken(token)
            return Promise.resolve(token)
        } catch (error) {
            return Promise.reject(error)
        }

    },
    // 退出登录
    async logout({ commit }) {
        try {
            let res = await adminApi.logout()
            // 移除cookie里面的token
            operateToken.removeToken()
            // 清除用户状态
            commit('SET_USERINFO', '')
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }

    },
    // 获取用户信息
    async getUserInfo({ commit }) {
        try {
            const userInfo = await adminApi.getUserInfo()
            commit('SET_USERINFO', userInfo)
            commit('SET_MENUS',userInfo.menus)
            commit('SET_RULENAMES',userInfo.ruleNames)
            return Promise.resolve(userInfo)
        } catch (error) {
            return Promise.reject(error)
        }
    },
}