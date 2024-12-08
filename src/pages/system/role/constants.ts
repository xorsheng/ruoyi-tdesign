import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';

export interface FormData {
  name: string;
  status: string;
  description: string;
  type: string;
  mark: string;
  amount: number;
}

export const ROW_KEY = 'roleId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
};
export const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
};

export const FIELDS = [
  'roleId',
  'roleName',
  'roleKey',
  'roleSort',
  'dataScope',
  'menuCheckStrictly',
  'deptCheckStrictly',
  'status',
  'remark',
  'createTime',
  'flag',
  'superAdmin',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '角色ID', colKey: 'roleId' },
  { title: '角色名称', colKey: 'roleName' },
  { title: '角色权限字符串', colKey: 'roleKey' },
  { title: '显示顺序', colKey: 'roleSort' },
  {
    title: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
    colKey: 'dataScope',
  },
  { title: '菜单树选择项是否关联显示', colKey: 'menuCheckStrictly' },
  { title: '部门树选择项是否关联显示', colKey: 'deptCheckStrictly' },
  { title: '角色状态（0正常 1停用）', colKey: 'status' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '用户是否存在此角色标识 默认不存在', colKey: 'flag' },
  { title: '超级管理员', colKey: 'superAdmin' },
  {
    title: t('pages.listBase.operation'),
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

export const RULES: FormRules<FormData> = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
};
