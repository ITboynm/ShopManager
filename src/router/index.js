import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Admin from '@/layout/Admin.vue'

/**
 * 默认路由
 */
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

/** 
 * 动态路由，用于匹配菜单，动态添加路由
 */
const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: Home,
        meta: {
            title: '后台首页'
        }
    },
    {
        path: '/goods/list',
        name: '/goods/list',
        component: () => import(/* webpackChunkName: "GoodList" */ '@/views/goods/List.vue'),
        meta: {
            title: '商品管理'
        }
    },
    {
        path: '/category/list',
        name: '/category/list',
        component: () => import(/* webpackChunkName: "CategoryList" */ '@/views/category/List.vue'),
        meta: {
            title: '分类管理'
        }
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态添加路由的方法
export function addRoutes(menus) {
    // 是否有新路由
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            // 匹配菜单
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            // 判断路由项已经匹配上且项目中含有这个路由
            if (item && !router.hasRoute(item.path)) {
                router.addRoute('Admin', item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutesByMenus(e.child)
            }
        })
    }
    findAndAddRoutesByMenus(menus)
    return hasNewRoutes
}