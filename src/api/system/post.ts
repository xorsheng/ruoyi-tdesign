import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getPostList(params: components['schemas']['SysPostBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysPostVo'][]>({
    url: '/system/post/list',
    params,
  });
}

export function addPost(params: components['schemas']['SysPostBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/post',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getPostOptions(params: { postIds: number[]; deptId: number } = { postIds: [], deptId: undefined }) {
  return request.get<components['schemas']['SysPostVo'][], null, true>(
    {
      url: '/system/post/optionselect',
      params,
    },
    {
      isTransformResponse: true,
    },
  );
}

export function delPostByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/post/{postIds}', { postIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
