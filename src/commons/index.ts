import Taro from '@tarojs/taro';
import {eventBus, getCurrentPagePath, setLoginUser, setToken,} from '@rc-lib/mp';

export const LOGIN_PATH = '/pages/login/index';
export const HOME_PATH = '/pages/home/index';
export const USER_CENTER_PATH = '/pages/user-center/index';
export const UPLOAD_FILE_PATH = '/pages/upload-file/index';
export const APPROVAL_SHARE_PATH = '/packages/withdraw-cash/withdraw-approve-share/index';
export const CLEAR_LOGIN_STATUS_MESSAGE_KEY = '__clear_login_status_message__';

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

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getCompanyId(): string {
  return Taro.getStorageSync('companyId') || '359232';
}
