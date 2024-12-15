import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';
import { components } from '@/types/schema';

export const ROW_KEY = 'menuId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysMenuBo'] = {
  menuName: undefined,
  orderNum: 0,
  menuType: 'M',
  single: '0',
};

export const FIELDS = [
  'menuName',
  'orderNum',
  'path',
  'component',
  'isFrame',
  'isCache',
  'menuType',
  'visible',
  'status',
  'perms',
  'icon',
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
  { title: '是否为外链', colKey: 'isFrame' },
  { title: '是否缓存', colKey: 'isCache' },
  { title: '菜单类型', colKey: 'menuType' },
  { title: '显示状态', colKey: 'visible' },
  { title: '菜单状态', colKey: 'status' },
  { title: '权限标识', colKey: 'perms' },
  { title: '创建部门', colKey: 'createDept' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '子菜单', colKey: 'children' },
  {
    title: t('pages.listBase.operation'),
    align: 'left',
    fixed: 'right',
    width: 200,
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

export const RULES: FormRules<components['schemas']['SysMenuBo']> = {
  menuName: [{ required: true, message: '请输入菜单名称', type: 'error' }],
  orderNum: [{ required: true, message: '请输入显示顺序', type: 'error' }],
  menuType: [{ required: true, message: '请选择菜单类型', type: 'error' }],
  status: [{ required: true, message: '请选择菜单状态', type: 'error' }],
};
