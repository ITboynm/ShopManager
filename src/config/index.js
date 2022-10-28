/* 
环境配置封装
*/
// 默认生产
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    // 开发环境
    dev: {
        baseApi: 'http://ceshi13.dishait.cn',
        mockApi: 'https://www.fastmock.site/mock/1ac7da2fb78f6ad7939c6bfbf4ebbecf/api'
    },
    // 测试环境
    test: {
        baseApi: 'http://ceshi13.dishait.cn',
        mockApi: 'https://www.fastmock.site/mock/1ac7da2fb78f6ad7939c6bfbf4ebbecf/api'
    },
    // 生产环境
    prod: {
        baseApi: 'http://ceshi13.dishait.cn',
        mockApi: 'https://www.fastmock.site/mock/1ac7da2fb78f6ad7939c6bfbf4ebbecf/api'
    }
}
export default {
    // 环境
    env,
    // 是否启动假数据
    mock: false,
    // 命名空间 storage
    namespace: 'shopManager',
    // 对应环境的配置
    ...EnvConfig[env]
}