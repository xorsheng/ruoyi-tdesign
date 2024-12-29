import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getConfigList(params: components['schemas']['SysConfigBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysConfigVo'][]>({
    url: '/system/config/list',
    params,
  });
}

export function getConfigDetail(params?: string) {
  return request.get<null, components['schemas']['SysConfigVo'][]>(
    {
      url: urlTypeHelper('/system/config/{configId}', { configId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addConfig(params: components['schemas']['SysConfigBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/config',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function editConfig(params: components['schemas']['SysConfigBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/config',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function delConfigByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/config/{configIds}', { configIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getExportData(params?: components['schemas']['SysConfigBo']) {
  return request.download({
    url: '/system/config/export',
    data: {
      hack: '',
    },
    params,
  });
}
