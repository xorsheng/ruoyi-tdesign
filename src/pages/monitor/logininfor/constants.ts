import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';

export const ROW_KEY = 'infoId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: FormData = {};

export const FIELDS = [
  'infoId',
  'tenantId',
  'userName',
  'clientKey',
  'deviceType',
  'status',
  'ipaddr',
  'loginLocation',
  'browser',
  'os',
  'msg',
  'loginTime',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '访问ID', colKey: 'infoId' },
  { title: '租户编号', colKey: 'tenantId' },
  { title: '用户账号', colKey: 'userName' },
  { title: '客户端', colKey: 'clientKey' },
  { title: '设备类型', colKey: 'deviceType' },
  { title: '登录状态（0成功 1失败）', colKey: 'status' },
  { title: '登录IP地址', colKey: 'ipaddr' },
  { title: '登录地点', colKey: 'loginLocation' },
  { title: '浏览器类型', colKey: 'browser' },
  { title: '操作系统', colKey: 'os' },
  { title: '提示消息', colKey: 'msg' },
  { title: '访问时间', colKey: 'loginTime' },
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
