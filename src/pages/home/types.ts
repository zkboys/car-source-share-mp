export type NoticeItem = {
  title: string;
  content: string;
  type: string;
  level: number;
};

export type NoticeListProps = {
  data: NoticeItem[];
};

export type RewardInfo = {
  monthMerAccounted: number; // 本月商户入账
  merAccountedTotal: number; // 商户入账合计
  authSucc: number; // 已认证商户数
  contrastTodayAuthSucc: number; // 已认证商户-对比昨日
  invitationInSucc: number; // 已邀请商户数
  contrastTodayInvitationInSucc: number; // 已邀请商户-对比昨日
  pendingSettlementIncome: number; // 待结算收益
  accumulatedIncome: number; // 累计收益
  invitationSucc: number; // 已激活商户数
  contrastTodayInvitationSucc: number; // 已激活商户-对比昨日
  monthMerWithdrawalCumulative: number; // 本月商户出金
  merWithdrawalCumulative: number; // 商户出金合计
  accountMerCount: number; // 已入账商户
  contrastAccountMerCount: number; // 已入账商户-对比昨日
} | null;

export type ActivityProps = {
  notices: NoticeItem[];
  rewardInfo: RewardInfo;
  inviteCode: string;
  levelDetail: any
};

export type MerchantItem = {
  title: string;
  sum?: number;
  summary?: number;
};

export type MerchantStatisticsProps = {
  data: MerchantItem[];
  inviteCode: string;
  className?: string;
  btnClassName?: string;
  onClick?: () => void;
};

export type TopStatisticsProps = {
  data: (string | number)[];
  className?: string;
  onClick?: () => void;
};

export type IncomeItem = {
  title: string;
  sum?: number;
  src: string;
  ccy?: string;
};

export type TotalIncomeProps = {
  data: IncomeItem[];
  className?: string;
  onClick?: () => void;
};
