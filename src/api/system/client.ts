import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getClientList(params: components['schemas']['SysClientBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysClientVo'][]>({
    url: '/system/client/list',
    params,
  });
}

export function delClientByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/client/{clientIds}'.replace('{clientIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
