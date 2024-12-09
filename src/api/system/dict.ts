import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getDictTypeList(params: components['schemas']['SysDictTypeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysDictTypeVo'][]>({
    url: '/system/dict/type/list',
    params,
  });
}

export function getDictDataByType(params: string) {
  return request.get<components['schemas']['SysDictDataVo'][], null, true>(
    {
      url: urlTypeHelper('/system/dict/data/type/{dictType}', { dictType: params }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function delDictTypeByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/dict/type/{dictIds}', { dictIds: params.join(',') }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getDictOptions(dictTypes: string[]) {
  const dicts = {} as Recordable<components['schemas']['SysDictDataVo'][]>;
  return Promise.all(dictTypes.map((dictType) => getDictDataByType(dictType))).then((res) => {
    res.forEach((item, index) => {
      dicts[dictTypes[index]] = item;
    });
    return dicts;
  });
}
