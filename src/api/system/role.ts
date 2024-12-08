import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getRoleList(params: components['schemas']['SysRoleBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysRoleVo'][]>({
    url: '/system/role/list',
    params,
  });
}
