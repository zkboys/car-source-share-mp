import Taro from "@tarojs/taro";
import {formatAmount} from '@/commons';
import {View, Text} from "@tarojs/components";
import {isLogin, PageContent, useFunction} from '@rc-lib/mp';
import {LoginTip, MerchantCard, NoticeCard, TotalIncomeCard} from '../index';
import {ActivityProps} from '../../types';
import c from 'classnames';
import s from './index.module.scss';

export function CommissionActivity(props: ActivityProps) {
  const {notices, rewardInfo, inviteCode = ''} = props;
  const renderStatistics = useFunction(() => {
    if (!isLogin()) return <LoginTip/>;

    return <View
      className={s.statistics}
      onClick={() => Taro.navigateTo({url: '/packages/rebate-price-manage/index'})}
    >
      <View>
        <View className={s.s_label}>本月商户出金</View>
        <View className={s.s_amount}>{formatAmount(rewardInfo?.monthMerWithdrawalCumulative)}
          <Text>&nbsp;USD</Text>
        </View>
      </View>

      <View className={s.income_wrap}>
        <View className={s.s_label}>本月商户入账</View>
        <View className={s.s_amount}>{formatAmount(rewardInfo?.monthMerAccounted)}
          <Text>&nbsp;USD</Text>
        </View>
      </View>
    </View>
  });

  return (
    <PageContent
      className={s.root}
      header="CoGoLinks代理商"
      transparentHeader
    >
      <View className={s.inner}>
        <View className={c(s.statistics_wrap, isLogin() && s.login)}>
          {renderStatistics()}
        </View>
        <TotalIncomeCard
          className={s.total_income}
          data={[
            {
              title: '商户出金合计',
              sum: rewardInfo?.merWithdrawalCumulative,
              ccy: 'USD',
              iconSrc: 'https://oss-ali-pub-prod.cogolinks.com/20250828144005958_20145_69_29688825584c6b1_10080002102.png'
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
        <MerchantCard
          data={[
            {
              title: '已邀请商户',
              sum: rewardInfo?.invitationInSucc,
              summary: rewardInfo?.contrastTodayInvitationInSucc,
            },
            {title: '已认证商户', sum: rewardInfo?.authSucc, summary: rewardInfo?.contrastTodayAuthSucc},
            {title: '已入账商户', sum: rewardInfo?.accountMerCount, summary: rewardInfo?.contrastAccountMerCount},
          ]}
          inviteCode={inviteCode}
          onClick={() => Taro.navigateTo({url: '/packages/invite-merchant-manage/index'})}
          btnClassName={s.invite_btn}
        />
        <NoticeCard data={notices}/>
      </View>
    </PageContent>
  );
}
