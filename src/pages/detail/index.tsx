import { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { CarSource } from '@/types/car-source';
import { fetchCarSourceDetail } from '@/api';
import { ContactDialog } from '../home/components/contact-dialog';
import styles from './index.module.scss';

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
    <View className={styles.carDetail}>
      {/* 导航栏 */}
      <View className={styles.nav}>
        <View className={styles.navBack} onClick={handleBack}>
          <Text className={styles.navArrow}>‹</Text>
        </View>
        <Text className={styles.navTitle}>车辆详情</Text>
        <View className={styles.navPlaceholder} />
      </View>

      {data && (
        <ScrollView className={styles.scroll} scrollY enhanced showScrollbar={false}>
          {/* 图片轮播 */}
          <View className={styles.images}>
            {carPhoto.length > 0 ? (
              <Swiper
                className={styles.swiper}
                indicatorDots={false}
                autoplay={false}
                circular
                onChange={(e) => setCurrentIndex(e.detail.current)}
              >
                {carPhoto.map((url, index) => (
                  <SwiperItem key={url}>
                    <Image
                      src={url}
                      className={styles.image}
                      mode="aspectFill"
                      onClick={() => handleImageClick(index)}
                    />
                  </SwiperItem>
                ))}
              </Swiper>
            ) : (
              <View className={styles.noPhoto}>暂无图片</View>
            )}
            {carPhoto.length > 1 && (
              <View className={styles.indicator}>
                {currentIndex + 1} / {carPhoto.length}
              </View>
            )}
          </View>

          {/* 基本信息 */}
          <View className={styles.section}>
            <Text className={styles.title}>{data.title}</Text>

            <View className={styles.item}>
              <Text className={styles.label}>提车类型</Text>
              <Text className={styles.value}>{data.deliveryType || '-'}</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>颜色</Text>
              <Text className={styles.value}>{data.color || '-'}</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>指导价</Text>
              <Text className={styles.value}>{data.guidePrice || '-'}</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>出口价</Text>
              <Text className={styles.valueHighlight}>
                {data.exportPrice || '-'}
              </Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>出口方式</Text>
              <Text className={styles.value}>{data.exportMethod || '-'}</Text>
            </View>
          </View>

          {/* 车辆信息 */}
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>车辆信息</Text>

            <View className={styles.item}>
              <Text className={styles.label}>车架号</Text>
              <Text className={styles.value}>{maskVIN(data.VIN)}</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>提车城市</Text>
              <Text className={styles.value}>{data.deliveryCity || '-'}</Text>
            </View>
            <View className={styles.item}>
              <Text className={styles.label}>保险类型</Text>
              <Text className={styles.value}>{data.insuranceType || '-'}</Text>
            </View>
          </View>

          {/* 车辆配置 */}
          {data.vehicleConfiguration && (
            <View className={styles.section}>
              <Text className={styles.sectionTitle}>配置特点</Text>
              <View className={styles.config}>
                <Text className={styles.configText}>{data.vehicleConfiguration}</Text>
              </View>
            </View>
          )}

          {/* 底部占位 */}
          <View className={styles.footerPlaceholder} />
        </ScrollView>
      )}

      {/* 底部按钮 */}
      <View className={styles.footer}>
        {data?.WeChatQRcode && (
          <ContactDialog weChat={data.WeChatQRcode}>
            <View className={styles.btnSecondary}>
              <Text>关注了解更多</Text>
            </View>
          </ContactDialog>
        )}

        <ContactDialog
          contact={data?.contact}
          number={data?.number}
          weChat={data?.weChat}
        >
          <View className={styles.btnPrimary}>
            <Text>联系供应商</Text>
          </View>
        </ContactDialog>
      </View>
    </View>
  );
}
