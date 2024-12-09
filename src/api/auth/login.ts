import { components } from '@/types/schema';
import { request } from '@/utils/request';

// 定义 LoginBody 接口
export interface LoginBody {
  // 用户名
  username: string;
  // 密码
  password: string;

  // 客户端 id
  clientId: string;
  // 授权类型
  grantType: string;
  // 租户 ID
  tenantId?: string;
  // 验证码
  code?: string;
  // 唯一标识
  uuid?: string;
}

export function login(data: LoginBody) {
  return request.post<components['schemas']['LoginVo'], null, true>(
    {
      url: '/auth/login',
      data,
    },
    {
      withToken: false,
      isTransformResponse: true,
      isEncrypt: true,
    },
  );
}

export function getCaptcha() {
  return request.get<components['schemas']['CaptchaVo'], null, true>(
    {
      url: '/auth/code',
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getRouters() {
  return request.get<components['schemas']['RouterVo'][], null, true>(
    {
      url: '/system/menu/getRouters',
    },
    {
      isTransformResponse: true,
    },
  );
}

export function getUserInfo() {
  return request.get<components['schemas']['UserInfoVo'], null, true>(
    {
      url: '/system/user/getInfo',
    },
    {
      isTransformResponse: true,
    },
  );
}
