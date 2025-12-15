import Taro, {getAccountInfoSync} from '@tarojs/taro';
import config from '@/config';
import {
  getToken,
  getCurrentPagePath,
  setToken,
  eventBus,
  setLoginUser,
  getLoginUser,
  hasPermission,
  isLogin
} from '@rc-lib/mp';
import dayjs from 'dayjs';
import {envType} from "@/config/env-enum";
import {ActivityType, activityTypeEnum, themeEnum} from "@/enums";
import {JSEncrypt} from "jsencrypt";

export const LOGIN_PATH = '/pages/login/index';
export const HOME_PATH = '/pages/home/index';
export const USER_CENTER_PATH = '/pages/user-center/index';
export const UPLOAD_FILE_PATH = '/pages/upload-file/index';
export const APPROVAL_SHARE_PATH = '/packages/withdraw-cash/withdraw-approve-share/index';
export const CLEAR_LOGIN_STATUS_MESSAGE_KEY = '__clear_login_status_message__';

export function getActivityType(): ActivityType {
  // 如果未登录，默认一个活动类型，否则首页不展示内容
  if (!isLogin()) return activityTypeEnum.WATER_REBATE;

  return Taro.getStorageSync('activityType');
}

export function setActivityType(activityType: ActivityType) {
  Taro.setStorageSync('activityType', activityType);
}

export function toHome(activityType: ActivityType = getActivityType()) {
  const lastPath = getLastPath();
  if (lastPath) {
    Taro.navigateTo({url: lastPath});
    // 用完清掉
    clearLastPath();
    return;
  }

  setActivityType(activityType);

  // 没有选择过类型，跳转选择类型页面
  if (!activityType) {
    Taro.navigateTo({url: '/packages/choose-activity-type/index'});
    return;
  }

  // 激活奖励
  if (activityType === activityTypeEnum.ACTIVATION_REWARD) {
    Taro.switchTab({url: '/pages/home/index'});
    return;
  }

  // 流水返佣
  if (activityType === activityTypeEnum.WATER_REBATE) {
    Taro.switchTab({url: '/pages/home/index'});
    return;
  }
}

export function clearLoginStatus() {
  setToken('');
  setLoginUser(null);
  eventBus.emit(CLEAR_LOGIN_STATUS_MESSAGE_KEY, null);
}

/**
 * 直接跳转登录页面，不提示，不过滤路径
 */
export function toLoginDirectly() {
  clearLoginStatus();

  Taro.navigateTo({url: LOGIN_PATH});
}

/**
 * 跳转登录页面，过滤路径
 */
export function toLogin() {
  clearLoginStatus();

  if ([LOGIN_PATH, HOME_PATH, USER_CENTER_PATH, UPLOAD_FILE_PATH].includes(`/${getCurrentPagePath()}`)) return;

  // 记录跳出时，页面地址
  setLastPath();

  toLoginDirectly();
}

export function setLastPath() {
  const path = `/${getCurrentPagePath()}`;
  if ([APPROVAL_SHARE_PATH].includes(path)) {
    const params = Taro.getCurrentInstance()?.router?.params;
    const lastPath = formatParams(path, params);
    Taro.setStorageSync('lastPath', lastPath);
  }
}

export function clearLastPath() {
  Taro.setStorageSync('lastPath', null);
}

export function getLastPath() {
  return Taro.getStorageSync('lastPath');
}

// 转换oss地址
export function formatOssUrl(url: string): string {
  if (!url?.startsWith('/oss-ali-prod_cogolinks_com') && !url?.startsWith('/oss-ali_cogolinks_com')) return url;

  const autoToken = getToken();
  const _str = url.replace(/^\/oss-ali-prod_cogolinks_com|^\/oss-ali_cogolinks_com/, '/cuser/base/file/oss');
  return config.baseUrl + _str + `?glcs-authcode=${autoToken}`;
}

/**
 * 基于参数，缓存函数调用结果
 * 注意：参数需要可以进行JSON.stringify
 */
