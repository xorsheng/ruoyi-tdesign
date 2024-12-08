import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getLoginInfoList(
  params: components['schemas']['SysLogininforBo'] & components['schemas']['PageQuery'],
) {
  return request.get<null, components['schemas']['SysLogininforVo'][]>({
    url: '/monitor/logininfor/list',
    params,
  });
}
