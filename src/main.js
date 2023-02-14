import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'virtual:windi.css'
import '@/assets/style/reset.css'
import 'element-plus/dist/index.css'
import "nprogress/nprogress.css"
import {router} from './router'
import store from './store'
import App from './App.vue'
import mitt from 'mitt'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './permission'
import permission from '@/directives/permission'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// vue3.x的全局实例，要挂载在config.globalProperties上
app.config.globalProperties.$EventBus = new mitt()
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(permission)
app.mount('#app')
