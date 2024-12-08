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

export const ROW_KEY = 'menuId';
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
  'menuId',
  'menuName',
  'parentId',
  'orderNum',
  'path',
  'component',
  'queryParam',
  'isFrame',
  'isCache',
  'menuType',
  'visible',
  'status',
  'perms',
  'icon',
  'createDept',
  'remark',
  'createTime',
  'children',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '菜单ID', colKey: 'menuId' },
  { title: '菜单图标', colKey: 'icon' },
  { title: '菜单名称', colKey: 'menuName' },
  { title: '父菜单ID', colKey: 'parentId' },
  { title: '显示顺序', colKey: 'orderNum' },
  { title: '路由地址', colKey: 'path' },
  { title: '组件路径', colKey: 'component' },
  { title: '路由参数', colKey: 'queryParam' },
  { title: '是否为外链（0是 1否）', colKey: 'isFrame' },
  { title: '是否缓存（0缓存 1不缓存）', colKey: 'isCache' },
  { title: '菜单类型（M目录 C菜单 F按钮）', colKey: 'menuType' },
  { title: '显示状态（0显示 1隐藏）', colKey: 'visible' },
  { title: '菜单状态（0正常 1停用）', colKey: 'status' },
  { title: '权限标识', colKey: 'perms' },
  { title: '创建部门', colKey: 'createDept' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '子菜单', colKey: 'children' },
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
