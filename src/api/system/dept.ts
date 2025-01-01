import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getDeptList(params?: components['schemas']['SysDeptBo'] & components['schemas']['PageQuery']) {
  return request.get<
    (components['schemas']['SysDeptVo'] & { children: components['schemas']['SysDeptVo'] })[],
    null,
    true
  >(
    {
      url: '/system/dept/list',
      params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getDeptListExcludeDeptId(params: string) {
  return request.get<
    (components['schemas']['SysDeptVo'] & { children: components['schemas']['SysDeptVo'] })[],
    null,
    true
  >(
    {
      url: urlTypeHelper('/system/dept/list/exclude/{deptId}', { deptId: params }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getDeptDetail(params?: string) {
  return request.get<
    (components['schemas']['SysDeptVo'] & { children: components['schemas']['SysDeptVo'] })[],
    null,
    true
  >(
    {
      url: urlTypeHelper('/system/dept/{deptId}', { deptId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getDeptTreeByRoleId(params: string) {
  return request.get<
    {
      checkedKeys: string[];
      depts: components['schemas']['TreeLong'][];
    },
    null,
    true
  >(
    {
      url: urlTypeHelper('/system/role/deptTree/{roleId}', { roleId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addDept(params: components['schemas']['SysDeptBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/dept',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function editDept(params: components['schemas']['SysDeptBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/dept',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function delDeptById(params: string) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/dept/{deptId}', { deptId: params }),
    },
    {
      isTransformResponse: true,
    },
  );
}
