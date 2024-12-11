import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getClientList(params: components['schemas']['SysClientBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysClientVo'][]>({
    url: '/system/client/list',
    params,
  });
}

export function getClientDetail(params?: string) {
  return request.get<null, components['schemas']['SysClientVo'][]>(
    {
      url: urlTypeHelper('/system/client/{id}', { id: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addClient(params: components['schemas']['SysClientBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/client',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function editClient(params: components['schemas']['SysClientBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/client',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function delClientByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/client/{ids}', { clientIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
