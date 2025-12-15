import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ReactNode, useState } from 'react';
import './index.scss';

export type ContactDialogProps = {
  className?: string;
  contact?: string;
  number?: string;
  weChat?: string;
  children: ReactNode;
};

export function ContactDialog(props: ContactDialogProps) {
  const { contact, number, weChat, children, className } = props;
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleCall = () => {
    if (number) {
      Taro.makePhoneCall({
        phoneNumber: number,
      });
    }
  };

  const handlePreviewImage = () => {
    if (weChat) {
      Taro.previewImage({
        urls: [weChat],
        current: weChat,
      });
    }
  };

  return (
    <>
      <View className={`contact-trigger ${className || ''}`} onClick={handleClick}>
        {children}
      </View>

      {visible && (
        <View className="contact-dialog__overlay" onClick={handleClose}>
          <View className="contact-dialog" onClick={(e) => e.stopPropagation()}>
            <View className="contact-dialog__header">
              <Text className="contact-dialog__title">联系方式</Text>
              <View className="contact-dialog__close" onClick={handleClose}>
                ✕
              </View>
            </View>
            <View className="contact-dialog__content">
              {(contact || number) && (
                <View className="contact-dialog__phone" onClick={handleCall}>
                  <Text className="contact-dialog__contact-name">{contact || '联系人'}</Text>
                  <Text className="contact-dialog__number">{number}</Text>
                </View>
              )}
              {weChat && (
                <View className="contact-dialog__wechat">
                  <Text className="contact-dialog__label">微信二维码</Text>
                  <Image
                    className="contact-dialog__qrcode"
                    src={weChat}
                    mode="aspectFit"
                    onClick={handlePreviewImage}
                  />
                  <Text className="contact-dialog__tip">长按识别或点击放大</Text>
                </View>
              )}
            </View>
            <View className="contact-dialog__footer">
              <View className="contact-dialog__btn" onClick={handleClose}>
                我知道了
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
