import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getNoticeList(params: components['schemas']['SysNoticeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysNoticeVo'][]>({
    url: '/system/notice/list',
    params,
  });
}
