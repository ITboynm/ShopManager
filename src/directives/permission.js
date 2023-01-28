import store from "@/store";

const hasPermission = (value, el = false) => {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如v-permission="['getStatistics3,GET']"`);
  }
//   判断是否有权限
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
};
// 权限操作自定义指令
export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        hasPermission(binding.value, el);
      },
    });
  },
};
