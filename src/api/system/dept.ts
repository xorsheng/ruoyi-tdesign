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
