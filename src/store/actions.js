import adminApi from "@/api/admin";
import operateToken from "@/utils/auth";
import { useCookies } from "@vueuse/integrations/useCookies";
const cookies = useCookies(["locale"]);
export default {
  // 登录
  async login({ dispatch, commit }, params) {
    try {
      let token = await adminApi.login(params);
      operateToken.setToken(token);
      const userInfo = await dispatch("getUserInfo");
      return Promise.resolve({ token, userInfo });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 退出登录
  async logout({ commit }) {
    function out() {
      // 移除cookie里面的token
      operateToken.removeToken();
      cookies.remove("tabList");
      // 清除用户状态
      commit("SET_USERINFO", "");
    }
    try {
      let res = await adminApi.logout();
      out();
      return Promise.resolve(res);
    } catch (error) {
      out();
      return Promise.reject(error);
    }
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const userInfo = await adminApi.getUserInfo();
      commit("SET_USERINFO", userInfo);
      commit("SET_MENUS", userInfo.menus);
      commit("SET_RULENAMES", userInfo.ruleNames);
      return Promise.resolve(userInfo);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
