import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getUserList(params: components['schemas']['SysUserBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysUserVo'][]>({
    url: '/system/user/list',
    params,
  });
}
