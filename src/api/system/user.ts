import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getUserList(params: components['schemas']['SysUserBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysUserVo'][]>({
    url: '/system/user/list',
    params,
  });
}
export function getUserListByDeptId(params: string) {
  return request.get<components['schemas']['SysUserVo'][], null, true>(
    {
      url: urlTypeHelper('/system/user/list/dept/{deptId}', { deptId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}
export function getUserDetail(params?: string) {
  return request.get<components['schemas']['SysUserInfoVo'], null, true>(
    {
      url: urlTypeHelper('/system/user/{userId}', { userId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addUser(params: components['schemas']['SysUserBo']) {
  return request.post<null, components['schemas']['SysUserVo'][]>({
    url: '/system/user',
    data: params,
  });
}

export function editUser(params: components['schemas']['SysUserBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/user',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getDeptTree() {
  return request.get<components['schemas']['TreeLong'][], null, true>(
    {
      url: '/system/user/deptTree',
    },
    {
      isTransformResponse: true,
    },
  );
}
export function delUserByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/user/{userIds}', { userIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getImportTemplate(params?: string) {
  return request.download({
    url: '/system/user/importTemplate',
    fileName: params,
  });
}
