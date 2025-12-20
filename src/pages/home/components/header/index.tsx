import { View, Image, Text } from '@tarojs/components';
import { Company } from '@/types/car-source';
import s from './index.module.scss';
import { CustomHeader } from '@rc-lib/mp';

export type HeaderProps = {
  company?: Company;
  children?: React.ReactNode;
};

export function Header(props: HeaderProps) {
  const { company, children } = props;

  return (
    <CustomHeader className={s.root}>
      <View className={s.header}>
        <View className={s.info}>
          {company?.logo && (
            <Image className={s.logo} src={company.logo} mode="aspectFill" />
          )}
          <Text className={s.title}>{company?.companyName || ' '}</Text>
        </View>
      </View>
      {children}
    </CustomHeader>
  );
}
