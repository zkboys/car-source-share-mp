import { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { CarSource } from '@/types/car-source';
import { fetchCarSourceDetail } from '@/api/car-source';
import { ContactDialog } from '../home/components/contact-dialog';
import './index.scss';

// 处理图片数据
function processCarPhoto(carPhoto: any): string[] {
  if (Array.isArray(carPhoto)) {
    return carPhoto;
  }
  if (typeof carPhoto === 'string') {
    return carPhoto.split(' ').filter(Boolean);
  }
  return [];
}

// 隐藏 VIN 码中间部分
function maskVIN(vin: string | undefined): string {
  if (!vin) return '-';
  return vin.replace(
    /^(.{9})(?:.*)(.{2})$/,
    (_, a, b) => a + '*'.repeat(Math.max(0, 17 - 9 - 2)) + b
  );
}

export default function Detail() {
  const router = useRouter();
  const { id } = router.params;
  const [data, setData] = useState<CarSource | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        Taro.showLoading({ title: '加载中...' });
        const result = await fetchCarSourceDetail(id, { withLoading: false });
        if (result) {
          setData({
            ...result,
            carPhoto: processCarPhoto(result.carPhoto),
          });
        }
      } catch (error) {
        console.error('加载详情失败:', error);
        Taro.showToast({ title: '加载失败', icon: 'error' });
      } finally {
        Taro.hideLoading();
      }
    };

    loadData();
  }, [id]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleImageClick = (index: number) => {
    if (data?.carPhoto?.length) {
      Taro.previewImage({
        urls: data.carPhoto,
        current: data.carPhoto[index],
      });
    }
  };

  const carPhoto = data?.carPhoto || [];

  return (
    <View className="car-detail">
      {/* 导航栏 */}
      <View className="car-detail__nav">
        <View className="car-detail__nav-back" onClick={handleBack}>
          <Text className="car-detail__nav-arrow">‹</Text>
        </View>
        <Text className="car-detail__nav-title">车辆详情</Text>
        <View className="car-detail__nav-placeholder" />
      </View>

      {data && (
        <ScrollView className="car-detail__scroll" scrollY enhanced showScrollbar={false}>
          {/* 图片轮播 */}
          <View className="car-detail__images">
            {carPhoto.length > 0 ? (
              <Swiper
                className="car-detail__swiper"
                indicatorDots={false}
                autoplay={false}
                circular
                onChange={(e) => setCurrentIndex(e.detail.current)}
              >
                {carPhoto.map((url, index) => (
                  <SwiperItem key={url}>
                    <Image
                      src={url}
                      className="car-detail__image"
                      mode="aspectFill"
                      onClick={() => handleImageClick(index)}
                    />
                  </SwiperItem>
                ))}
              </Swiper>
            ) : (
              <View className="car-detail__no-photo">暂无图片</View>
            )}
            {carPhoto.length > 1 && (
              <View className="car-detail__indicator">
                {currentIndex + 1} / {carPhoto.length}
              </View>
            )}
          </View>

          {/* 基本信息 */}
          <View className="car-detail__section">
            <Text className="car-detail__title">{data.title}</Text>

            <View className="car-detail__item">
              <Text className="car-detail__label">提车类型</Text>
              <Text className="car-detail__value">{data.deliveryType || '-'}</Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">颜色</Text>
              <Text className="car-detail__value">{data.color || '-'}</Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">指导价</Text>
              <Text className="car-detail__value">{data.guidePrice || '-'}</Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">出口价</Text>
              <Text className="car-detail__value car-detail__value--highlight">
                {data.exportPrice || '-'}
              </Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">出口方式</Text>
              <Text className="car-detail__value">{data.exportMethod || '-'}</Text>
            </View>
          </View>

          {/* 车辆信息 */}
          <View className="car-detail__section">
            <Text className="car-detail__section-title">车辆信息</Text>

            <View className="car-detail__item">
              <Text className="car-detail__label">车架号</Text>
              <Text className="car-detail__value">{maskVIN(data.VIN)}</Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">提车城市</Text>
              <Text className="car-detail__value">{data.deliveryCity || '-'}</Text>
            </View>
            <View className="car-detail__item">
              <Text className="car-detail__label">保险类型</Text>
              <Text className="car-detail__value">{data.insuranceType || '-'}</Text>
            </View>
          </View>

          {/* 车辆配置 */}
          {data.vehicleConfiguration && (
            <View className="car-detail__section">
              <Text className="car-detail__section-title">配置特点</Text>
              <View className="car-detail__config">
                <Text className="car-detail__config-text">{data.vehicleConfiguration}</Text>
              </View>
            </View>
          )}

          {/* 底部占位 */}
          <View className="car-detail__footer-placeholder" />
        </ScrollView>
      )}

      {/* 底部按钮 */}
      <View className="car-detail__footer">
        {data?.WeChatQRcode && (
          <ContactDialog weChat={data.WeChatQRcode}>
            <View className="car-detail__btn car-detail__btn--secondary">
              <Text>关注了解更多</Text>
            </View>
          </ContactDialog>
        )}

        <ContactDialog
          contact={data?.contact}
          number={data?.number}
          weChat={data?.weChat}
        >
          <View className="car-detail__btn car-detail__btn--primary">
            <Text>联系供应商</Text>
          </View>
        </ContactDialog>
      </View>
    </View>
  );
}
