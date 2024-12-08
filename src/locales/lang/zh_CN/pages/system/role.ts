export default {
  columns: {
    roleId: '角色ID',
    roleName: '角色名称',
    roleKey: '角色权限字符串',
    roleSort: '显示顺序',
    dataScope: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
    menuCheckStrictly: '菜单树选择项是否关联显示',
    deptCheckStrictly: '部门树选择项是否关联显示',
    status: '角色状态（0正常 1停用）',
    remark: '备注',
    createTime: '创建时间',
    flag: '用户是否存在此角色标识 默认不存在',
    superAdmin: '是否为超级管理员',
  },
};
