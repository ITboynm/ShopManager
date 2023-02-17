/**
 * 默认路由
 */
import Admin from "@/layout/Admin.vue";
const routes = [
    {
        name: 'Admin',
        path: '/',
        component: Admin,
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
    }
]

export default routes