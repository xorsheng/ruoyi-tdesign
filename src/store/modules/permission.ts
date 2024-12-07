import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';

import { getRouters } from '@/api/auth/login';
import { RouteItem } from '@/api/model/permissionModel';
import router, { fixedRouterList, homepageRouterList } from '@/router';
import { store } from '@/store';
import { transformObjectToRoute } from '@/utils/route';
import { treeMap } from '@/utils/tree';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
    asyncRoutes: [],
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes;

      // 在菜单展示全部路由
      this.routers = [...homepageRouterList, ...accessedRouters, ...fixedRouterList];
      // 在菜单只展示动态路由和首页
      // this.routers = [...homepageRouterList, ...accessedRouters];
      // 在菜单只展示动态路由
      // this.routers = [...accessedRouters];
    },
    async buildAsyncRoutes() {
      try {
        // 发起菜单权限请求 获取菜单列表
        const routers = await getRouters();
        const asyncRoutes = treeMap(routers, (item) => {
          // 如果 redirect 属性存在，且 === 'noRedirect'，则移除redirect属性
          if (item.redirect === 'noRedirect') {
            delete item.redirect;
          }
          if (item.component.includes('/')) {
            item.component = `/${item.component}`;
          }
          if (item.component.toUpperCase() === 'LAYOUT') {
            item.component = 'LAYOUT';
          }
          if (item.path.includes('http')) {
            item.path = '/frame';
            item.meta.frameSrc = item.path;
          }
          const { path, component, name, meta } = item;
          return {
            path,
            component,
            name,
            meta,
          };
        });
        this.asyncRoutes = transformObjectToRoute(asyncRoutes as Array<RouteItem>);
        await this.initRoutes();
        return this.asyncRoutes;
      } catch (error) {
        console.error(error);
        throw new Error("Can't build routes");
      }
    },
    async restoreRoutes() {
      // 不需要在此额外调用initRoutes更新侧边导肮内容，在登录后asyncRoutes为空会调用
      this.asyncRoutes.forEach((item: RouteRecordRaw) => {
        if (item.name) {
          router.removeRoute(item.name);
        }
      });
      this.asyncRoutes = [];
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
