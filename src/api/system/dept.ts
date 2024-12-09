import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getDeptList(params: components['schemas']['SysDeptBo'] & components['schemas']['PageQuery']) {
  return request.get<components['schemas']['SysDeptVo'][], null, true>(
    {
      url: '/system/dept/list',
      params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function delDeptByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/dept/{deptId}', { deptIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
