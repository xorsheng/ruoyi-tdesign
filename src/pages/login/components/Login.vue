<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.username" size="large" :placeholder="`${t('pages.login.input.account')}：admin`">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          :placeholder="`${t('pages.login.input.password')}：admin`"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="captcha">
        <t-row justify="space-between" style="width: 100%">
          <t-col :span="6">
            <t-input
              v-model="formData.code"
              size="large"
              clearable
              style="width: 220px"
              :placeholder="`${t('pages.login.input.captcha')}`"
            >
              <template #prefix-icon>
                <t-icon name="safe" />
              </template>
            </t-input>
          </t-col>
          <t-col :span="5">
            <t-image :src="captchaImage" style="height: 40px" fit="cover" @click="refreshCaptcha"></t-image>
          </t-col>
        </t-row>
      </t-form-item>

      <!-- <div class="check-container remember-pwd">
        <t-checkbox>{{ t('pages.login.remember') }}</t-checkbox>
        <span class="tip">{{ t('pages.login.forget') }}</span>
      </div> -->
    </template>

    <!-- 扫码登录 -->
    <!-- <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">{{ t('pages.login.wechatLogin') }}</span>
        <span class="refresh">{{ t('pages.login.refresh') }} <t-icon name="refresh" /> </span>
      </div>
      <qrcode-vue value="" :size="160" level="H" />
    </template> -->

    <!-- 手机号登录 -->
    <!-- <template v-else>
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" :placeholder="t('pages.login.input.phone')">
          <template #prefix-icon>
            <t-icon name="mobile" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" :placeholder="t('pages.login.input.verification')" />
        <t-button size="large" variant="outline" :disabled="countDown > 0" @click="sendCode">
          {{ countDown == 0 ? t('pages.login.sendVerification') : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template> -->

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> {{ t('pages.login.signIn') }} </t-button>
    </t-form-item>

    <!-- <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">{{
        t('pages.login.accountLogin')
      }}</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">{{ t('pages.login.wechatLogin') }}</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">{{ t('pages.login.phoneLogin') }}</span>
    </div> -->
  </t-form>
</template>

<script setup lang="ts">
// import QrcodeVue from 'qrcode.vue';
import type { FormInstanceFunctions, FormRules, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getCaptcha, LoginBody } from '@/api/auth/login';
// import { useCounter } from '@/hooks';
import { t } from '@/locales';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const INITIAL_DATA: LoginBody = {
  username: '',
  password: '',
  clientId: import.meta.env.VITE_APP_CLIENT_ID,
  grantType: 'password',
};

const FORM_RULES: FormRules<LoginBody> = {
  // phone: [{ required: true, message: t('pages.login.required.phone'), type: 'error' }],
  username: [{ required: true, message: t('pages.login.required.account'), type: 'error' }],
  password: [{ required: true, message: t('pages.login.required.password'), type: 'error' }],
  // verifyCode: [{ required: true, message: t('pages.login.required.verification'), type: 'error' }],
  code: [{ required: true, message: t('pages.login.required.captcha'), type: 'error' }],
};

const type = ref('password');

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);
const captchaImage = ref('');
// const [countDown, handleCounter] = useCounter();

// const switchType = (val: string) => {
//   type.value = val;
// };

const router = useRouter();
const route = useRoute();

/**
 * 发送验证码
 */
// const sendCode = () => {
//   form.value.validate({ fields: ['phone'] }).then((e) => {
//     if (e === true) {
//       handleCounter();
//     }
//   });
// };

const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    await userStore.login(formData.value);

    MessagePlugin.success('登录成功');
    const redirect = route.query.redirect as string;
    const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard';
    router.push(redirectUrl);
  }
};

const refreshCaptcha = async () => {
  const data = await getCaptcha();
  const { img, uuid } = data;
  captchaImage.value = `data:image/gif;base64, ${img}`;
  formData.value.uuid = uuid;
};

onMounted(async () => {
  refreshCaptcha();
});
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
