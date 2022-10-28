import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Admin from '@/layout/Admin.vue'
const routes = [
    {
        name: 'Admin',
        path: '/',
        component: Admin,
        // 子路由
        children: [{
            path: '/home',
            component: Home,
            meta: {
                title: '后台首页'
            },
        }]
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

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router