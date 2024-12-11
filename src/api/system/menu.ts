import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getMenuList(params?: components['schemas']['SysMenuBo'] & components['schemas']['PageQuery']) {
  return request.get<components['schemas']['SysMenuVo'][], null, true>(
    {
      url: '/system/menu/list',
      params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getMenuDetail(params?: string) {
  return request.get<components['schemas']['SysMenuVo'][], null, true>(
    {
      url: urlTypeHelper('/system/menu/{menuId}', { menuId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getMenuTreeSelectOptions() {
  return request.get<components['schemas']['TreeLong'][], null, true>(
    {
      url: '/system/menu/treeselect',
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getMenuTreeSelectOptionsByRoleId(params: string) {
  return request.get<components['schemas']['MenuTreeSelectVo'], null, true>(
    {
      url: urlTypeHelper('/system/menu/roleMenuTreeselect/{roleId}', { roleId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addMenu(params: components['schemas']['SysMenuBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/menu',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function editMenu(params: components['schemas']['SysMenuBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/menu',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function delMenuByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/menu/{menuId}', { menuIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
