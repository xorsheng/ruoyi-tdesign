import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getOssList(params: components['schemas']['SysOssBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysOssVo'][]>({
    url: '/resource/oss/list',
    params,
  });
}

// export function addOss(params: components['schemas']['SysOssBo']) {
//   return request.post<null, null, true>(
//     {
//       url: '/system/oss',
//       data: params,
//     },
//     {
//       isTransformResponse: true,
//     },
//   );
// }
export function delOssByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/resource/oss/list', { ossIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}
