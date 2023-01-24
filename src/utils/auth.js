import { useCookies } from '@vueuse/integrations/useCookies'
const cookies = useCookies(['locale'])
const TokenKey = 'admin-token'
// 本地存入token
export default {
    getToken() {
        return cookies.get(TokenKey)
    },
    setToken(token) {
        cookies.set(TokenKey, token)
    },
    removeToken() {
        cookies.remove(TokenKey)
    }
}