import { components } from '@/types/schema';
import { request } from '@/utils/request';

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
