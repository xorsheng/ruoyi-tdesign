import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getNoticeList(params: components['schemas']['SysNoticeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysNoticeVo'][]>({
    url: '/system/notice/list',
    params,
  });
}

export function delNoticeByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/notice/{noticeIds}', { noticeIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
