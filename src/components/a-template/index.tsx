import {CSSProperties, ReactNode} from "react";
import {View} from "@tarojs/components";
import c from 'classnames';
import s from './index.module.scss';

export type TemplateProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Template(props: TemplateProps) {
  const {className, children, ...others} = props;

  return (
    <View className={c(s.root, className)} {...others}>
      {children}
    </View>
  )
}
