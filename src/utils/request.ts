/** 
*axios二次封装
* @author ZW
*/

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";  // 引入axios和提取interface接口类型
// import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";  // 引入封装的服务方式loading
import { ElMessage } from "element-plus";  // el+ 的message
import { useStore } from "@/stores/userStore";
import setting from "@/config/setting";


// 登录页地址
const LOGIN_URL = '/login'

// 封装的接口返回类型
interface ResultData<T> {
    code: number; // 响应状态码
    msg: string;  // 响应消息
    data: T;    // 响应数据，使用泛型类型
}

// 封装的请求配置枚举
enum ResultEnum {
    TIMEOUT = 10000,
    OVERDUE = 401,
    SUCCESS = 200
}

// 封装的状态码message提示
function checkStatus(status: number) {
    let message = ''
    switch (status) {
        case 404:
            message = '服务器资源不存在'
            break;
        case 500:
            message = '服务器内部错误'
            break;
        case 403:
            message = '没有权限访问该资源'
            break;
        case 403002:
            message = '账号或密码错误'
            break;
        case 401:
            message = '登录状态已过期，需要重新登录'
            break;
        default:
            message = '未知错误！'
            break
    }

    ElMessage.error(message);

}

const config = {
    // 默认地址请求地址，可在 .env 开头文件中修改,这里无需断言
    baseURL: setting.baseApi,
    // 设置超时时间（10s）
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
};

class RequestHttp {
    service: AxiosInstance;
    enableGlobalMock: boolean;
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);
        // 全局mock
        this.enableGlobalMock = setting.mock;
        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                // * 如果当前请求不需要显示 loading,在 api 服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
                // config.headers!.noLoading || showFullScreenLoading();
                // config.headers!.noLoading
                const userOpr = useStore()
                const token: string = userOpr.userToken || '';

                return { ...config, headers: { ...config.headers, "Authorization": token } };
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        /**
         * @description 响应拦截器
         *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const userOpr = useStore()
                const { data } = response;
                // * 在请求结束后，并关闭请求 loading
                // tryHideFullScreenLoading();
                // * 登陆失效（code == 401）
                if (data.code == ResultEnum.OVERDUE) {
                    ElMessage.error(data.msg);
                    userOpr.logout()
                    navigateTo(LOGIN_URL)
                    return Promise.reject(data);
                }
                // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code !== ResultEnum.SUCCESS) {
                    ElMessage.error(data.msg);
                    return Promise.reject(data);
                }
                // * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            async (error: AxiosError) => {
                const { response } = error;
                // tryHideFullScreenLoading();
                // 请求超时单独判断，因为请求超时没有 response
                if (error.message.indexOf("timeout") !== -1) ElMessage.error("请求超时！请您稍后重试");
                // 根据响应的错误状态码，做不同的处理
                if (response) checkStatus(response.status);
                // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
                if (!window.navigator.onLine) navigateTo("/500");
                return Promise.reject(error);
            }
        );
    }

    _useMockApi(mock?: boolean) {
        if (mock === false) return false
        if (mock || this.enableGlobalMock) return true
    }

    // * 常用请求方法封装
    get<T>(url: string, params?: object, mock: boolean = false, _object = {}): Promise<ResultData<T>> {
        this._useMockApi(mock) && (this.service.defaults.baseURL = setting.mockApi)
        return this.service.get(url, { params, ..._object });
    }
    post<T>(url: string, params?: object, mock: boolean = false, _object = {}): Promise<ResultData<T>> {
        this._useMockApi(mock) && (this.service.defaults.baseURL = setting.mockApi)
        return this.service.post(url, params, _object);
    }
    put<T>(url: string, params?: object, mock: boolean = false, _object = {}): Promise<ResultData<T>> {
        this._useMockApi(mock) && (this.service.defaults.baseURL = setting.mockApi)
        return this.service.put(url, params, _object);
    }
    delete<T>(url: string, params?: any, mock: boolean = false, _object = {}): Promise<ResultData<T>> {
        this._useMockApi(mock) && (this.service.defaults.baseURL = setting.mockApi)
        return this.service.delete(url, { params, ..._object });
    }
}

export default new RequestHttp(config);