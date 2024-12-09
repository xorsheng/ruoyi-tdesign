import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getMenuList(params: components['schemas']['SysMenuBo'] & components['schemas']['PageQuery']) {
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
