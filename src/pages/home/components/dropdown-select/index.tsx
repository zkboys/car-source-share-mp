import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import { DropdownSelectItemType } from '@/types/car-source';
import './index.scss';

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

  return (
    <View className={`dropdown-select ${className || ''}`}>
      <View className="dropdown-select__header">
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
              className={`dropdown-select__tab ${isActive ? 'dropdown-select__tab--active' : ''} ${hasValue ? 'dropdown-select__tab--has-value' : ''}`}
              onClick={() => handleItemClick(item.key)}
            >
              <Text className="dropdown-select__tab-text">{getDisplayTitle(item)}</Text>
              <View className={`dropdown-select__arrow ${isActive ? 'dropdown-select__arrow--up' : ''}`} />
            </View>
          );
        })}
      </View>

      {activeKey && (
        <View className="dropdown-select__overlay" onClick={() => setActiveKey(null)}>
          <View className="dropdown-select__dropdown" onClick={(e) => e.stopPropagation()}>
            <ScrollView scrollY className="dropdown-select__scroll">
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
                      className={`dropdown-select__option ${isSelected ? 'dropdown-select__option--selected' : ''}`}
                      onClick={() => handleOptionClick(currentItem!, option.key)}
                    >
                      <Text>{option.title}</Text>
                      {isSelected && <View className="dropdown-select__check" />}
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
