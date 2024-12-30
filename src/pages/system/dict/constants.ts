import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'dictId';
export const DICT_DATA_ROW_KEY = 'dictCode';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysDictTypeBo'] = {
  dictName: undefined,
  dictType: undefined,
};
export const DICT_DATA_INITIAL_DATA: components['schemas']['SysDictDataBo'] = {
  dictLabel: undefined,
  dictValue: undefined,
  dictType: undefined,
};

export const FIELDS = ['dictId', 'dictName', 'dictType', 'remark', 'createTime'];
export const DICT_DATA_FIELDS = ['dictCode', 'dictLabel', 'dictValue', 'dictSort', 'status', 'remark', 'createTime'];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '字典主键', colKey: 'dictId' },
  { title: '字典名称', colKey: 'dictName' },
  { title: '字典类型', colKey: 'dictType' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];

export const DICT_DATA_COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '字典编码', colKey: 'dictCode' },
  { title: '字典标签', colKey: 'dictLabel' },
  { title: '字典键值', colKey: 'dictValue' },
  { title: '字典排序', colKey: 'dictSort' },
  { title: '状态', colKey: 'status' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];

export const COLUMNS_CONTROLLER_CONFIG: TableColumnController = {
  hideTriggerButton: true,

  fields: FIELDS,

  dialogProps: {
    preventScrollThrough: true,
  },

  groupColumns: [
    {
      label: '指标维度',
      value: 'index',
      columns: FIELDS,
    },
  ],
};

export const DICT_DATA_COLUMNS_CONTROLLER_CONFIG: TableColumnController = {
  hideTriggerButton: true,

  fields: DICT_DATA_FIELDS,

  dialogProps: {
    preventScrollThrough: true,
  },

  groupColumns: [
    {
      label: '指标维度',
      value: 'index',
      columns: DICT_DATA_FIELDS,
    },
  ],
};

export const RULES: FormRules<components['schemas']['SysDictTypeBo']> = {
  dictName: [{ required: true, message: '请输入字典名称', type: 'error' }],
  dictType: [{ required: true, message: '请输入字典类型', type: 'error' }],
};

export const DICT_DATA_RULES: FormRules<components['schemas']['SysDictDataBo']> = {
  dictLabel: [{ required: true, message: '请输入字典标签', type: 'error' }],
  dictValue: [{ required: true, message: '请输入字典键值', type: 'error' }],
  dictType: [{ required: true, message: '请输入字典类型', type: 'error' }],
  dictSort: [{ required: true, message: '请输入字典排序', type: 'error' }],
};
