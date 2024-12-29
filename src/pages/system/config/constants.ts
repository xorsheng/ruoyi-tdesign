import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'configId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysConfigBo'] = {
  configName: undefined,
  configKey: undefined,
  configValue: undefined,
};

export const FIELDS = ['configId', 'configName', 'configKey', 'configValue', 'configType', 'remark', 'createTime'];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '参数主键', colKey: 'configId' },
  { title: '参数名称', colKey: 'configName' },
  { title: '参数键名', colKey: 'configKey' },
  { title: '参数键值', colKey: 'configValue' },
  { title: '系统内置（Y是 N否）', colKey: 'configType' },
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

export const RULES: FormRules<components['schemas']['SysConfigBo']> = {
  configName: [{ required: true, message: '请输入参数名称', type: 'error' }],
  configKey: [{ required: true, message: '请输入参数键名', type: 'error' }],
  configValue: [{ required: true, message: '请输入参数键值', type: 'error' }],
};
