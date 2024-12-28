import { components } from '@/types/schema';
import { request } from '@/utils/request';
import { urlTypeHelper } from '@/utils/request/Axios';

export function getDictTypeList(params: components['schemas']['SysDictTypeBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysDictTypeVo'][]>({
    url: '/system/dict/type/list',
    params,
  });
}

export function getDictDataList(params: components['schemas']['SysDictDataBo'] & components['schemas']['PageQuery']) {
  return request.get<null, components['schemas']['SysDictDataVo'][]>({
    url: '/system/dict/data/list',
    params,
  });
}

export function getDictTypeDetail(params?: string) {
  return request.get<components['schemas']['SysDictTypeVo'], null, true>(
    {
      url: urlTypeHelper('/system/dict/type/{dictId}', { dictId: params ?? '' }),
    },
    {
      isTransformResponse: true,
    },
  );
}

export function addDictType(params: components['schemas']['SysDictTypeBo']) {
  return request.post<null, null, true>(
    {
      url: '/system/dict/type',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
}
export function editDictType(params: components['schemas']['SysDictTypeBo']) {
  return request.put<null, null, true>(
    {
      url: '/system/dict/type',
      data: params,
    },
    {
      isTransformResponse: true,
    },
  );
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

export function delDictDataByIds(params: number[]) {
  return request.delete<null, null, true>(
    {
      url: urlTypeHelper('/system/dict/data/{dictCodes}', { dictCodes: params.join(',') }),
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