export function cache<F extends (...args: any[]) => any>(fn: F) {
  let result: Record<string, ReturnType<F>> = {};
  const fetchFn = async function (...args: Parameters<F>): Promise<ReturnType<F>> {
    const key = JSON.stringify(args);
    if (result[key]) return result[key];
    result[key] = await fn(...args);
    // 如果有catch，则catch后删除缓存
    if (typeof result[key]?.catch === 'function') {
      result[key].catch(() => {
        Reflect.deleteProperty(result, key);
      });
    }
    return result[key];
  } as F & {
    cacheClean: (...args: any[]) => void;
  };
  fetchFn.cacheClean = (...args: any[]) => {
    if (args.length) {
      const key = JSON.stringify(args);
      delete result[key];
    } else {
      result = {};
    }
  };
  return fetchFn;
}

// 把对象转换为页面传参的?拼接格式
export const formatParams = (url: string, param: any) => {
  if (!(param && typeof param === 'object')) return url;
  const paramKeys = Object.keys(param).filter((it) => param[it] || param[it] === 0);
  if (!paramKeys?.length) return url;
  return `${url}?${paramKeys.map((it) => `${it}=${param[it]}`).join('&')}`;
};

export function uploadFileError(message = '您有上传失败文件，请删除或重新上传') {
  return {
    async validator(_, value) {
      if (!value) return;

      const val = Array.isArray(value) ? value : [value];
      if (val.some((item) => !!item.error)) throw Error(message);
      if (val.some((item) => !item.url)) throw Error(message);
    },
  };
}

/**
 * 判断是否是子账号
 * @returns {any}
 */
export function isSubAccount(): boolean {
  return getLoginUser()?.isSubAccount;
}

/**
 * 判断是否是新账号
 * @returns {any}
 */
export function isNewAccount(): any {
  return getLoginUser()?.isNewAccount;
}

export const getSubAccountVisitKey = () => {
  return 'SUB_ACCOUNT_VISIT_PAY_KEY_' + getLoginUser()?.id;
};

/**
 * 判断币种是否不需要小数点
 * @param {string} currency 币种
 * @returns {Boolean}
 */
export function noDecimalCurrency(currency): boolean {
  const ccys = Taro.getStorageSync('OVERALL_CURRENCY_MINIMUM_UNIT_CONFIG');
  return ccys?.includes?.(currency);
}

/**
 * 邮箱校验
 */
export function validatorEmail() {
  return {
    async validator(_, value?: string) {
      if (!value) return true;

      const emailReg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

      const spaceReg = /^\S*$/;

      if (!spaceReg.test(value)) throw Error('邮箱不允许输入空格');
      if (!emailReg.test(value)) throw Error('请输入正确的邮箱');

      return true;
    },
  };
}

export function validateLoginPass() {
  return {
    async validator(_, value?: string) {
      if (!value) return true;

      const reg = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,20}$/g;
      if (!reg.test(value)) throw Error('请使用8-20位的数字、大小字母、字符的任3种组合');

      return true;
    },
  };
}

/**
 * 数字是否相同、递增、递减
 * @param value
 * @returns {boolean}
 */
export function isSameOrContinuous(value) {
  if (/^(\d)\1+$/.test(value)) return true; // 6位相同数字

  // 6位数顺序递增
  let str = value.replace(/\d/g, ($0, pos) => parseInt($0) - pos);
  if (/^(\d)\1+$/.test(str)) return true;

  // 6位数顺序递减
  str = value.replace(/\d/g, ($0, pos) => parseInt($0) + pos);
  return /^(\d)\1+$/.test(str);
}

export function validatePayPass() {
  return {
    async validator(_, value) {
      if (!value) return true;
      const reg = /^\d{6}$/g;

      if (!reg.test(value)) throw new Error('请使用6位数字密码');
      if (isSameOrContinuous(value)) throw new Error('密码不能为六位连续数字或相同数字');

      return true;
    },
  };
}

