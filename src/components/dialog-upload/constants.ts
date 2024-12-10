import { FormRules } from 'tdesign-vue-next';

export const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
};
export const RULES: FormRules<FormData> = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
};
