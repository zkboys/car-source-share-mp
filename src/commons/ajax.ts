import config from '@/config';
import {toLogin} from '@/commons/index';
import {Ajax, getToken, isLogin, uuid} from '@rc-lib/mp';

export const TOKEN_KEY = 'market-AuthCode';

const ajax = new Ajax({
  baseUrl: config.baseUrl,
  timeout: config.timeout,
  beforeRequest: (cfg, options: any) => {
    if (!cfg.header) cfg.header = {};

    // 后端token
    cfg.header[TOKEN_KEY] = getToken();

    // 有些接口登录、未登录都可访问，添加 noAuth 前缀
    if (options?.noAuth && !isLogin()) {
      cfg.url = cfg.url.replace(config.baseUrl, `${config.baseUrl}/noAuth`);
    }
    return cfg;
  },
  afterResponse: (response) => {
    return dealResponse(response, false);
  },
});

export default ajax

export async function dealResponse(response, toJson?: boolean) {
  await convertCodeMessage(response);
  let {statusCode, data} = response;
  if (toJson) data = JSON.parse(data);

  if (statusCode === 200) {

    if (typeof data !== 'object' || Array.isArray(data)) return data;

    // 后端接口没有统一规范，可能需要写多个拦截
    if ('code' in data && ![200, '000000'].includes(data.code)) throw data;

    return data;
  }

  if (statusCode === 401) return toLogin();
  if (statusCode === 404) throw new Error('您访问的资源不存在');
  if (statusCode === 403) throw new Error('您无权访问');
  if (statusCode === 405) throw new Error(data?.message || '权限不支持，请联系管理员处理!');
  if (statusCode === 598) throw new Error('操作过于频繁，请稍候重试');
  if (statusCode >= 500) throw new Error('系统繁忙，请稍后再试');

  throw data;
}

async function convertCodeMessage(res) {
  const url = res?.requestUrl;
  if (!url) return res;

  if (!url.includes('/v6/')) return res;
  if (!res.data?.code) return;
  if (typeof res.data !== 'object') return res;
  if (Array.isArray(res.data)) return res;
  if (['000000', '999998', '401', 401].includes(res.data.code)) return res;

  const params = {
    sysId: 'cogo-agent-mp',
    reqNo: uuid(),
    data: {
      responseCode: res.data.code,
      responseMsg: res.data.message,
      interfaceUrl: url,
    },
  };

  const response = await ajax.post('/api/pcc/v1/common/code-international', params);
  const {responseCode, responseMsg} = response?.data || {};

  res.data.code = responseCode;
  res.data.message = responseMsg;

  return res;
}