// 格式化查询条件日期
export function formatParamsRangeDate(
  dates?: [dayjs.Dayjs | string, dayjs.Dayjs | string],
  format: string = 'YYYY-MM-DD',
  withTime: boolean = false,
) {
  if (!dates || !Array.isArray(dates) || dates.length !== 2) return [];

  try {
    const [startDate, endDate] = dates;
    if (!startDate || !endDate) return [];

    const timeSuffix = withTime
      ? {
        start: ' 00:00:00',
        end: ' 23:59:59',
      }
      : {
        start: '',
        end: '',
      };

    return [dayjs(startDate).format(format + timeSuffix.start), dayjs(endDate).format(format + timeSuffix.end)];
  } catch (error) {
    console.error('formatParamsRangeDate error:', error);
    return [];
  }
}

interface DecimalConfig {
  thousandSep?: boolean;
}

/**
 * 补全两位小数，如果数字小数位，2位以上，不处理
 */
export function completeTwoDecimal(value: number | string | null | undefined): string | number | null | undefined {
  const num = Number(value);

  const decimalPart = num?.toFixed(2)?.split('.')[1];

  if (decimalPart?.length > 2) return value;

  return num?.toFixed(2);
}

/**
 * 格式化数字，兼容 toLocaleString（千位符+指定位数）
 * @param {number|string} amount - 金额或数字
 * @param {number} digits - 保留小数位数
 * @returns {string}
 */
export function formatNumber(amount, digits = 2) {
  const num = Number(amount);

  // NaN
  if (num !== num) return amount;

  const fixed = num.toFixed(digits); // 保留小数位
  const parts = fixed.split('.');
  const integer = parts[0];
  const decimal = parts[1];

  // 千分位处理（用正则）
  const integerWithComma = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimal ? `${integerWithComma}.${decimal}` : integerWithComma;
}

/**
 * 基于币种保留两位小数 日元、韩元、印尼盾不保留两位小数
 */
export function completeTwoDecimalByCurrency(
  amount: number | string | null | undefined,
  currency?: string | null,
  configs?: DecimalConfig,
): string | number | null | undefined {
  if (!amount && amount !== 0) return amount;

  // 当前币种是否要展示小数点
  const isNoDecimal = noDecimalCurrency(currency);
  // 是否展示千分位分隔符
  const {thousandSep} = configs || {};

  if (thousandSep) {
    const digits = isNoDecimal ? 0 : 2;
    return formatNumber(amount, digits);
  } else {
    return isNoDecimal ? amount : completeTwoDecimal(amount);
  }
}

/**
 * 基于币种保留两位小数 日元、韩元、印尼盾取整 带千分位
 */
export function formatNumberThousand(
  value: number | string | null | undefined,
  currency?: string | null,
  needCurrency: Boolean = true,
): string | number | null | undefined {
  if (!value && value !== 0) return value;

  const num = completeTwoDecimalByCurrency(value, currency, {thousandSep: true});

  return num + ' ' + (needCurrency ? currency || '' : '');
}

/**
 * 渲染utc日期+时间
 * @param format
 */
export function renderDateTime(format = 'YYYY-MM-DD HH:mm:ss'): (value?: string | dayjs.Dayjs) => string {
  return (value: string | dayjs.Dayjs) => {
    if (!value) return '-';
    return dayjs(value).format(format);
  };
}

// 请求参数去除空值
export const formatParamsEmpty = (obj) => {
  const params = {};
  Object.keys(obj).forEach((it) => {
    if (obj[it]) params[it] = obj[it];
  });
  return params;
};

// url获取文件后缀
export const urlGetFileType = (url) => {
  if (typeof url !== 'string') return '';
  const urlSplits = url.split('.');
  return urlSplits[urlSplits.length - 1];
};

/**
 * 是否是合法登录密码
 * @param value
 * @returns {boolean}
 */
export const isLegalLoginPassword = (value) => {
  return /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,20}$/g.test(value);
};

export function getStorageInviteCode(): any {
  return Taro.getStorageSync('inviteCode');
}

export function setStorageInviteCode(inviteCode: string) {
  Taro.setStorageSync('inviteCode', inviteCode);
}

// 根据权限判断是否掩码
export function maskCode(permissions, text, {length = 4} = {}) {
  if (hasPermission(permissions)) return text;
  return Array(length).fill('*')?.join('');
}

/**
 * 是否是合法金额
 * @param value
 */
