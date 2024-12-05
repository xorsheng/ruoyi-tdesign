import { FormRules, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

import { t } from '@/locales';

export interface FormData {
  name: string;
  status: string;
  description: string;
  type: string;
  mark: string;
  amount: number;
}

export const ROW_KEY = 'index';
export const INIT_PAGE = {
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
};
export const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
};
export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.listBase.contractName'),
    align: 'left',
    width: 320,
    colKey: 'name',
    fixed: 'left',
  },
  { title: t('pages.listBase.contractStatus'), colKey: 'status', width: 160 },
  {
    title: t('pages.listBase.contractNum'),
    width: 160,
    ellipsis: true,
    colKey: 'no',
  },
  {
    title: t('pages.listBase.contractType'),
    width: 160,
    ellipsis: true,
    colKey: 'contractType',
  },
  {
    title: t('pages.listBase.contractPayType'),
    width: 160,
    ellipsis: true,
    colKey: 'paymentType',
  },
  {
    title: t('pages.listBase.contractAmount'),
    width: 160,
    ellipsis: true,
    colKey: 'amount',
  },
  {
    title: t('pages.listBase.operation'),
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];

export const RULES: FormRules<FormData> = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
};
