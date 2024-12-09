import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getConfigList(params: components['schemas']['SysConfigBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysConfigVo'][]>({
    url: '/system/config/list',
    params,
  });
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
