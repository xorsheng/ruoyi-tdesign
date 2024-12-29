import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'id';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysClientBo'] = {
  id: undefined,
  clientKey: undefined,
  clientSecret: undefined,
  grantTypeList: undefined,
};

export const FIELDS = [
  'clientId',
  'clientKey',
  'clientSecret',
  'grantTypeList',
  'deviceType',
  'activeTimeout',
  'timeout',
  'status',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: 'id', colKey: 'id' },
  { title: '客户端id', colKey: 'clientId' },
  { title: '客户端key', colKey: 'clientKey' },
  { title: '客户端秘钥', colKey: 'clientSecret' },
  { title: '授权类型', colKey: 'grantTypeList' },
  { title: '授权类型', colKey: 'grantType' },
  { title: '设备类型', colKey: 'deviceType' },
  { title: 'token活跃超时时间', colKey: 'activeTimeout' },
  { title: 'token固定超时时间', colKey: 'timeout' },
  { title: '状态', colKey: 'status' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];

export const COLUMNS_CONTROLLER_CONFIG: TableColumnController = {
  // 隐藏组件内部的 列配置按钮
  hideTriggerButton: true,
  // 允许哪些列参与显示-隐藏控制
  fields: FIELDS,
  // 透传弹框组件全部属性
  dialogProps: {
    preventScrollThrough: true,
  },
  // 数据字段分组显示
  groupColumns: [
    {
      label: '指标维度',
      value: 'index',
      columns: FIELDS,
    },
  ],
};

export const RULES: FormRules<components['schemas']['SysClientBo']> = {
  clientKey: [{ required: true, message: '请输入客户端 key', type: 'error' }],
  clientSecret: [{ required: true, message: '请输入客户端秘钥', type: 'error' }],
};
