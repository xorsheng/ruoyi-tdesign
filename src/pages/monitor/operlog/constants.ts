import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';

export const ROW_KEY = 'operId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
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
  'operId',
  'tenantId',
  'title',
  'businessType',
  'businessTypes',
  'method',
  'requestMethod',
  'operatorType',
  'operName',
  'deptName',
  'operUrl',
  'operIp',
  'operLocation',
  'operParam',
  'jsonResult',
  'status',
  'errorMsg',
  'operTime',
  'costTime',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '日志主键', colKey: 'operId' },
  { title: '租户编号', colKey: 'tenantId' },
  { title: '模块标题', colKey: 'title' },
  { title: '业务类型（0其它 1新增 2修改 3删除）', colKey: 'businessType' },
  { title: '业务类型数组', colKey: 'businessTypes' },
  { title: '方法名称', colKey: 'method' },
  { title: '请求方式', colKey: 'requestMethod' },
  { title: '操作类别（0其它 1后台用户 2手机端用户）', colKey: 'operatorType' },
  { title: '操作人员', colKey: 'operName' },
  { title: '部门名称', colKey: 'deptName' },
  { title: '请求URL', colKey: 'operUrl' },
  { title: '主机地址', colKey: 'operIp' },
  { title: '操作地点', colKey: 'operLocation' },
  { title: '请求参数', colKey: 'operParam' },
  { title: '返回参数', colKey: 'jsonResult' },
  { title: '操作状态（0正常 1异常）', colKey: 'status' },
  { title: '错误消息', colKey: 'errorMsg' },
  { title: '操作时间', colKey: 'operTime' },
  { title: '消耗时间', colKey: 'costTime' },
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
