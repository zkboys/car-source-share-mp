import {useState} from "react";
import {View, Text} from '@tarojs/components';
import {Image} from '@taroify/core';
import {Avatar, AvatarType} from "@/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {ActivityType, activityTypeEnum, agentTypeEnum, authStatusEnum} from "@/enums";
import {fetchQueryPersonCenter, Person} from "@/api";
import {useShare} from '@/hooks';
import {Icon, PageContent, TouchableView, isLogin, customerService} from "@rc-lib/mp";
import {toLoginDirectly} from "@/commons";
import s from './index.module.scss';
import card from './images/card.png';
import gift from './images/gift.png';
import account from './images/account.png';
import safe from './images/safe.png';
import user from './images/user.png';
import waterRebate from './images/water-rebate.png';
import arrowRight from './images/arrow-right.svg';
import levelBlue from './images/level-blue.png';
import levelPurple from './images/level-purple.png';
import levelRed from './images/level-red.png';

interface MenuItem {
  title: string; // 菜单项的标题
  icon: string; // 图标路径或标识符
  url?: string; // 可选的 URL，用于导航
  tip?: string; // 可选的提示信息
  onClick?: () => void; // 自定义点击事件
}

function getAvatar(data?: Person): AvatarType {
  const {agentType, sex, status} = data || {};

  if (!agentType) return 'default';

  if (status !== authStatusEnum.AUTHENTICATED) return 'default';

  if (agentType === agentTypeEnum.PERSONAL) {
    return sex as AvatarType || 'default';
  }

  if (agentType === agentTypeEnum.COMPANY) {
    return 'company';
  }
  return 'default';
}

function getActivityTag(activityType?: ActivityType, level?: string) {
  if (!activityType) return null;
  // 流水返佣
  if (activityType === activityTypeEnum.WATER_REBATE) return <Image height={24} width={80} src={waterRebate}/>;

  if (!level) return null;

  const levelInfo = (() => {
    if (['C0', 'C1', 'C2'].includes(level?.toUpperCase())) {
      return {
        src: levelBlue,
        color: '#286FEE',
      };
    }
    if (['C3', 'C4'].includes(level?.toUpperCase())) {
      return {
        src: levelPurple,
        color: '#6F35BF',
      };
    }
    return {
      src: levelRed,
      color: '#FF3C1E'
    };
  })();

  if (levelInfo) return (
    <View className={s.level_wrap}>
      <Image height={24} width={104} src={levelInfo.src}/>
      <View className={s.level} style={{color: levelInfo.color}}>{level}</View>
    </View>
  );

  return level;
}

export default function UserCenter() {
  const [data, setData] = useState<Person>();
  const {activityType, phoneNumber, agentName, status, agentType, level, saleName, salePhoneNumber} = data || {};
  // 激活奖励活动
  const isActivationReward = activityType === activityTypeEnum.ACTIVATION_REWARD;

  useShare();

  useDidShow(() => {
    (async () => {
      if (!isLogin()) return setData(undefined);

      const data = await fetchQueryPersonCenter();
      setData(data);
    })();
  });

  const MENUS = [
    {
      title: '我的银行卡',
      icon: card,
      url: '/packages/user-center/bank-card-manage/index',
      tip: '设置奖励提现卡'
    },
    // 认证未完成 或者 企业 才展示
    (status !== authStatusEnum.AUTHENTICATED || agentType === agentTypeEnum.COMPANY) && {
      title: '发票管理',
      icon: account,
      url: '/packages/user-center/receipt-manage/index'
    },
    {
      title: '活动规则',
      icon: gift,
      url: isActivationReward ? '/packages/activation-reward-rules/index' : '/packages/commission-rules/index',
    },
    {
      title: '安全中心',
      icon: safe,
      url: `/packages/user-center/bind-phone/one/index?phoneNumber=${phoneNumber}`,
      tip: '修改绑定手机'
    },
    {
      title: '专属客户经理',
      icon: user,
      onClick: () => {
        customerService({
          name: saleName || '结行国际',
          mobile: salePhoneNumber || '400-6276-880',
        });
      },
    },
  ].filter(Boolean) as MenuItem[];

  const handleMenuClick = (item: MenuItem) => {
    // 未登录，点击不做任何事情
    if (!isLogin()) return;

    const {url, onClick} = item;

    if (url) return Taro.navigateTo({url});

    if (onClick) return onClick();
  }

  const avatar = getAvatar(data);

  /** 几种状态
   * 1. 未登录
   * 2. 未认证
   * 3. 已认证
   *  a. 个人
   *  b. 企业
   *  c. 证件失效，立即更新 本期不做
   */
  return (
    <PageContent className={s.root} header="个人中心" transparentHeader>
      <TouchableView
        className={s.user_wrap}
        onClick={async () => {
          if (isLogin()) {
            await Taro.navigateTo({url: '/packages/user-center/user-info/index'})
          } else {
            toLoginDirectly();
          }
        }}
      >
        <Avatar type={avatar}/>
        {isLogin() ? (
          <TouchableView className={s.info}>
            {status !== authStatusEnum.AUTHENTICATED ? (
              <View className={s.authentication}>
                <Text className={s.hi}>
                  Hi~
                  <Text
                    className={s.text}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      await Taro.navigateTo({url: '/packages/user-center/merchant-approve/auth-type/index'});
                    }}
                  >
                    立即认证
                  </Text>
                </Text>
                <Image src={arrowRight} height={22} width={22}/>
              </View>
            ) : (
              <View className={s.nameWrap}>
                <Text className={s.name}>{agentName}</Text>
                <Image src={arrowRight} height={22} width={22}/>
              </View>
            )}
            <View className={s.phoneWrap}>
              <Text className={s.tel}>{phoneNumber}</Text>
              <View className={s.line}></View>
              {getActivityTag(activityType, level)}
            </View>
          </TouchableView>
        ) : (
          <View className={s.unLogin}>
            <View className={s.hello}>你好！</View>
            <View className={s.toLogin}>
              登录/注册
              <View className={s.icon}>
                <Image src={arrowRight} height={22} width={22}/>
              </View>
            </View>
          </View>
        )}
      </TouchableView>

      <View className={s.menu}>
        {MENUS.map((item, idx) => {
          let {title, icon, tip} = item;

          // if (!isLogin()) tip = '请登录';

          return (
            <TouchableView
              className={s.menu_item}
              key={idx}
              onClick={() => handleMenuClick(item)}
            >
              <Image src={icon} width={24} height={24}/>
              <Text className={s.title}>{title}</Text>
              <Text className={s.extra_tip}>{tip}</Text>
              <Icon className={s.arrow} type="arrow-right"/>
            </TouchableView>
          );
        })}
      </View>
    </PageContent>
  )
}
