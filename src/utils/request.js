/* 
axios二次封装
*/
import axios from "axios"
import config from "../config"
import { router } from "../router"
import operateToken from '@/utils/auth'
import { notification } from '@/utils/utils'
import { useStore } from 'vuex'
const store = useStore()
// 创建axios实例对象 添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
});

// 请求拦截
service.interceptors.request.use((req) => {
    //@TODO 添加token
    const headers = req.headers
    const { token } = operateToken.getToken() || { token: '' }
    if (token) {
        headers['token'] = token
    }
    // if (!headers.Authorization) headers.Authorization = `Bearer ${token}`
    return req;
});

// 响应拦截
service.interceptors.response.use((res) => {
    const { data } = res.data
    return data
}, (error) => {
    let msg = error.response.data?.msg || ' 请求失败'
    if (msg == '非法token，请重新登录') {
        store.dispatch('logout').finally(() => location.reload())
    }
    notification(msg, 'error')
    return Promise.reject(error)
});

/** 
*请求核心函数
*@param {*} options -请求配置
*/
const request = (options) => {
    // 处理传进来的options
    options.method = options.method || 'GET';
    if (options.method.toLowerCase() === 'get') {
        // 项目规定传参数用data 所以需要转换一下
        options.params = options.data
    }
    let isMock = config.mock
    // 局部mock
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock
    }
    if (config.env === 'prod') {
        // 生产环境强制用线上api
        service.defaults.baseURL = config.baseApi
    } else {
        // 其他情况看情况使用api
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }
    return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    // 暴露单个请求
    request[item] = (url, data, options) => {
        return request({
            method: item,
            data,
            url,
            ...options
        })
    }
})

export default request;