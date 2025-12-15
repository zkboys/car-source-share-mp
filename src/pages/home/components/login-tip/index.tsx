import {View} from "@tarojs/components";
import {toLoginDirectly} from "@/commons";
import {TouchableView} from "@rc-lib/mp";
import c from 'classnames';
import s from './index.module.scss';

export function LoginTip(props: any) {
  return <View className={c(s.root, props.mode === 'dark' && s.dark)}>
    <View className={s.title}>请先登录</View>
    <View className={s.tip}>Hi，登录后使用全部功能，快速开启代理商之旅～</View>
    <TouchableView className={s.btn} onClick={toLoginDirectly}>去登录</TouchableView>
  </View>
}
