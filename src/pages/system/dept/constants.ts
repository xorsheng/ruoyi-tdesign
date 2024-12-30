import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'deptId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysDeptBo'] = {
  deptName: undefined,
  orderNum: 0,
};

export const FIELDS = [
  'deptId',
  'parentName',
  'ancestors',
  'deptName',
  'deptCategory',
  'orderNum',
  'leaderName',
  'phone',
  'email',
  'status',
  'createTime',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '部门id', colKey: 'deptId' },
  { title: '父部门id', colKey: 'parentId' },
  { title: '父部门名称', colKey: 'parentName' },
  { title: '祖级列表', colKey: 'ancestors' },
  { title: '部门名称', colKey: 'deptName' },
  { title: '部门类别编码', colKey: 'deptCategory' },
  { title: '显示顺序', colKey: 'orderNum' },
  { title: '负责人ID', colKey: 'leader' },
  { title: '负责人', colKey: 'leaderName' },
  { title: '联系电话', colKey: 'phone' },
  { title: '邮箱', colKey: 'email' },
  { title: '部门状态', colKey: 'status' },
  { title: '创建时间', colKey: 'createTime' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 200,
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

export const RULES: FormRules<components['schemas']['SysDeptBo']> = {
  deptName: [{ required: true, message: '请输入部门名称', type: 'error' }],
  orderNum: [{ required: true, message: '请输入显示顺序', type: 'error' }],
};
