import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { CarSource } from '@/types/car-source';
import { ContactDialog } from '../contact-dialog';
import s from './index.module.scss';

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
    <View className={s.carCard}>
      <View className={s.top} onClick={handleToDetail}>
        <View className={s.imageWrap}>
          {carPhoto?.length ? (
            <Swiper
              className={s.swiper}
              indicatorDots={false}
              autoplay={false}
              circular
            >
              {carPhoto.map((url, index) => (
                <SwiperItem key={url} onClick={(e) => { e.stopPropagation(); handleImageClick(index); }}>
                  <Image src={url} className={s.image} mode="aspectFill" />
                </SwiperItem>
              ))}
            </Swiper>
          ) : (
            <View className={s.noPhoto}>暂无图片</View>
          )}
          {carPhoto && carPhoto.length > 1 && (
            <View className={s.indicator}>{carPhoto.length}张</View>
          )}
        </View>
        <View className={s.titleWrap}>
          <Text className={s.title}>{title || ''}</Text>
        </View>
      </View>

      <View className={s.priceInfo} onClick={handleToDetail}>
        {[
          { label: '指导价', value: guidePrice },
          { label: '出口方式', value: exportMethod },
          { label: '出口价', value: exportPrice },
        ].map((item) => (
          <View key={item.label} className={s.priceItem}>
            <Text className={s.priceLabel}>{item.label}</Text>
            <Text className={s.priceValue}>{item.value || '-'}</Text>
          </View>
        ))}
      </View>

      <View className={s.details} onClick={handleToDetail}>
        {[color, deliveryType, deliveryCity, insuranceType].map((item, index) => (
          <View key={index} className={s.detailItem}>
            <Text>{item || '-'}</Text>
          </View>
        ))}
      </View>

      <ContactDialog contact={contact} number={number} weChat={weChat}>
        <View className={s.contact}>
          <Image
            className={s.wechatIcon}
            src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
          />
          <Text className={s.contactText}>加微信咨询</Text>
        </View>
      </ContactDialog>
    </View>
  );
}
