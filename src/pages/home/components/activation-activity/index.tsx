import Taro from "@tarojs/taro";
import {Image} from '@taroify/core';
import c from 'classnames';
import {formatAmount} from '@/commons';
import {View, Text, Swiper, SwiperItem} from "@tarojs/components";
import {isLogin, PageContent, useFunction} from '@rc-lib/mp';
import {LoginTip, MerchantCard, NoticeCard, TotalIncomeCard} from '../index';
import {ActivityProps} from '../../types';
import s from './index.module.scss';

export function ActivationActivity(props: ActivityProps) {
  const {notices, rewardInfo, inviteCode = '', levelDetail} = props;

  const handleToRewardMange = useFunction(() => {
    if (!isLogin()) return;
    Taro.navigateTo({url: '/packages/reward-manage/index'});
  });

  const renderStatistics = useFunction(() => {
    const {level, amt, levelAmt, levelCount, inviteCount} = levelDetail || {};

    const unit = levelAmt > 500000 ? '（万美元）' : '（美元）';
    const formattedAmt = (amt) => {
      if (levelAmt > 500000) return amt / 10000;
      return amt;
    };

    const levelClassName = (() => {
      if (!level) return '';
      if (['C0', 'C1', 'C2'].includes(level)) return s.blue;
      if (['C3', 'C4'].includes(level)) return s.purple;
      return s.red;
    })();

    return (
      <View
        className={s.statistics}
        onClick={handleToRewardMange}
      >
        <View className={s.total_income_wrap}>
          {isLogin() && (
            <View>
              <Text className={s.s_label}>累计收益</Text>
              <View className={s.s_amount}>{formatAmount(rewardInfo?.accumulatedIncome)}
                <Text>&nbsp;CNY</Text>
              </View>
            </View>
          )}
        </View>

        <View className={s.await_income_wrap}>
          {isLogin() ? <>
            <View className={s.s_label}>待结算收益</View>
            <View className={s.s_amount}>{formatAmount(rewardInfo?.pendingSettlementIncome)}
              <Text>&nbsp;CNY</Text>
            </View>
            <View className={c(s.level_chart, levelClassName)}>
              <View className={s.level}>{level}</View>
              <View className={s.chart}>
                <Swiper className={s.swiper} vertical circular autoplay>
                  <SwiperItem>
                    <View
                      className={s.inner}
                      style={{width: `${(inviteCount / levelCount) * 100}%`}}
                    >
                      <View><Text>{inviteCount}</Text>/<Text>{levelCount}</Text><View
                        className={s.unit}>（人）</View></View>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className={s.inner} style={{width: `${(amt / levelAmt) * 100}%`}}>
                      <View>
                        <Text>{formatAmount(formattedAmt(amt))}</Text>/<Text>{formatAmount(formattedAmt(levelAmt), 0)}</Text>
                        <View className={s.unit}>{unit}</View>
                      </View>
                    </View>
                  </SwiperItem>
                </Swiper>
              </View>
            </View>
          </> : <LoginTip mode="dark"/>}
        </View>
        <View className={s.banner}>
          <Image
            src="https://oss-ali-pub-prod.cogolinks.com/20250825170853082_25138_65_2884e8f36eb04e1_10080002102.png"
            className={s.b_1}
          />
          <View className={s.b_2}>
            <Image
              src="https://oss-ali-pub-prod.cogolinks.com/20250825170922849_19493_146_1c65c13f862d11_10080001227.png"
            />
          </View>
        </View>
      </View>
    )
  });

  return (
    <PageContent
      className={s.root}
      header="CoGoLinks代理商"
      transparentHeader
    >
      <View className={s.content}>
        {renderStatistics()}
        <MerchantCard
          data={[
            {
              title: '已邀请商户',
              sum: rewardInfo?.invitationInSucc,
              summary: rewardInfo?.contrastTodayInvitationInSucc,
            },
            {title: '已认证商户', sum: rewardInfo?.authSucc, summary: rewardInfo?.contrastTodayAuthSucc},
            {title: '已激活商户', sum: rewardInfo?.invitationSucc, summary: rewardInfo?.contrastTodayInvitationSucc},
          ]}
          inviteCode={inviteCode}
          onClick={() => Taro.navigateTo({url: '/packages/invite-merchant-manage/index'})}
          btnClassName={s.invite_btn}
        />
        <TotalIncomeCard
          className={s.total_income}
          data={[
            {
              title: '本月商户入账',
              sum: rewardInfo?.monthMerAccounted,
              ccy: 'USD',
              iconSrc: 'https://oss-ali-pub-prod.cogolinks.com/20250828144102467_20145_69_2968954d7e72991_10080002102.png'
            },
            {
              title: '商户入账合计',
              sum: rewardInfo?.merAccountedTotal,
              ccy: 'USD',
              iconSrc: 'https://oss-ali-pub-prod.cogolinks.com/20250828144038206_20145_64_29688fa76cc3ca1_10080002102.png'
            },
          ]}
          onClick={() => Taro.navigateTo({url: '/packages/invite-merchant-manage/index'})}
        />
        <NoticeCard data={notices}/>
      </View>
    </PageContent>
  );
}
