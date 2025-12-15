import {createEnum, PickEnumValues} from '@rc-lib/enum';

export const telPrefixEnum = createEnum({
  CN: ['CN', '+86'],
  HK: ['HK', '+852'],
});

export type telPrefixType = PickEnumValues<typeof telPrefixEnum>;

// 手机号校验提示
export const TEL_VALIDATE_MESSAGE = {
  [telPrefixEnum.CN]: {
    reg: /^1\d{10}$/,
    requiredMessage: '请输入大陆手机号码',
    formatMessage: '请输入正确的大陆手机号码',
  },
  [telPrefixEnum.HK]: {
    reg: /^\d{8}$/,
    requiredMessage: '请输入香港手机号码',
    formatMessage: '请输入正确的香港手机号码',
  },
};

/**
 * 发票审核状态
 */
export const receiptStatusEnum = createEnum({
  AUDITING: ['0', '审核中', {color: '#2CB4F3', backgroundColor: '#e9f7fd'}],
  SUCCESS: ['1', '审核通过', {color: '#00c98c', backgroundColor: '#e5faf4'}],
  REJECTED: ['2', '审核拒绝', {color: '#f53f3f', backgroundColor: '#feecec'}],
});

export type ReceiptStatus = PickEnumValues<typeof receiptStatusEnum>;
/**
 * 图片来源
 */
export const picSourceEnum = createEnum({
  CAMERA: ['camera', '拍照'],
  ALBUM: ['album', '从相册选择'],
});

/**
 * 场景类型
 */
export const sceneTypeEnum = createEnum({
  LOGIN: ['00', '登录'],
  SING_IN: ['01', '注册'],
  MODIFY_PHONE: ['02', '修改登录手机号'],
});

export type SceneType = PickEnumValues<typeof sceneTypeEnum>;

/**
 * 活动类型
 */
export const activityTypeEnum = createEnum({
  ACTIVATION_REWARD: ['00', '激活奖励'],
  WATER_REBATE: ['01', '流水返佣'],
});

export type ActivityType = PickEnumValues<typeof activityTypeEnum>;

/**
 * 主题
 */
export const themeEnum = createEnum({
  DEFAULT: ['', '默认主题'],
  ACTIVATE: ['activate-theme', '激活奖励'],
  COMMISSION: ['commission-theme', '流水返佣'],
});

export type ThemeType = PickEnumValues<typeof themeEnum>;

/**
 * 认证类型
 */
export const agentTypeEnum = createEnum({
  PERSONAL: ['00', '个人'],
  COMPANY: ['01', '企业'],
});

export type AgentType = PickEnumValues<typeof agentTypeEnum>;

/**
 * OCR图片类型
 */
export const ocrImgTypeEnum = createEnum({
  FRONT: ['00', '身份证正面'],
  BACK: ['01', '身份证反面'],
  BUSINESS: ['02', '营业执照'],
});

export type OcrImgType = PickEnumValues<typeof ocrImgTypeEnum>;

/**
 * 账户类型
 */
export const accountTypeEnum = createEnum({
  FOR_PUBLIC: ['00', '对公'],
  FOR_PRIVACY: ['01', '对私'],
});

export type AccountType = PickEnumValues<typeof accountTypeEnum>;

/**
 * 证件类型
 */
export const idCardTypeEnum = createEnum({
  ID_CARD: ['00', '大陆身份证'],
  BUSINESS_LICENSE: ['01', '营业执照'],
});

export type IdCardType = PickEnumValues<typeof idCardTypeEnum>;

/**
 * 性别
 */
export const sexEnum = createEnum({
  MALE: ['00', '男'],
  FEMALE: ['01', '女'],
  COMPANY: ['02', '企业'],
});

export type Sex = PickEnumValues<typeof sexEnum>;

/**
 * 认证状态
 */
export const authStatusEnum = createEnum({
  NOT_CERTIFIED_YET: ['00', '未认证'],
  AUTHENTICATED: ['01', '已认证'],
  AUTHENTICATION_FAILURE: ['02', '认证失败'],
});

export type AuthStatus = PickEnumValues<typeof authStatusEnum>;

/**
 * 通知类型
 */
export const noticeTypeEnum = createEnum({
  AUTHENTICATED: ['0', '未实名认证', {redirectPath: '/packages/user-center/merchant-approve/auth-type/index'}],
  LEVEL_UP: ['1', '激活奖励活动：活动等级升级', {redirectPath: '/packages/reward-manage/index'}],
  ADD_ACTIVATION_REWARD: [
    '4',
    '激活奖励活动：新增成功激活',
    {redirectPath: '/packages/invite-merchant-manage/index'},
  ],
  ADD_COMMISSION: ['6', '流水返佣活动：新增成功激活', {redirectPath: '/packages/invite-merchant-manage/index'}],
});

/**
 * 邀请状态
 */
export const inviteStatusEnum = createEnum({
  ALL: ['', '全部'],
  INVITING: ['0', '激活中'],
  SUCCESS: ['1', '激活成功'],
  FAIL: ['2', '激活失败'],
});
export type InviteStatusType = PickEnumValues<typeof authStatusEnum>;


/**
 * 绑定状态
 */
export const bindingStateEnum = createEnum({
  BOUND: ['00', '已绑定'],
  UNBOUND: ['01', '已解绑'],
});
export type bindingStateType = PickEnumValues<typeof bindingStateEnum>;


/**
 * 商户认证状态
 */
export const merchantAuditStatusEnum = createEnum({
  AUIT_NO: ['AUIT_NO', '待认证'],
  AUIT_ING: ['AUIT_ING', '认证中'],
  AUIT_SUCC: ['AUIT_SUCC', '认证成功'],
  AUIT_FAIL: ['AUIT_FAIL', '认证失败'],
});

/**
 * 销售分配状态
 */
export const saleDistributionStatusEnum = createEnum({
  NOT_ALLOCATION: ['00', '未分配'],
  USER_MANUAL_INPUT: ['01', '用户手动填写'],
  SYS_AUTO_ALLOCATION: ['02', '系统自动分配(跳过输入邀请码)'],
  OPERATE_MANUAL_ALLOCATION: ['03', '运营更改销售'],
  SALE_QR_CODE: ['04', '销售分享二维码']
});
export type SaleAllocationMethodType = PickEnumValues<typeof saleDistributionStatusEnum>;

/**
 * 业务类型
 */
export const plateFormEnum = createEnum({
  FOREIGN_TRADE: ['foreignTrade', '外贸收款'],
  PLATFORM: ['platform', '平台收款'],
});
export type plateFormType = PickEnumValues<typeof plateFormEnum>;
