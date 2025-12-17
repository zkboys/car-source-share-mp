import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ReactNode, useState } from 'react';
import s from './index.module.scss';

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
      <View className={`${s.trigger} ${className || ''}`} onClick={handleClick}>
        {children}
      </View>

      {visible && (
        <View className={s.overlay} onClick={handleClose}>
          <View className={s.dialog} onClick={(e) => e.stopPropagation()}>
            <View className={s.header}>
              <Text className={s.title}>联系方式</Text>
              <View className={s.close} onClick={handleClose}>
                ✕
              </View>
            </View>
            <View className={s.content}>
              {(contact || number) && (
                <View className={s.phone} onClick={handleCall}>
                  <Text className={s.contactName}>{contact || '联系人'}</Text>
                  <Text className={s.number}>{number}</Text>
                </View>
              )}
              {weChat && (
                <View className={s.wechat}>
                  <Text className={s.label}>微信二维码</Text>
                  <Image
                    className={s.qrcode}
                    src={weChat}
                    mode="aspectFit"
                    onClick={handlePreviewImage}
                  />
                  <Text className={s.tip}>长按识别或点击放大</Text>
                </View>
              )}
            </View>
            <View className={s.footer}>
              <View className={s.btn} onClick={handleClose}>
                我知道了
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
