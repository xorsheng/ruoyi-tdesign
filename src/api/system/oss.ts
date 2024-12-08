import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getOssList(params: components['schemas']['SysOssBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysOssVo'][]>({
    url: '/resource/oss/list',
    params,
  });
}
