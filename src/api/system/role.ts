import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getRoleList(params: components['schemas']['SysRoleBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysRoleVo'][]>({
    url: '/system/role/list',
    params,
  });
}

export function delRoleByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/role/{roleIds}', { roleIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
