import { JSEncrypt } from 'jsencrypt';

// 前端私钥，用于解密
let PRIVATE_KEY =
  'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJEBdVVRmVdGs6PZDUOjqTDBeDTTn4RC83T1DGvbueSMLE0n0lKgOr3VPhjSDdTi3ng4mIaOcnuD2tgc/5Xy+DXUrb+ULsg/ow7BBF6pKF0+KOLa2YNhZre6YT1YAcYc8P6lJrKSDXGgk39NFbdB67e4C1HfLHAaSLzu3PlSODzrAgMBAAECgYA8YioVNFyxnmySL4G5h/6dogNHpFSKBENTkfPxOlfH16NfIdUQuU6c3J72QQqney3/TDof1lPQIZFRa4n3TG2VfoJMWt45dUCrgUcqArAQocRwT1Rzhv3TrEiEwaz66yjYdBy3yRWOIKqmvtR6zH7vXsNqdj3uekAbeIPWgrPz0QJBAP2aDQ7Wfr//E/ocDhQsv4qinQmU0FQPs0zY1w0kX0TBcfxPHrSkasRWjLJFQGBiog6TlIUcxeBIndRidNmL30MCQQCSYIFUHt3h47PrBmnpDvvHWDbeByWN5Qx+dAZng9d2ypxc2ZrO563BBK4mzhXSieu01FJoxntZ4QAAar+xrG05AkEAnAStaeZ+PiJwqNufsbvB70mRsTZTYJP0LB/vVc99qPAV7zLB4kKQyM+yaW5/Z4zmxG743VfRSOWD7AjSeJA7vwJAJby7mvRaP+J0gCMnKu6x+rLDcnplNC/ZCMDg5c8XvYh+x3FSeAVCxoBuZZK8DYuBOR2EIX8KTiGz3menBCdwAQJAIPom0IMU5JeYGkOJlPAplrzjrVq95Z+uUVNqF8TlFXbdpuOh1IDpdYDav6JFG9PaWJ2evT/aeFLp9shz3CoMzA==';


// 后端公钥，用于加密
const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVw3syGPKErJQI/DWX6A7ZzbClbGCOf7FrwQqVXgfMAXAzjKls/j6mufwSTl/Tso8oRtOrJZCV5v2J3yVE25Rs3HbGrTot2x2RzHyhjXas25WPmZA9SHK9PfCNBHMTUZYBLzwRpR9HAr9Ze2g3HuYKeDIC+WLlxQAUapAZyGxjeQIDAQAB';

/**
 * 加密函数
 * @param str
 * @returns {string | false}
 */
export function encrypt(str: string): string | boolean {
  const encrypt = new JSEncrypt();

  encrypt.setPublicKey(PUBLIC_KEY);

  return encrypt.encrypt(str);
}

/**
 * 解密函数
 * @param val
 * @param jsonParse
 * @returns {any}
 */
export function decrypt(val: string, jsonParse = true) {
  const encrypt = new JSEncrypt();

  encrypt.setPrivateKey(PRIVATE_KEY);
  const str = encrypt.decrypt(val);

  if (!str) return str;

  return jsonParse ? JSON.parse(str) : str;
}
