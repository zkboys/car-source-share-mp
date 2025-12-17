import { View, Image, Text } from '@tarojs/components';
import { Company } from '@/types/car-source';
import s from './index.module.scss';

export type HeaderProps = {
  company?: Company;
};

export function Header(props: HeaderProps) {
  const { company } = props;

  return (
    <View className={s.header}>
      <View className={s.info}>
        {company?.logo && (
          <Image className={s.logo} src={company.logo} mode="aspectFill" />
        )}
        <Text className={s.title}>{company?.companyName || ' '}</Text>
      </View>
    </View>
  );
}
