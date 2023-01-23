import { createStore } from "vuex";
import mutations from './mutations'
import actions from './actions'
import { storage } from "../utils/storage";
const state = {
    // 用户信息
    userInfo: storage.getItem('userInfo') || '',
    // 侧边宽度
    asideWidth: '250px'
}
export default createStore({
    state,
    mutations,
    actions
})