import { FormRules, PrimaryTableCol, TableColumnController, TableRowData } from 'tdesign-vue-next';

import { components } from '@/types/schema';

export const ROW_KEY = 'noticeId';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
  pageSize: 10,
  pageNum: 1,
  current: 1,
};
export const INITIAL_DATA: components['schemas']['SysNoticeBo'] = {
  noticeTitle: undefined,
};

export const FIELDS = ['noticeTitle', 'noticeType', 'status', 'createByName', 'createTime'];

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  { title: '公告ID', colKey: 'noticeId' },
  { title: '公告标题', colKey: 'noticeTitle' },
  { title: '公告类型（1通知 2公告）', colKey: 'noticeType' },
  { title: '公告内容', colKey: 'noticeContent' },
  { title: '公告状态（0正常 1关闭）', colKey: 'status' },
  { title: '备注', colKey: 'remark' },
  { title: '创建者', colKey: 'createBy' },
  { title: '创建人名称', colKey: 'createByName' },
  { title: '创建时间', colKey: 'createTime' },
  {
    title: '操作',
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
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

export const RULES: FormRules<components['schemas']['SysNoticeBo']> = {
  noticeTitle: [{ required: true, message: '请输入公告标题', type: 'error' }],
};
