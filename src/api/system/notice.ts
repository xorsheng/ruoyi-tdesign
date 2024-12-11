import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getNoticeList(params: components['schemas']['SysNoticeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysNoticeVo'][]>({
    url: '/system/notice/list',
    params,
  });
}

export function addNotice(params: components['schemas']['SysNoticeBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/notice',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function editNotice(params: components['schemas']['SysNoticeBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/notice',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
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
