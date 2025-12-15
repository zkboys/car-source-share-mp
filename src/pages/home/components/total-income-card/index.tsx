import {Text, View} from "@tarojs/components";
import c from 'classnames';
import {formatAmount} from "@/commons";
import {Icon, infoModal, isLogin, useFunction} from "@rc-lib/mp";
import s from './index.module.scss';

export function TotalIncomeCard(props) {
  const {onClick, className, data} = props;

  const handleClick = useFunction(() => {
    if (!isLogin()) return;
    onClick?.();
  })

  return <View
    className={c(s.total_wrap, className)}
    onClick={handleClick}
  >
    <View className={s.list}>
      {
        data?.map((item, index) => {
          const {title, sum, ccy, iconSrc} = item;
          return (
            <View key={index}>
              <View className={s.s_label} style={{backgroundImage: `url(${iconSrc})`}}>{title}</View>
              <View
                className={s.s_amount}
              >
                {isLogin() ? <>{formatAmount(sum)}&nbsp;<Text>{ccy}</Text></> : '-'}
              </View>
            </View>
          )
        })
      }
    </View>
    {
      isLogin() && (
        <Icon
          type="info-circle"
          className={s.popover_icon}
          onClick={(e) => {
            e.stopPropagation();
            infoModal({
              message: <View className={s.m_info}>入账和出金不包含已退款金额</View>
            });
          }}
        />
      )
    }
  </View>
}
