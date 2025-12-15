import { View, Image, Text } from '@tarojs/components';
import { Company } from '@/types/car-source';
import './index.scss';

export type HeaderProps = {
  company?: Company;
};

export function Header(props: HeaderProps) {
  const { company } = props;

  return (
    <View className="car-header">
      <View className="car-header__info">
        {company?.logo && (
          <Image className="car-header__logo" src={company.logo} mode="aspectFill" />
        )}
        <Text className="car-header__title">{company?.companyName || ''}</Text>
      </View>
    </View>
  );
}
