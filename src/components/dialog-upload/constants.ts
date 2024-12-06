import { FormRules } from 'tdesign-vue-next';

export interface FormData {
  name: string;
  status: string;
  description: string;
  type: string;
  mark: string;
  amount: number;
}
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
