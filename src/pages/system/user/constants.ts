import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'userId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysUserBo'] = {
  userName: undefined,
  nickName: undefined,
  roleIds: [],
  postIds: [],
};

export const FIELDS = [
  'userName',
  'nickName',
  'userType',
  'email',
  'phonenumber',
  'sex',
  'status',
  'loginIp',
  'loginDate',
  'createTime',
  'deptName',
];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '用户ID', colKey: 'userId' },
  { title: '部门名', colKey: 'deptName' },
  { title: '用户账号', colKey: 'userName' },
  { title: '用户昵称', colKey: 'nickName' },
  { title: '用户类型', colKey: 'userType' },
  { title: '用户邮箱', colKey: 'email' },
  { title: '手机号码', colKey: 'phonenumber' },
  { title: '用户性别', colKey: 'sex' },
  { title: '头像地址', colKey: 'avatar' },
  { title: '帐号状态', colKey: 'status' },
  { title: '最后登录IP', colKey: 'loginIp' },
  { title: '最后登录时间', colKey: 'loginDate' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '角色对象', colKey: 'roles' },
  { title: '角色组', colKey: 'roleIds' },
  { title: '岗位组', colKey: 'postIds' },
  { title: '数据权限 当前角色ID', colKey: 'roleId' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 220,
    colKey: 'op',
  },
];

export const ROLES_COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '角色ID', colKey: 'roleId' },
  { title: '角色名称', colKey: 'roleName' },
  { title: '角色权限字符串', colKey: 'roleKey' },
  { title: '显示顺序', colKey: 'roleSort' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '用户是否存在此角色标识', colKey: 'flag' },
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

export const RULES: FormRules<components['schemas']['SysUserBo']> = {
  userName: [{ required: true, message: '请输入用户账号', type: 'error' }],
  nickName: [{ required: true, message: '请输入用户昵称', type: 'error' }],
};
