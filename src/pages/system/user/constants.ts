import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';
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
  { title: '用户ID', colKey: 'userId' },
  { title: '租户ID', colKey: 'tenantId' },
  { title: '部门ID', colKey: 'deptId' },
  { title: '用户账号', colKey: 'userName' },
  { title: '用户昵称', colKey: 'nickName' },
  { title: '用户类型（sys_user系统用户）', colKey: 'userType' },
  { title: '用户邮箱', colKey: 'email' },
  { title: '手机号码', colKey: 'phonenumber' },
  { title: '用户性别（0男 1女 2未知）', colKey: 'sex' },
  { title: '头像地址', colKey: 'avatar' },
  { title: '帐号状态（0正常 1停用）', colKey: 'status' },
  { title: '最后登录IP', colKey: 'loginIp' },
  { title: '最后登录时间', colKey: 'loginDate' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '部门名', colKey: 'deptName' },
  { title: '角色对象', colKey: 'roles' },
  { title: '角色组', colKey: 'roleIds' },
  { title: '岗位组', colKey: 'postIds' },
  { title: '数据权限 当前角色ID', colKey: 'roleId' },
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

export const RULES: FormRules<components['schemas']['SysUserBo']> = {
  userName: [{ required: true, message: '请输入用户账号', type: 'error' }],
  nickName: [{ required: true, message: '请输入用户昵称', type: 'error' }],
};
