import { defineStore } from 'pinia';

import { getUserInfo, login as loginApi, LoginBody } from '@/api/auth/login';
import { usePermissionStore } from '@/store';
import { components } from '@/types/schema';

const InitUserInfo: components['schemas']['UserInfoVo'] = {
  user: {},
  permissions: [],
  roles: [],
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo.user, permissions: InitUserInfo.permissions, rules: InitUserInfo.roles },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: LoginBody) {
      const res = await loginApi(userInfo);
      this.token = res.access_token;
    },
    async getUserInfo() {
      const res = await getUserInfo();

      this.userInfo = {
        ...res.user,
        permissions: res.permissions,
        rules: res.roles,
      };
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token'],
  },
});
