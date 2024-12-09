import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getNoticeList(params: components['schemas']['SysNoticeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysNoticeVo'][]>({
    url: '/system/notice/list',
    params,
  });
}

export function delNoticeByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/notice/{noticeIds}'.replace('{noticeIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
