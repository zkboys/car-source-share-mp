import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import { DropdownSelectItemType } from '@/types/car-source';
import s from './index.module.scss';

export type DropdownSelectValue = Record<string, string | string[]>;

export type DropdownSelectProps = {
  className?: string;
  items: DropdownSelectItemType[];
  value?: DropdownSelectValue;
  onChange?: (value: DropdownSelectValue) => void;
};

export function DropdownSelect(props: DropdownSelectProps) {
  const { className, items, onChange } = props;
  let { value } = props;
  if (!value) value = {};

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleItemClick = (itemKey: string) => {
    setActiveKey(activeKey === itemKey ? null : itemKey);
  };

  const handleOptionClick = (item: DropdownSelectItemType, optionKey: string) => {
    const { key, multiple } = item;
    const values = value?.[key] || [];
    const isAll = optionKey === 'all';

    if (multiple) {
      if (isAll) {
        value[key] = [optionKey];
      } else if (Array.isArray(values) && values.includes(optionKey)) {
        value[key] = values.filter((it: string) => it !== optionKey);
      } else {
        if (Array.isArray(values)) {
          value[key] = [...values.filter((it: string) => it !== 'all'), optionKey];
        }
      }
      if (!value[key] || (Array.isArray(value[key]) && value[key].length === 0)) {
        value[key] = ['all'];
      }
    } else {
      value[key] = optionKey;
      setActiveKey(null);
    }
    onChange?.({ ...value });
  };

  const getDisplayTitle = (item: DropdownSelectItemType) => {
    const { key, title, children } = item;
    const currentValue = value?.[key];

    if (Array.isArray(currentValue)) {
      if (currentValue.includes('all') || currentValue.length === 0) {
        return title;
      }
      if (currentValue.length === 1) {
        const child = children?.find(c => c.key === currentValue[0]);
        return child?.title || title;
      }
      return `${title}(${currentValue.length})`;
    }

    if (currentValue && currentValue !== 'all') {
      const child = children?.find(c => c.key === currentValue);
      return child?.title || title;
    }

    return title;
  };

  const getTabClassName = (isActive: boolean, hasValue: boolean) => {
    if (isActive && hasValue) return s.tabActiveHasValue;
    if (isActive) return s.tabActive;
    if (hasValue) return s.tabHasValue;
    return s.tab;
  };

  return (
    <View className={`${s.dropdownSelect} ${className || ''}`}>
      <View className={s.header}>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          const hasValue = (() => {
            const v = value?.[item.key];
            if (Array.isArray(v)) {
              return !v.includes('all') && v.length > 0;
            }
            return v && v !== 'all';
          })();

          return (
            <View
              key={item.key}
              className={getTabClassName(isActive, hasValue)}
              onClick={() => handleItemClick(item.key)}
            >
              <Text className={s.tabText}>{getDisplayTitle(item)}</Text>
              <View className={isActive ? s.arrowUp : s.arrow} />
            </View>
          );
        })}
      </View>

      {activeKey && (
        <View className={s.overlay} onClick={() => setActiveKey(null)}>
          <View className={s.dropdown} onClick={(e) => e.stopPropagation()}>
            <ScrollView scrollY className={s.scroll}>
              {items
                .find((item) => item.key === activeKey)
                ?.children?.map((option) => {
                  const currentItem = items.find((item) => item.key === activeKey);
                  const currentValue = value?.[activeKey];
                  const isSelected = Array.isArray(currentValue)
                    ? currentValue.includes(option.key)
                    : currentValue === option.key;

                  return (
                    <View
                      key={option.key}
                      className={isSelected ? s.optionSelected : s.option}
                      onClick={() => handleOptionClick(currentItem!, option.key)}
                    >
                      <Text>{option.title}</Text>
                      {isSelected && <View className={s.check} />}
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
