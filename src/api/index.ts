import ajax, {dealResponse, TOKEN_KEY} from '@/commons/ajax';

import {AjaxOptions, getToken, handleError, handleSuccess, LoadingResult, Toast} from '@rc-lib/mp';

import {
  AccountType,
  ActivityType,
  AgentType,
  AuthStatus,
  IdCardType,
  OcrImgType,
  ReceiptStatus,
  SceneType,
  Sex,
  SaleAllocationMethodType
} from "@/enums";
import Taro from "@tarojs/taro";
import config from "@/config";

/**
 * 手机号授权之后，code登录
 * @param params
 * @param options
 */
export async function fetchMiniLogin(params: {
  code: string,
  saleInviteCode?: string
}, options?: AjaxOptions): Promise<{
  token: string;
  activityType: ActivityType;
  exist: number;
  saleAllocationMethod: SaleAllocationMethodType;
}> {
  const res = await ajax.post('/v6/api/market/agent/client/mini-login', params, options);
  return res?.data || null;
}

/**
 * 原登录手机号验证码
 * @param params
 * @param options
 */
export async function fetchOriginPhoneCode(params: {
  phone: string,
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/sendSmsCode', params, options);
  return res?.data || null;
}

/**
 * 校验原登录手机号验证码
 * @param params
 * @param options
 */
export async function fetchCheckOriginPhoneCode(params: {
  phone: string,
  code: string,
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/verifySmsCode', params, options);
  return res?.data || null;
}

/**
 * 获取短信验证码
 * @param params
 * @param options
 */
export async function fetchSmsVerifyCode(params: {
  // graphicCode: string,
  // graphicKey: string,
  phone: string,
  sceneType: SceneType
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/getSmsVerifyCode', params, options);
  return res?.data || null;
}

export type AgentBaseInfo = {
  // 代理商活动类型00:激活奖励、01:流水返佣
  activityType: ActivityType,
  // 认证类型: 00-个人，01-企业
  agentType: AgentType,
  // 企业信息
  companyBaseInfoRes: {
    // 法人身份证背面图片
    backOssUrl: string,
    // 营业执照图片
    businessLicenceImgOssUrl: string,
    // 企业名称
    companyName: string,
    // 法人身份证正面图片
    fontOssUrl: string,
    // 详细地址
    fullAddr: string,
    // 法人证件号
    idCard: string,
    // 法人姓名
    name: string,
    // 注册地址
    registerAddr: string,
    // 统一社会信用代码
    socialCreditCode: string,
    // 纳税评级图片
    taxpayerCreditGradeImgOssUrl: string,
    // 营业执照有效期-结束日期
    businessLicenseEndDate: string,
    // 营业执照有效期-开始日期
    businessLicenseStartDate: string,
    // 法人身份证有效期-结束日期
    idCardEndDate: string,
    // 法人身份证有效期-开始日期
    idCardStartDate: string,
  },
  // 个人信息
  personBaseInfoRes: {
    // 身份证背面图片
    backOssUrl: string,
    // 身份证正面图片
    fontOssUrl: string,
    // 身份证号
    idCard: string,
    // 姓名
    name: string,
  },
};

/**
 * 获取用户基本信息
 * @param params
 * @param options
 */
export async function fetchAgentBaseInfo(params?: any, options?: AjaxOptions): Promise<AgentBaseInfo> {
  const res = await ajax.post('/v6/api/market/agent/client/queryAgentBaseInfo', params, options);
  return res?.data || null;
}

export type Person = {
  // 代理商活动类型 00:激活奖励、01:流水返佣
  activityType: ActivityType,
  // 代理商ID
  agentId: string,
  // 代理商类型 00 个人 01 企业
  agentType: AgentType,
  // 代理商邀请码
  agentInviteCode: string,
  // 代理商名称（个人/企业）
  agentName: string,
  // 身份证号-掩码
  idCardMask: string,
  // 证件类型：00：大陆身份证、01：营业执照
  idCardType: IdCardType,
  // 等级
  level: string,
  // 代理商手机号
  phoneNumber: string,
  // 销售名称
  saleName: string,
  // 销售手机号
  salePhoneNumber: string,
  // 性别：00：男、01：女、02：企业
  sex: Sex,
  // 统一社会信用代码掩码
  socialCreditCodeMask: string,
  // 认证状态 00:未认证、01:已认证、02:认证失败
  status: AuthStatus,
  // 销售分配方式
  saleAllocationMethod: SaleAllocationMethodType,
};

/**
 * 用户信息 个人中心
 * @param params
 * @param options
 */
export async function fetchQueryPersonCenter(params?: any, options?: AjaxOptions): Promise<Person> {
  const res = await ajax.post('/v6/api/market/agent/client/queryPersonCenter', params, options);
  return res?.data || {};
}

/**
 * 选择活动
 * @param params
 * @param options
 */
export async function fetchModifyAgentActivityType(params: { activityType: ActivityType }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/modifyAgentActivityType', params, options);
  return res?.data || null;
}

/**
 * 保存邀请码
 * @param params
 * @param options
 */
export async function fetchModifySaleNo(params: { saleInviteCode: string }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/modifySaleNo', params, options);
  return res?.data || null;
}

export type Invoice = {
  agentId: string,
  agentName: string,
  auditStatus: ReceiptStatus,
  auditStatusList: ReceiptStatus[],
  beginTime: string,
  createdDate: string,
  creater: string,
  endTime: string,
  id: number,
  invoiceName: string,
  invoiceNumber: string,
  lastUpdated: string,
  ossUrl: string,
  remark: string,
  updater: string,
  version: string
}

/**
 * 我的发票列表 详情直接使用列表数据
 * @param params
 * @param options
 */
export async function fetchQueryInvoices(params?: {
  auditStatusList?: ReceiptStatus[]
}, options?: AjaxOptions): Promise<Invoice[]> {
  const res = await ajax.post('/v6/api/market/agent/client/queryInvoices', params, options);
  return res?.data || null;
}

/**
 * 添加发票
 * @param params
 * @param options
 */
export async function fetchAddInvoice(params: { invoiceName: string, invoiceOssUrl: string }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/addInvoice', params, options);
  return res?.data || null;
}

/**
 * 修改个人基本信息
 * @param params
 * @param options
 */
export async function fetchPersonRealCertificate(params: {
  agentType: AgentType,
  fontOssUrl: string,
  backOssUrl: string,
  name: string,
  idCard: string,
  startDate: string, // YYYY-MM-DD
  endDate: string, // YYYY-MM-DD
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/personRealCertificate', params, options);
  return res?.data || null;
}

/**
 * 修改企业基本信息
 * @param params
 * @param options
 */
export async function fetchCompanyRealCertificate(params: {
  // 认证类型: 00-个人，01-企业
  agentType: AgentType,
  // 法人身份证背面图片
  backOssUrl: string,
  // 营业执照图片
  businessLicenceImgOssUrl: string,
  // 营业执照有效期-结束日期
  businessLicenseEndDate: string,
  // 营业执照有效期-开始日期
  businessLicenseStartDate: string,
  // 企业名称
  companyName: string,
  // 法人身份证正面图片
  fontOssUrl: string,
  // 详细地址
  fullAddr: string,
  // 法人证件号
  idCard: string,
  // 法人身份证有效期-结束日期
  idCardEndDate: string,
  // 法人身份证有效期-开始日期
  idCardStartDate: string,
  // 法人姓名
  name: string,
  // 注册地址
  registerAddr: string,
  // 统一社会信用代码
  socialCreditCode: string,
  // 纳税评级图片
  taxpayerCreditGradeImgOssUrl: string,
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/companyRealCertificate', params, options);
  return res?.data || null;
}

/**
 * OCR识别
 * @param params
 * @param options
 */
export async function fetchOcrIdentify(params: { imgOssUrl: string, imgType: OcrImgType }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/ocrIdentify', params, options);
  return res?.data || null;
}

/**
 * 个人、企业 添加银行卡
 * @param params
 * @param options
 */
export async function fetchAddBankCard(params: {
  // 银行账户名称
  accountName: string,
  // 账户类型 00:对公、01:对私
  accountType: AccountType,
  // 开户行地址 lbnkNm
  bankAddress: string,
  // 银行账号
  bankCard: string,
  // 开户银行名称  bnkNm
  bankName: string,
  // 联行行号  lbnkNo
  bankNumber: string,
  // 支行/网点名称  lbnkNm
  bankOutlets: string,
  // 开户行国家/地区 不传递
  bankRegion?: string,
  // 机构编码
  bnkBno?: string,
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/addBankCard', params, options);
  return res?.data || null;
}

export type Bank = {
  // 银行卡id
  bankCardId: string,
  // 银行卡号-掩码
  bankCardMask: string,
  // 开户行名称
  bankName: string,
  // 是否为实名后添加的第一张银行卡
  realAfterFirstBankCardFlag: string,
  // 是否绑定为结算卡 00:未绑定、01:已绑定（代表为奖励提现卡）
  settleCardFlag: string,
  // 银行编码
  bnkBno: string,
};

/**
 * 查询银行卡列表
 * @param params
 * @param options
 */
export async function fetchBankCardList(params?: any, options?: AjaxOptions): Promise<{ list: Bank[] | null, }> {
  const res = await ajax.post('/v6/api/market/agent/client/queryBankCardList', params, options);
  return res?.data || null;
}

export type CardBin = {
  // 发卡行名称
  bnkNm: string,
  // 发卡行行别
  bnkBnm: string,
  // 银行机构代码
  bnkBno: string,
  // 是否在18大行
  isInBigBnk: string,
  // 卡种(00:借记卡；01：贷记卡；02：预付费卡；04：准贷记卡)
  crdTyp: string,
  // 机构编码
  bnkCode: string,
  // 网联机构码
  unionCode: string,
  // 是否支持二要素付款(00：否，01：是)
  accFlag: string,
}

export async function fetchCardBin(params: { bankNo: string }, options?: AjaxOptions): Promise<CardBin> {
  const res = await ajax.post('/v6/api/market/agent/client/card-bin', params, options);
  return res?.data || null;
}

/**
 * 设为默认 （设为奖励提现卡）
 * @param params
 * @param options
 */
export async function fetchBindBankCard(params: { bankCardId: string }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/bindBankCard', params, options);
  return res?.data || null;
}

/**
 * 删除银行卡
 * @param params
 * @param options
 */
export async function fetchDelBankCard(params: { bankCardId: string }, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/delBankCard', params, options);
  return res?.data || null;
}

export type InterBank = {
  bnkCd: string; // "102"
  bnkNm: string; // "中国工商银行"
  lbnkCity: string; // "1100"
  lbnkCityNm: string; // "北京市"
  lbnkNm: string; // "中国工商银行股份有限公司北京万寿支行"
  lbnkNo: string; // "102100014736"
  lbnkProv: string; // "11"
  lbnkProvNm: string; // "北京市"
}

/**
 * 查询开户行信息
 * @param params
 * @param options
 */
export async function fetchInterBank(params: {
  // 银行编码
  bnkCd?: string,
  // 市编码
  lbnkCity?: string,
  // 关键字
  lbnkNm?: string,
  // 联行行号
  lbnkNo?: string,
  // 省编码
  lbnkProv?: string,
  // 每页展示条数（默认展示10条）
  pageNum: Number,
  // 页码数（默认第一页）
  pageSize: Number,
}, options?: AjaxOptions): Promise<{
  count: number;
  linkBankList: InterBank[];
}> {
  const res = await ajax.post('/v6/api/market/agent/client/inter-bank', params, options);
  return res?.data || null;
}

/**
 * 退出登录
 * @param params
 * @param options
 */
export async function fetchLogout(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/logout', params, options);
  return res?.data || null;
}

/**
 * 基于path 上传文件
 * @param params
 * @param options
 */
export async function fetchTaroUploadFile(params: { path: string }, options?: AjaxOptions): Promise<any> {
  const {withLoading = true} = options || {};

  return new Promise((resolve, reject) => {
    let loadingResult: LoadingResult | undefined;
    if (withLoading) {
      loadingResult = Toast.loading('正在加载');
    }
    const url = '/v6/api/market/agent/client/uploadFile';
    Taro.uploadFile({
      url: `${config.baseUrl}${url}`,
      filePath: params.path,  // chooseImage 返回的临时路径
      name: 'file',
      header: {
        [TOKEN_KEY]: getToken()
      },
      success: (res) => {
        try {
          const data = dealResponse({...res, requestUrl: url}, true);
          handleSuccess({successTip: options?.successTip!});
          resolve(data);
        } catch (err) {
          handleError({error: err, ...options});
          reject(err);
        }
      },
      fail: (err) => {
        handleError({error: err, ...options});
        reject(err);
      },
      complete: () => {
        if (withLoading && loadingResult) {
          loadingResult.close();
          loadingResult = undefined;
        }
      },
    });
  })
}

/**
 * 获取代理商出金信息
 * @param params
 * @param options
 */
export async function fetchAgentRewardData(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/queryAgentRewardData', params, options);
  return res?.data;
}

/**
 * 获取重要通知
 * @param params
 * @param options
 */
export async function fetchNotices(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/importantNotice', params, options);
  return res?.data?.notifyList || [];
}

/**
 * 获取邀请记录
 * @param params
 * @param options
 */
export async function fetchInvitationList(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/queryInvitedPerson', params, options);
  return res?.data?.invitedPersonList || [];
}

/**
 * 获取收益流水详情
 * @param params
 * @param options
 */
export async function fetchRewardDetail(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/queryRewardDetails', params, options);
  return res?.data?.rewardDetailsList || [];
}

/**
 * 修改绑定手机号
 * @param params
 * @param options
 */
export async function fetchModifyLoginPhone(params: {
  // 短信验证码
  authCode: string,
  // 手机号
  newPhone: string,
}, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/modifyLoginPhone', params, options);
  return res?.data || null;
}

/**
 * 获取手续费费率列表
 * @param params
 * @param options
 */
export async function fetchCollectFeeList(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/queryRebatePolicy', params, options);
  return res?.data?.serviceChargeRateList || [];
}

/**
 * 获取激活奖励升级详情
 * @param params
 * @param options
 */
export async function fetchLevelDetail(params?: any, options?: AjaxOptions) {
  const res = await ajax.post('/v6/api/market/agent/client/queryAgentLevel', params, options);
  return res?.data || {};
}

// 代征税款服务协议
export const taxOssUrl = 'https://oss-ali-pub-prod.cogolinks.com/20250414104820874_2792_83_a475b03ea00b211_10080002102.pdf';

// 隐私服务协议
export const privacyOssUrl = 'https://oss-ali-pub-prod.cogolinks.com/20241010140054880_26783_87_6b684b4251fe891_10080001227.pdf';

// 结行国际用户账户注册协议
export const signInOssUrl = 'https://oss-ali-pub-prod.cogolinks.com/20241009153916387_26783_84_6b1f14be33a6111_10080001227.pdf';

// CoGoLinks用户账户及服务账户收集个人资料声明
export const profileOssUrl = 'https://oss-ali-pub-prod.cogolinks.com/20241009153929140_20946_85_6b1f0d3fb0ed2b1_10080002102.pdf';

// CoGoLinks跨境支付代理合作协议
export const agencyOssUrl = 'https://oss-ali-pub-prod.cogolinks.com/20241010202144684_30571_79_6b7d08ee1175d91_10080002102.pdf';
