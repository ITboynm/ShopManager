export default {
    // 记录用户信息
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;
    },
    // 展开、收起侧边
    handleAsideWidth(state) {
        state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
    }
}