export const isLegalAmount = (value) => {
  return /^(0\.([1-9]\d?|0[1-9])|[1-9]\d*(\.\d{1,2})?)$/g.test(value);
};

// 新账户体系资金来源优先级
export const formatSourceFundPlatformTwoDimeOptions = (options: any[] = []) => {
  // 定义资金来源的优先级
  const priorityMap = {
    B2C: 0,
    B2B: 1,
    ACCOUNT_RECHARGE: 2,
    ACCOUNT_ACQUIRING: 3,
  };

  const arr: any[][] = [[], [], [], []];

  // 遍历 options，按业务类型分组
  options.forEach((item) => {
    const {accountBalanceAvailable, businessTypeEnum} = item;
    arr[priorityMap[item.businessTypeEnum]].push({
      ...item,
      preKey: businessTypeEnum,
      amount: accountBalanceAvailable,
    });
  });
  // 过滤掉空的子数组
  const filteredArr = arr.filter((subArray) => subArray.length > 0);

  // 按子数组第一个存在金额的排序
  filteredArr.sort((a, b) => {
    const firstAmountA = a[0].accountBalanceAvailable;
    const firstAmountB = b[0].accountBalanceAvailable;
    if (firstAmountA === 0) return 1; // 如果 a 的第一个金额为 0，排在后面
    if (firstAmountB === 0) return -1; // 如果 b 的第一个金额为 0，排在后面
    return 0; // 否则保持原顺序
  });

  return filteredArr;
};

export function setTheme(theme = getTheme()): void {
  Taro.setStorageSync('theme', theme);

  Taro.setTabBarItem({
    index: 0,
    selectedIconPath: theme === themeEnum.ACTIVATE ? 'https://oss-ali-pub-prod.cogolinks.com/20241010210518443_30571_80_6b7f697e446b621_10080002102.png' : 'https://oss-ali-pub-prod.cogolinks.com/20241012112838963_30571_86_6bfd1acf2567481_10080002102.png',
  })
  Taro.setTabBarItem({
    index: 1,
    selectedIconPath: theme === themeEnum.ACTIVATE ? 'https://oss-ali-pub-prod.cogolinks.com/20241010210621869_30571_87_6b7f7842b940951_10080002102.png' : 'https://oss-ali-pub-prod.cogolinks.com/20241012112841046_30571_83_6bfd1b4b5466a11_10080002102.png',
  })
  Taro.setTabBarStyle({
    selectedColor: theme === themeEnum.ACTIVATE ? '#FF5778' : '#1990FF',
  })
}

export function getTheme() {
  return Taro.getStorageSync('theme');
}

/**
 * 千分位格式化不带币种单位
 * @param value
 * @param digits
 * @returns
 */
export function formatAmount(value: any, digits = 2) {
  if (!value && value !== 0) return value;
  return formatNumber(value, digits);
}

/**
 * 千分位格式化
 * @param value
 * @param currency
 * @returns
 */
export function formatAmountWithCurrency(value: any, currency: any) {
  if (!value && value !== 0) return value;

  return formatNumber(value) + ' ' + currency;
}

export function getEnv(): envType {
  const accountInfo = getAccountInfoSync();
  return accountInfo?.miniProgram?.envVersion;
}

export function getOssUrl(privateUrl: string): string {
  if (!privateUrl) return privateUrl;
  return `${config.baseUrl}/api/market/agent/client/oss${privateUrl}?market-AuthCode=${getToken()}`
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @description 加密函数、用于加密字段
 * @param val
 * @returns {string}
 */
export const JSEncryptDefault = (val) => {
  let encrypt = new JSEncrypt();
  let publicKey =
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVw3syGPKErJQI/DWX6A7ZzbClbGCOf7FrwQqVXgfMAXAzjKls/j6mufwSTl/Tso8oRtOrJZCV5v2J3yVE25Rs3HbGrTot2x2RzHyhjXas25WPmZA9SHK9PfCNBHMTUZYBLzwRpR9HAr9Ze2g3HuYKeDIC+WLlxQAUapAZyGxjeQIDAQAB";
  encrypt.setPublicKey(publicKey);
  let JSEncryptString = encrypt.encrypt(val);
  return JSEncryptString;
};
