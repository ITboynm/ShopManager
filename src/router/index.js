import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/routes";
import asyncRoutes from "@/router/asyncRoutes";

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态添加路由的方法
export function addRoutes(menus) {
  // 是否有新路由
  let hasNewRoutes = false;
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      // 匹配菜单
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      // 判断路由项已经匹配上且项目中含有这个路由
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("Admin", item);
        hasNewRoutes = true;
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child);
      }
    });
  };
  findAndAddRoutesByMenus(menus);
  return hasNewRoutes;
}
