import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getClientList(params: components['schemas']['SysClientBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysClientVo'][]>({
    url: '/system/client/list',
    params,
  });
}
