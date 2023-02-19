/** 
 * 动态路由，用于匹配菜单，动态添加路由
 */
import Home from "@/views/Home.vue";
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
    },
    {
        path: '/user/list',
        name: '/user/list',
        component: () => import(/* webpackChunkName: "UserList" */ '@/views/user/List.vue'),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/order/list',
        name: '/order/list',
        component: () => import(/* webpackChunkName: "OrderList" */ '@/views/order/List.vue'),
        meta: {
            title: '订单管理'
        }
    },
    {
        path: '/comment/list',
        name: '/comment/list',
        component: () => import(/* webpackChunkName: "CommentList" */ '@/views/comment/List.vue'),
        meta: {
            title: '评价管理'
        }
    },
    {
        path: '/image/list',
        name: '/image/list',
        component: () => import(/* webpackChunkName: "ImageList" */ '@/views/image/List.vue'),
        meta: {
            title: '图库管理'
        }
    },
    {
        path: '/notice/list',
        name: '/notice/list',
        component: () => import(/* webpackChunkName: "NoticeList" */ '@/views/notice/List.vue'),
        meta: {
            title: '公告管理'
        }
    },
    {
        path: '/setting/base',
        name: '/setting/base',
        component: () => import(/* webpackChunkName: "SttingBase" */ '@/views/setting/Base.vue'),
        meta: {
            title: '配置'
        }
    },
    {
        path: '/coupon/list',
        name: '/coupon/list',
        component: () => import(/* webpackChunkName: "CouponList" */ '@/views/coupon/List.vue'),
        meta: {
            title: '优惠券管理'
        }
    },
    {
        path: '/manager/list',
        name: '/manager/list',
        component: () => import(/* webpackChunkName: "ManagerList" */ '@/views/manager/List.vue'),
        meta: {
            title: '管理员管理'
        }
    },
    {
        path: '/access/list',
        name: '/access/list',
        component: () => import(/* webpackChunkName: "AccessList" */ '@/views/access/List.vue'),
        meta: {
            title: '菜单权限管理'
        }
    },
    {
        path: '/role/list',
        name: '/role/list',
        component: () => import(/* webpackChunkName: "RoleList" */ '@/views/role/List.vue'),
        meta: {
            title: '角色管理'
        }
    }
]

export default asyncRoutes