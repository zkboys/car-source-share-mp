import {Image} from "@taroify/core";
import c from 'classnames';
import s from './index.module.less';
import defaultAvatar from './default.svg';
import companyAvatar from './company.png';
import manAvatar from './man.png';
import womanAvatar from './woman.png';

const avatars = {
  default: defaultAvatar,
  company: companyAvatar,
  '00': manAvatar,
  '01': womanAvatar,
}

export type AvatarType = 'default' | 'company' | '00' | '01';

export type AvatarProps = {
  className?: string;
  type: AvatarType;
}

export function Avatar(props: AvatarProps) {
  const {className, type} = props;

  const src = avatars[type];

  return (
    <Image width={54} height={54} className={c(s.root, className)} src={src}/>
  )
}
