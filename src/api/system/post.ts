import { components } from '@/types/schema';
import { request } from '@/utils/request';

export function getPostList(params: components['schemas']['SysPostBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysPostVo'][]>({
    url: '/system/post/list',
    params,
  });
}

export function delPostByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: '/system/post/{postIds}'.replace('{postIds}', params.join(',')),
    },
    {
      isTransformResponse: true,
    },
  );
}
