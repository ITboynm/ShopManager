import request from "@/utils/request";
import axios from "axios";
import { queryParams } from '@/utils/utils'
// 订单接口
export default {
    // 查看物流信息
    getShipInfo(id, params) {
        return request({
            url: `/order/${id}/get_ship_info`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 	快递公司列表
    getExpressCompany(id, params) {
        return request({
            url: `/express_company/${id}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
    // 	导出订单
    excelExportOrder(params) {
        const r = queryParams(params)
        return request({
            url: `/order/excelexport${r}`,
            method: "post",
            data: {},
            responseType: 'blob'
            // mock: false
        });
    },
    // 同意/拒绝退款
    handleRefund(id, params) {
        return request({
            url: `/order/${id}/handle_refund`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 订单发货
    orderShip(id, params) {
        return request({
            url: `/order/${id}/ship`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 批量删除订单
    deleteOrders(ids) {
        const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
        return request({
            url: `/order/delete_all`,
            method: "post",
            data: params,
            // mock: false
        });
    },
    // 订单列表
    getOrders({ page, limit } = { page: 1, limit: 10 }, params) {
        return request({
            url: `/order/${page}?limit=${limit}`,
            method: "get",
            data: params,
            // mock: false
        });
    },
};
