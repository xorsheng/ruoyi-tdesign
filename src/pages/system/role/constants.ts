import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'roleId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysRoleBo'] = {
  roleName: undefined,
  roleKey: undefined,
  roleSort: undefined,
};

export const FIELDS = ['roleName', 'roleKey', 'roleSort', 'dataScope', 'status', 'createTime', 'flag', 'superAdmin'];

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
  { title: '角色状态', colKey: 'status' },
  { title: '备注', colKey: 'remark' },
  { title: '创建时间', colKey: 'createTime' },
  { title: '用户是否存在此角色标识 默认不存在', colKey: 'flag' },
  { title: '超级管理员', colKey: 'superAdmin' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 220,
    colKey: 'op',
  },
];

export const USER_COLUMNS: PrimaryTableCol<TableRowData>[] = [
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
  { title: '帐号状态', colKey: 'status' },
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
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 220,
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

export const RULES: FormRules<components['schemas']['SysRoleBo']> = {
  roleName: [{ required: true, message: '请输入角色名称', type: 'error' }],
  roleKey: [{ required: true, message: '请输入角色权限字符串', type: 'error' }],
  roleSort: [{ required: true, message: '请输入显示顺序', type: 'error' }],
  dataScope: [{ required: true, message: '请选择数据范围', type: 'error' }],
  status: [{ required: true, message: '请选择角色状态', type: 'error' }],
};
