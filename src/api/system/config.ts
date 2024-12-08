import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getConfigList(params: components['schemas']['SysConfigBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysConfigVo'][]>({
    url: '/system/config/list',
    params,
  });
}
