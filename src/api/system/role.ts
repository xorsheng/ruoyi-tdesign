import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getRoleList(params: components['schemas']['SysRoleBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysRoleVo'][]>({
    url: '/system/role/list',
    params,
  });
}

export function delRoleByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/role/{roleIds}'.replace('{roleIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
