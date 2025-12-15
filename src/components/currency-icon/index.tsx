import {View} from '@tarojs/components';
import c from 'classnames';
import {Image} from '@taroify/core';
import s from './index.module.scss';
import icons from './icon';

export type CcyIconProps = {
  ccy: string,
  imgClassName?: string,
  className?: string,
  style?: any,
  children?: any,
}

export function CcyIcon(props: CcyIconProps) {
  const {ccy, className, imgClassName, children, ...others} = props;

  const img = (
    <View className={c(s.icon, imgClassName)}>
      <Image width={16} height={16} src={icons[ccy]} {...others} />
    </View>
  );
  if (!children) return img;

  return <View className={c(s.root, className)}>{img}{children}</View>
}
