import {fetchQueryPersonCenter} from "@/api";
import {View} from "@tarojs/components";
import React, {useEffect, useState} from "react";
import {Button, Image} from '@taroify/core';
import Taro from "@tarojs/taro";
import {AuthStatus, authStatusEnum} from "@/enums";
import s from './index.module.scss';

export type AuthTipProps = {
  tip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function AuthTip(props: AuthTipProps) {
  const {className, children, tip = '请先完成实名认证', ...others} = props;

  // 认证状态
  const [authStatus, setAuthStatus] = useState<AuthStatus>(authStatusEnum.AUTHENTICATED);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await fetchQueryPersonCenter(null, {setLoading});
      setAuthStatus(status);
    })();
  }, []);

  if (loading) return;
  if (authStatus !== authStatusEnum.AUTHENTICATED) {
    return (
      <View className={s.root} {...others}>
        <View className={s.auth_img}>
          <Image
            src="https://oss-ali-pub-prod.cogolinks.com/20250822095513759_19493_170_c2ed597b7b891_10080001227.svg"
          />
        </View>

        <View className={s.text}>
          {tip}
        </View>
        <Button
          color="primary"
          className={s.kyc_btn}
          onClick={() => Taro.navigateTo({url: '/packages/user-center/merchant-approve/auth-type/index'})}
        >
          立即认证
        </Button>
      </View>
    )
  }

  return children;
}
