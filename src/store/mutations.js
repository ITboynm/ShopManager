export default {
    // 设置用户信息
    SET_USERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    // 设置用户菜单
    SET_MENUS(state, menus) {
        state.menus = menus
    },
    // 设置用户权限列表
    SET_RULENAMES(state, ruleNames) {
        state.ruleNames = ruleNames
    },
    // 展开、收起侧边
    handleAsideWidth(state) {
        state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
    },
}