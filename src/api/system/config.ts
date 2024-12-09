import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getConfigList(params: components['schemas']['SysConfigBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysConfigVo'][]>({
    url: '/system/config/list',
    params,
  });
}

export function delConfigByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/config/{configIds}'.replace('{configIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
