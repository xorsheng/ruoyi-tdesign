import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getRoleList(params: components['schemas']['SysRoleBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysRoleVo'][]>({
    url: '/system/role/list',
    params,
  });
}

export function getRoleDetail(params: string) {
  return request.get<components['schemas']['SysRoleVo'], null, true>(
    {
      url: urlTypeHelper('/system/role/{roleId}', { roleId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addRole(params: components['schemas']['SysRoleBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/role',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function editRole(params: components['schemas']['SysRoleBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/role',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
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
