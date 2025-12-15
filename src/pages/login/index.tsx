import {useState} from 'react';
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';
import {Button, Checkbox} from '@taroify/core';
import {fetchMiniLogin, profileOssUrl, signInOssUrl} from "@/api";
import {useShare} from '@/hooks';
import {toHome} from '@/commons';
import {Agreement, setToken, message, useFunction, PageContent} from "@rc-lib/mp";
import {saleDistributionStatusEnum} from '@/enums';
import s from './index.module.scss';

export default function Login() {
  useShare();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const saleInviteCode = Taro.getCurrentInstance()?.router?.params?.scene;

  const handleGetPhoneNumber = useFunction(async (e) => {
    const {code} = e.detail;

    if (!code) return;

    const {token, activityType, exist, saleAllocationMethod} = await fetchMiniLogin({code, saleInviteCode});
    setToken(token);

    // 销售状态为未分配，跳转到输入邀请码页面
    if (saleAllocationMethod === saleDistributionStatusEnum.NOT_ALLOCATION) {
      return Taro.navigateTo({url: '/packages/register-invite-code/index'});
    }
    // 存在，相当于登录，直接跳转到首页
    if (exist) {
      toHome(activityType);
    } else {
      // 不存在，相当于注册
      // 扫码进入的，有邀请码参数
      if (saleInviteCode) {
        // 跳转到选择活动类型
        Taro.navigateTo({url: '/packages/choose-activity-type/index'});
      }
    }
  });

  const handleLogin = () => {
    if (!isChecked) return message('请同意协议！');
  };

  return (
    <PageContent header=" " transparentHeader className={s.root} bottomSafeArea={false}>
      <View className={s.container}>
        <Button
          className={s.loginBtn}
          color="primary"
          shape="round"
          block
          openType={isChecked ? 'getPhoneNumber|agreePrivacyAuthorization' : undefined}
          onGetPhoneNumber={handleGetPhoneNumber}
          onClick={handleLogin}
        >
          立即登录/注册
        </Button>
        <View className={s.agreement}>
          <Checkbox
            onChange={(v) => setIsChecked(v)}
            checked={isChecked}
            className={s.radio}
            size={14}
          />
          <View className={s.profile}>
            我已阅读并同意
            <Agreement
              url={signInOssUrl}
            >
              《结行国际用户账户注册协议》
            </Agreement>
            和
            <Agreement
              url={profileOssUrl}
            >《CoGoLinks用户账户及服务账户收集个人资料声明》</Agreement>
          </View>
        </View>
      </View>
    </PageContent>
  );
}
