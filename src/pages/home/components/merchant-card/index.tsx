import c from 'classnames';
import {View, Text} from "@tarojs/components";
import {Image} from '@taroify/core';
import {envEnum} from "@/config/env-enum";
import {copy, Empty, getEnv, isLogin, TouchableView, useFunction} from "@rc-lib/mp";
import s from './index.module.scss';

export function MerchantCard(props: any) {
  const {
    data,
    inviteCode = '',
    btnClassName,
    onClick
  } = props;
  const invitePath = envEnum.getItem(getEnv())?.pcDomain + `/register?inviteCode=${inviteCode}`;

  const renderContent = useFunction(() => {
    if (!isLogin()) return (
      <Empty
        className={s.empty}
        text="暂无信息"
        src="https://oss-ali-pub-prod.cogolinks.com/20250827135711573_5904_64_2590860fe6ed41_10080001227.png"
      />
    );

    return (
      <>
        <View className={s.card}>
          {data?.map((item, idx) => {
            const {title, sum, summary = 0} = item;
            const trend = summary === 0 ? 'same' : summary > 0 ? 'up' : 'down';
            const summaryClass = trend !== 'same' && (summary > 0 ? s.up : s.down);
            const iconSrc = {
              up: 'https://oss-ali-pub-prod.cogolinks.com/20250815143519032_10531_67_256ab9f62baadc1_10080002102.svg',
              down: 'https://oss-ali-pub-prod.cogolinks.com/20250815143518736_24859_62_25694c8f7867b61_10080001227.svg',
              same: 'https://oss-ali-pub-prod.cogolinks.com/20250815143518872_10531_69_256ab9ecaef7e71_10080002102.svg',
            }[trend];

            return (
              <View key={idx}>
                <View className={s.count}><Text>{sum}</Text>&nbsp;人</View>
                <View>{title}</View>
                <View className={s.summary}>
                  <View>
                    {summary === 0 ? (
                      '与昨日持平'
                    ) : (
                      <>
                        较昨日<Text className={c(summaryClass, s.count)}> {summary > 0 ? '+' : ''}{summary}</Text>
                      </>
                    )}
                  </View>
                  <View className={s.icon}>
                    <Image src={iconSrc}/>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <TouchableView
          className={c(s.button, btnClassName)}
          onClick={(e) => {
            e.stopPropagation();
            copy(invitePath);
          }}
        />
      </>
    )
  });

  const handleClick = useFunction(() => {
    if (!isLogin()) return;
    onClick?.();
  });

  return (
    <View className={s.root} onClick={handleClick}>
      {
        isLogin() &&
        <View className={s.arrow_icon}>
          <Image
            src="https://oss-ali-pub-prod.cogolinks.com/20250815154332959_24859_65_256d05d224c3e51_10080001227.svg"
          />
        </View>
      }

      <View className={s.title}>商户信息</View>
      {renderContent()}
    </View>
  );
}
