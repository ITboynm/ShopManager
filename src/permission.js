import { router, addRoutes } from '@/router'
import operateToken from '@/utils/auth'
import { notification, showFullLoading, hideFullLoading } from '@/utils/utils'
import store from './store'
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // 显示loading
    showFullLoading()
    const token = operateToken.getToken()
    //没有登录，强制跳转回首页
    if (!token && to.path != '/login') {
        notification('请先登录', 'error')
        return next('/login')
    }

    // 防止重复登录
    if (token && to.path == '/login') {
        notification('请勿重复登录', 'error')
        return next({ path: from.path ? from.path : '/' })
    }

    // 如果用户登录了，自动获取用户信息，并存储在vuex中
    let hasNewRoutes = false
    if (token) {
        const userInfo = await store.dispatch('getUserInfo')
        // 动态添加路由
        hasNewRoutes = addRoutes(userInfo.menus)
    }
    // 设置页面标题
    document.title = to.meta.title ? to.meta.title : ''
    // 判断是否有新路由
    hasNewRoutes ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from, failure) => {
    hideFullLoading()
})