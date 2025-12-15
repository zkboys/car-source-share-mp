import {ActionSheet, SafeArea} from "@taroify/core";
import VirtualListComponent from '@tarojs/components-advanced/dist/components/virtual-list'
import {useRef, useState} from "react";
import {View} from "@tarojs/components";
import s from './index.module.scss';
import {Icon, Search, TouchableView, useFunction} from "@rc-lib/mp";
import {fetchInterBank, InterBank} from "@/api";

export type BankSelectProps = {
  value?: any,
  onChange?: (value: any) => void,
  onSelect?: (item: InterBank) => void,
  placeholder?: string,
  disabled?: boolean,
}

export function BankSelect(props: BankSelectProps) {
  const {value, onChange, placeholder, disabled, onSelect, ...others} = props;
  const [options, setOptions] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const stRef = useRef<any>(0);
  const handleSearch = useFunction(async (e) => {
    const val = e.detail.value;
    setSearchValue(val);
    if (stRef.current) {
      clearTimeout(stRef.current);
    }

    stRef.current = setTimeout(async () => {
      if (!val?.trim()) return setOptions([]);

      const data = await fetchInterBank({lbnkNm: val, pageNum: 1, pageSize: 10000});
      const options = data?.linkBankList?.map(item => {
        return {
          value: item.lbnkNo,
          label: item.lbnkNm,
          text: item.lbnkNm,
          ...item,
        }
      })
      setOptions(options);
    }, 500)
  });
  const handleClick = useFunction((item) => {
    onSelect?.(item);
    setVisible(false);
  });
  return (
    <>
      <TouchableView
        className={s.control}
        onClick={() => disabled ? undefined : setVisible(true)}
      >
        <View className={s.value}>
          {value ? value : <View className={s.placeholder}>{placeholder}</View>}
        </View>
        <Icon size={20} className={s.icon} type="arrow-right"/>
      </TouchableView>
      <ActionSheet
        open={visible}
        onSelect={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        className={s.root}
        {...others}
      >
        <View className={s.top}>
          <View className={s.title}>
            选择开户支行/网点
            <TouchableView className={s.close} onClick={() => setVisible(false)}>
              <Icon size={20} type="close-x"/>
            </TouchableView>
          </View>
          <View className={s.input}>
            <Search autoFocus placeholder="请输入开户支行/网点名称" value={searchValue} onChange={handleSearch}/>
          </View>
        </View>
        <View className={s.list}>
          <VirtualListComponent
            height={30 * 15}
            width="100%"
            item={({index, data}) => {
              if (!data?.length) return null;

              const item = data[index];
              return <View className={s.item} key={item.value} onClick={() => handleClick(item)}>{item.text}</View>
            }}
            itemData={options || []}
            itemCount={options?.length}
            itemSize={30}
          />
        </View>
        <SafeArea position="bottom"/>
      </ActionSheet>
    </>
  )
}
