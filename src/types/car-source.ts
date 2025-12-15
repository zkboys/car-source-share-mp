// 公司信息
export type Company = {
  companyId: string;
  companyName: string;
  companyNameEn?: string;
  logo: string;
};

// 汽车来源
export type CarSource = {
  id: string | number;
  /** 图片 */
  carPhoto?: string[];
  /** 品牌 */
  brand: string;
  /** 名称 */
  title: string;
  /** 指导价 */
  guidePrice: string;
  /** 优惠金额 */
  discountAmount?: number;
  /** 出口方式 */
  exportMethod: string;
  /** 出口价 */
  exportPrice: string;
  /** 颜色 */
  color: string;
  /** 提车类型 比如 现车 */
  deliveryType: string;
  /** 可提车城市 */
  deliveryCity: string;
  /** 保险类型 */
  insuranceType: string;
  /** 微信二维码图片 */
  weChat: string;
  /** 联系人姓名 */
  contact: string;
  /** 联系人手机号 */
  number: string;
  /** 创建时间 */
  createTime?: string;
  /** 公众号二维码 */
  WeChatQRcode?: string;
  /** 车辆配置 */
  vehicleConfiguration?: string;
  /** 车架号 */
  VIN?: string;
};

// 筛选下拉项类型
export type DropdownSelectItemType = {
  key: string;
  title: string;
  multiple?: boolean;
  children?: DropdownSelectItemType[];
};

// 筛选值类型
export type DropdownValueType = {
  sorter: string;
  brand: string[];
  source: string[];
  deliveryType: string[];
};
