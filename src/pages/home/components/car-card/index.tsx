import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { CarSource } from '@/types/car-source';
import { ContactDialog } from '../contact-dialog';
import './index.scss';

export type CarCardProps = {
  data: CarSource;
  onImageClick?: (images: string[], index: number) => void;
};

export function CarCard(props: CarCardProps) {
  const { data, onImageClick } = props;
  const {
    id,
    carPhoto,
    title,
    guidePrice,
    exportMethod,
    exportPrice,
    color,
    deliveryType,
    deliveryCity,
    insuranceType,
    contact,
    number,
    weChat,
  } = data || {};

  const handleToDetail = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  };

  const handleImageClick = (index: number) => {
    if (carPhoto?.length) {
      onImageClick?.(carPhoto, index);
    }
  };

  return (
    <View className="car-card">
      <View className="car-card__top" onClick={handleToDetail}>
        <View className="car-card__image-wrap">
          {carPhoto?.length ? (
            <Swiper
              className="car-card__swiper"
              indicatorDots={false}
              autoplay={false}
              circular
            >
              {carPhoto.map((url, index) => (
                <SwiperItem key={url} onClick={(e) => { e.stopPropagation(); handleImageClick(index); }}>
                  <Image src={url} className="car-card__image" mode="aspectFill" />
                </SwiperItem>
              ))}
            </Swiper>
          ) : (
            <View className="car-card__no-photo">暂无图片</View>
          )}
          {carPhoto && carPhoto.length > 1 && (
            <View className="car-card__indicator">{carPhoto.length}张</View>
          )}
        </View>
        <View className="car-card__title-wrap">
          <Text className="car-card__title">{title || ''}</Text>
        </View>
      </View>

      <View className="car-card__price-info" onClick={handleToDetail}>
        {[
          { label: '指导价', value: guidePrice },
          { label: '出口方式', value: exportMethod },
          { label: '出口价', value: exportPrice },
        ].map((item) => (
          <View key={item.label} className="car-card__price-item">
            <Text className="car-card__price-label">{item.label}</Text>
            <Text className="car-card__price-value">{item.value || '-'}</Text>
          </View>
        ))}
      </View>

      <View className="car-card__details" onClick={handleToDetail}>
        {[color, deliveryType, deliveryCity, insuranceType].map((item, index) => (
          <View key={index} className="car-card__detail-item">
            <Text>{item || '-'}</Text>
          </View>
        ))}
      </View>

      <ContactDialog contact={contact} number={number} weChat={weChat}>
        <View className="car-card__contact">
          <Image
            className="car-card__wechat-icon"
            src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
          />
          <Text className="car-card__contact-text">加微信咨询</Text>
        </View>
      </ContactDialog>
    </View>
  );
}
