import {useState, useEffect} from "react";
import {View, Image, PageContainer} from "@tarojs/components";
import Taro from "@tarojs/taro";
import ajax from "@/commons/ajax";
import {JSEncryptDefault} from "@/commons";
import file_upload_icon from "@/images/file_upload_icon.svg";
import pdf_icon from "@/images/pdf_icon.svg";
import rar_icon from "@/images/rar_icon.svg";
import zip_icon from "@/images/zip_icon.svg";
import config from '@/config';
import "./index.scss";

const iconObj = {
  pdf: pdf_icon,
  rar: rar_icon,
  zip: zip_icon,
};

export default function UploadFile() {
  const [fileList, setFileList] = useState([]);
  const [showCon, setShowCon] = useState(false);
  const [codeParams, setCodeParams] = useState({});

  // 上传方法
  const fileUpload = async (res) => {
    const correctList = [];
    const errorList = [];
    try {
      Taro.showLoading({title: "文件正在上传中", mask: true});
      const maxSize = codeParams?.maxSize * 1024 * 1024;
      const allRes = await Promise.allSettled(
        res?.tempFiles?.map((it) => {
          console.log(it);
          return new Promise(async (resolve, reject) => {
            const fileName = it.name || it.path.replace("wxfile://", "");
            if (it.size > maxSize) return reject({error: "文件过大"});
            const fileType = fileName.slice(fileName.lastIndexOf(".") + 1);
            if (
              !(
                `${codeParams?.fileAccept || ""},${
                  codeParams?.imgAccept || ""
                }`.split?.(",") || []
              ).includes(fileType)
            )
              return reject({error: "文件格式错误"});
            Taro.uploadFile({
              url: `${config.merchantBaseUrl}/api/gateway/cuser/v6/wechat/applet/upload/file`,
              filePath: it.path,
              timeout: 60000,
              name: "multipartFile",
              header: {
                "content-type": "multipart/form-data",
              },
              formData: {
                key: JSEncryptDefault(codeParams.authKey),
                fileName,
              },
              success(response) {
                const {code, message} = JSON.parse(response?.data) || {};
                if ([200, '000000'].includes(code)) {
                  resolve({name: fileName, url: it.path, type: fileType});
                } else {
                  setCodeParams({error: true});
                  reject({error: message});
                }
              },
              fail() {
                reject({error: "网络异常"});
              },
            });
          });
        })
      );
      console.log(allRes);
      allRes.forEach((it) => {
        if (it.status === "fulfilled") {
          correctList.push(it.value);
        } else {
          errorList.push(it?.reason || {error: "网络超时"});
        }
      });
      setFileList([...fileList, ...correctList]);
    } catch (err) {
      console.error(err);
    } finally {
      const isErrorSome = errorList.every(
        (it) => it.error === errorList[0].error
      );
      Taro.hideLoading({
        complete: () => {
          if (errorList.length > 0) {
            const title = isErrorSome
              ? `${errorList[0].error}，${errorList.length}个文件上传失败`
              : `${errorList.length}个文件上传失败`;
            Taro.showToast({
              title: title,
              icon: "none",
              duration: 2500,
            });
          }
        },
      });
    }
  };

  // 选择相册文件
  const handleImage = (params) => {
    setShowCon(false);
    Taro.chooseImage({
      ...params,
      count: 10, //可选择文件数量
      sizeType: ["compressed"],
      success: fileUpload,
    });
  };

  // 选择聊天文件
  const handleMessageFile = (params) => {
    setShowCon(false);
    Taro.chooseMessageFile({
      ...params,
      count: 10, //可选择文件数量
      extension: codeParams?.fileAccept?.split(",") || [],
      success: fileUpload,
    });
  };

  // 用key获取配置参数
  const getCodeParams = async (key) => {
    try {
      if (!key) return setCodeParams({error: true});
      Taro.showLoading({mask: true});
      const res = await ajax.get("/api/gateway/cuser/v6/wechat/applet/get/param", {
        key: JSEncryptDefault(key),
      }, {baseUrl: config.merchantBaseUrl});
      if ([200, '000000'].includes(res?.code)) {
        setCodeParams({...(res?.data?.map || {}), authKey: key});
      } else {
        setCodeParams({error: true});
      }
    } catch (error) {
      setCodeParams({error: true});
    } finally {
      Taro.hideLoading();
    }
  };

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "上传订单附件",
    });
    const {router} = Taro.getCurrentInstance();
    getCodeParams(router.params?.scene);
  }, []);

  return (
    <View className="upload-file-container">
      <View className="upload-file-h1">上传订单附件</View>
      {codeParams?.error && (
        <View className="upload-file-error">
          小程序码已过期，请在电脑端重新扫码
        </View>
      )}
      {codeParams?.authKey && (
        <>
          <View className="upload-file-h2">{codeParams?.formLabel || ""}</View>
          <View className="upload-file-text">支持格式：</View>
          <View className="upload-file-text">
            {`${codeParams?.fileAccept || ""},${codeParams?.imgAccept || ""}`
              .replaceAll(",", "/")
              .toLocaleUpperCase()}
            格式，单个大小不超过{codeParams?.maxSize}MB
          </View>
          {fileList?.map((it) => {
            return (
              <View key={it.url} className="upload-file-item">
                <View className="upload-file-item-left">
                  {iconObj[it.type] ? (
                    <Image
                      src={iconObj[it.type]}
                      className="upload-file-item-left-icon"
                      mode="aspectFit"
                    />
                  ) : (
                    <Image
                      src={it.url}
                      className="upload-file-item-left-img"
                      mode="aspectFit"
                    />
                  )}
                </View>
                <View className="upload-file-item-right">{it.name}</View>
              </View>
            );
          })}
          <View className="upload-file-add" onClick={() => setShowCon(true)}>
            <Image src={file_upload_icon} className="upload-file-add-icon"/>
          </View>
        </>
      )}
      <PageContainer
        show={showCon}
        round
        onClickOverlay={() => setShowCon(false)}
      >
        <View
          className="upload-file-btn"
          onClick={() => handleImage({sourceType: ["camera"]})}
        >
          拍摄
        </View>
        <View
          className="upload-file-btn"
          onClick={() => handleImage({sourceType: ["album"]})}
        >
          从手机相册选择
        </View>
        <View
          className="upload-file-btn"
          onClick={() => handleMessageFile({type: "file"})}
        >
          聊天文件
        </View>
        {/* <View
          className="upload-file-btn upload-file-btn-no"
          onClick={() => handleMessageFile({ type: "image" })}
        >
          聊天图片
        </View> */}
        <View className="upload-file-cancel" onClick={() => setShowCon(false)}>
          取消
        </View>
      </PageContainer>
    </View>
  );
}
