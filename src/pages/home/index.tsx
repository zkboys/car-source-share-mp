import {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import {CarSource, Company, DropdownSelectItemType, DropdownValueType} from '@/types/car-source';
import {fetchCarSourceList, fetchCompany} from '@/api/car-source';
import {CarCard, DropdownSelect, Header} from './components';
import {PageContent} from "@rc-lib/mp";
import s from './index.module.scss';

// 获取系统信息
const systemInfo = Taro.getSystemInfoSync();
const statusBarHeight = systemInfo.statusBarHeight || 20;

// 提取字符串中的数字，用于价格排序
function extractNumber(str: string): number {
  if (!str) return 0;
  const match = str.match(/(\d+\.?\d*)/);
  return match && match[1] ? parseFloat(match[1]) : 0;
}

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

// 初始化筛选项
const initItems: DropdownSelectItemType[] = [
  {
    key: 'sorter',
    title: '排序',
    children: [
      {key: 'all', title: '默认排序'},
      {key: 'desc', title: '价格最高'},
      {key: 'asc', title: '价格最低'},
    ],
  },
  {
    key: 'brand',
    title: '品牌',
    multiple: true,
    children: [{key: 'all', title: '全部品牌'}],
  },
  {
    key: 'source',
    title: '车源',
    multiple: true,
    children: [{key: 'all', title: '全部车源'}],
  },
  {
    key: 'deliveryType',
    title: '提车类型',
    multiple: true,
    children: [{key: 'all', title: '全部类型'}],
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company>();
  const [originDataSource, setOriginDataSource] = useState<CarSource[]>([]);
  const [dataSource, setDataSource] = useState<CarSource[]>([]);
  const [items, setItems] = useState<DropdownSelectItemType[]>(initItems);
  const [dropdownValue, setDropdownValue] = useState<DropdownValueType>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
    deliveryType: ['all'],
  });

  // 获取顶层查询条件项
  const getItems = useCallback((data: CarSource[]) => {
    const brandList: string[] = [];
    const sourceList: string[] = [];
    const deliveryTypeList: string[] = [];

    data.forEach((item) => {
      const {brand, deliveryCity, deliveryType} = item;
      if (brand && !brandList.includes(brand)) {
        brandList.push(brand);
      }
      if (deliveryCity && !sourceList.includes(deliveryCity)) {
        sourceList.push(deliveryCity);
      }
      if (deliveryType && !deliveryTypeList.includes(deliveryType)) {
        deliveryTypeList.push(deliveryType);
      }
    });

    setItems((prevItems) => {
      const newItems = [...prevItems];
      const brandItems = newItems.find((it) => it.key === 'brand')!;
      const sourceItems = newItems.find((it) => it.key === 'source')!;
      const deliveryTypeItems = newItems.find((it) => it.key === 'deliveryType')!;

      brandItems.children = [
        {key: 'all', title: '全部品牌'},
        ...brandList.map((b) => ({key: b, title: b})),
      ];

      sourceItems.children = [
        {key: 'all', title: '全部车源'},
        ...sourceList.map((s) => ({key: s, title: s})),
      ];

      deliveryTypeItems.children = [
        {key: 'all', title: '全部类型'},
        ...deliveryTypeList.map((s) => ({key: s, title: s})),
      ];

      return newItems;
    });
  }, []);

  // 基于查询条件过滤数据
  useEffect(() => {
    const {sorter, brand, source, deliveryType} = dropdownValue;

    const nextDataSource = originDataSource.filter((item: CarSource) => {
      const isBrand = brand.includes('all')
        ? true
        : brand.some((key: string) => item.brand === key);
      const isSource = source.includes('all')
        ? true
        : source.some((key: string) => item.deliveryCity === key);
      const isDeliveryType = deliveryType.includes('all')
        ? true
        : deliveryType.some((key: string) => item.deliveryType === key);

      return isBrand && isSource && isDeliveryType;
    });

    nextDataSource.sort((a, b) => {
      const aTime = a.createTime || '';
      const bTime = b.createTime || '';
      const aPrice = extractNumber(a.exportPrice);
      const bPrice = extractNumber(b.exportPrice);

      if (sorter === 'all') {
        if (bTime > aTime) return 1;
        if (bTime < aTime) return -1;
        return 0;
      }
      if (sorter === 'desc') {
        return bPrice - aPrice;
      }
      if (sorter === 'asc') {
        return aPrice - bPrice;
      }
      return 0;
    });

    setDataSource(nextDataSource);
  }, [dropdownValue, originDataSource]);

  // 初始化查询数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        Taro.showLoading({title: '加载中...'});

        const [companyData, carList] = await Promise.all([
          fetchCompany({withLoading: false}),
          fetchCarSourceList({withLoading: false}),
        ]);

        setCompany(companyData);

        const processedData = (carList || []).map((item: any) => ({
          ...item,
          carPhoto: processCarPhoto(item.carPhoto),
        }));

        setOriginDataSource(processedData);
        getItems(processedData);
      } catch (error) {
        console.error('加载数据失败:', error);
        Taro.showToast({title: '加载失败', icon: 'error'});
      } finally {
        setLoading(false);
        Taro.hideLoading();
      }
    };

    loadData();
  }, [getItems]);

  // 图片点击预览
  const handleImageClick = (images: string[], index: number) => {
    Taro.previewImage({
      urls: images,
      current: images[index],
    });
  };

  // 计算顶部高度（状态栏 + header + 筛选栏）
  const topHeight = useMemo(() => {
    // 状态栏高度 + header高度(约36px) + 筛选栏高度(40px)
    return statusBarHeight + 36 + 40;
  }, []);

  return (
    <PageContent
      className={s.carHome}
      header={<Header company={company}/>}
      transparentHeader
    >
      <View className={s.top}>
        <DropdownSelect
          value={dropdownValue}
          onChange={(value) => setDropdownValue(value as DropdownValueType)}
          items={items}
        />
      </View>

      <ScrollView
        className={s.content}
        style={{paddingTop: `${topHeight + 8}px`}}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {!loading && dataSource.length === 0 ? (
          <View className={s.empty}>
            <Text className={s.emptyText}>暂无数据</Text>
            <Text className={s.emptyTip}>更换筛选条件试试</Text>
          </View>
        ) : (
          dataSource.map((item) => (
            <CarCard
              key={item.id}
              data={item}
              onImageClick={handleImageClick}
            />
          ))
        )}
      </ScrollView>
    </PageContent>
  );
}
