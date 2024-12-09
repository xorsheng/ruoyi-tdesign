import { components } from '@/types/schema';
import { request } from '@/utils/request';

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
      url: '/system/dept/{deptIds}'.replace('{deptIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
