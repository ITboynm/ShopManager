import { createStore } from "vuex";
import mutations from './mutations'
import actions from './actions'
import { storage } from "../utils/storage";
const state = {
    userInfo: storage.getItem('userInfo') || ''
}
export default createStore({
    state,
    mutations,
    actions
})