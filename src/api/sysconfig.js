import request from "@/utils/request";
import config from "@/config"
// 系统配置接口
export default {

    // 	获取原有系统设置
    getSysconfig(params) {
        return request({
            url: `/sysconfig`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 修改系统配置
    updateSysconfig(params) {
        return request({
            url: `/sysconfig`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 上传文件
    sysconfigUpload(params) {
        return request({
            url: `/sysconfig/upload`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    uploadAction: `${config.baseApi}/sysconfig/upload`
};
