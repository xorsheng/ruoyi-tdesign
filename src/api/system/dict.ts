import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getDictTypeList(params: components['schemas']['SysDictTypeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysDictTypeVo'][]>({
    url: '/system/dict/type/list',
    params,
  });
}

export function delDictTypeByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/dict/{dictIds}'.replace('{dictIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
