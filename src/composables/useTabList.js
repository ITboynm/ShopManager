import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
export function useTabList() {
    const cookie = useCookies()
    const route = useRoute()
    const router = useRouter()
    // 选中的tab
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/',
        }
    ])

    // 初始化标签导航列表
    const initTabList = () => {
        let tbs = cookie.get('tabList')
        if (tbs) {
            tabList.value = tbs
        }
    }
    initTabList()
    // 切换tab栏事件
    const changeTab = (t) => {
        activeTab.value = t
        router.push(t)
    }

    // 删除tab栏事件
    const removeTab = (t) => {
        let tabs = tabList.value
        let curTab = activeTab.value
        if (curTab == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    // 检索出后一个或者前一个tab
                    const nextTabs = tabs[index + 1] || tabs[index - 1]
                    if (nextTabs) {
                        curTab = nextTabs.path
                    }
                }
            })
        }
        activeTab.value = curTab
        // 过滤器
        tabList.value = tabList.value.filter(tab => tab.path != t)
        cookie.set('tabList', tabList.value)
    }
    /**
     * 自动添加tab栏事件
     * params {Object} - title 路由名字 path 路由路径
     * 
    */
    const addTab = (tab) => {
        // 判断tab栏列表里面是否包含传进来的tab
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        // 如若没有，就添加进去
        if (noTab) {
            tabList.value.push(tab)
        }
        // 持久化导航栏
        cookie.set('tabList', tabList.value)
    }

    // 下拉菜单事件
    const handleClose = (t) => {
        switch (t) {
            case 'clearAll':
                // 切换回首页
                activeTab.value = '/'
                // 过滤只剩下首页
                tabList.value = [
                    {
                        title: '后台首页',
                        path: '/',
                    }
                ]
                break;
            case 'clearOther':
                // 过滤只剩下首页与当前激活
                tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
                break;
            default:
                break
        }
        cookie.set('tabList', tabList.value)
    }
    // 监听路由变化
    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    return { activeTab, tabList, changeTab, removeTab, handleClose }
}