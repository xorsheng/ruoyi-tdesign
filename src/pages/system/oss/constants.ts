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

export const ROW_KEY = 'userId';
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
  'userId',
  'tenantId',
  'deptId',
  'userName',
  'nickName',
  'userType',
  'email',
  'phonenumber',
  'sex',
  'avatar',
  'status',
  'loginIp',
  'loginDate',
  'remark',
  'createTime',
  'deptName',
  'roles',
  'roleIds',
  'postIds',
  'roleId',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '对象存储主键', colKey: 'ossId' },
  { title: '文件名', colKey: 'fileName' },
  { title: '原名', colKey: 'originalName' },
  { title: '文件后缀名', colKey: 'fileSuffix' },
  { title: 'URL地址', colKey: 'url' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '上传人', colKey: 'createBy' },
  { title: '上传人名称', colKey: 'createByName' },
  { title: '服务商', colKey: 'service' },
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
