import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';
import { components } from '@/types/schema';

export const ROW_KEY = 'postId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysPostBo'] = {
  deptId: undefined,
  postCode: undefined,
  postName: undefined,
  postSort: undefined,
};

export const FIELDS = [
  'postId',
  'deptId',
  'postCode',
  'postName',
  'postCategory',
  'postSort',
  'status',
  'remark',
  'createTime',
  'deptName',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '岗位ID', colKey: 'postId' },
  { title: '部门id', colKey: 'deptId' },
  { title: '岗位编码', colKey: 'postCode' },
  { title: '岗位名称', colKey: 'postName' },
  { title: '岗位类别编码', colKey: 'postCategory' },
  { title: '显示顺序', colKey: 'postSort' },
  { title: '状态（0正常 1停用）', colKey: 'status' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '部门名', colKey: 'deptName' },
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

export const RULES: FormRules<components['schemas']['SysPostBo']> = {
  deptId: [{ required: true, message: '请输入部门 id（单部门）', type: 'error' }],
  postCode: [{ required: true, message: '请输入岗位编码', type: 'error' }],
  postName: [{ required: true, message: '请输入岗位名称', type: 'error' }],
  postSort: [{ required: true, message: '请输入显示顺序', type: 'error' }],
};
