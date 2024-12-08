import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getOperLogList(params: components['schemas']['SysOperLogBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysOperLogVo'][]>({
    url: '/monitor/operlog/list',
    params,
  });
}
