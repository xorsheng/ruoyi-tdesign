import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getDictTypeList(params: components['schemas']['SysDictTypeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysDictTypeVo'][]>({
    url: '/system/dict/type/list',
    params,
  });
}
