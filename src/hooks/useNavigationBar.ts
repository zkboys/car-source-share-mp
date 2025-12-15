import {getWindowInfo, getMenuButtonBoundingClientRect} from '@tarojs/taro';
import {useEffect, useState} from 'react';

export interface NavigateBarInfoProps {
  height: number
  top: number
  px: number,
  textHeight: number
}

export const useNavigationBar = () => {
  const [navigationBarInfo, setNavigationBarInfo] = useState<NavigateBarInfoProps>({
    height: 0,
    top: 0,
    px: 0,
    textHeight: 0
  });

  useEffect(() => {
    initNavigationBar();
  }, []);

  const initNavigationBar = () => {
    const systemInfo = getWindowInfo();
    // 胶囊按钮位置信息
    const menuButtonInfo = getMenuButtonBoundingClientRect();
    // 手机系统状态栏高度
    const statusBarHeight = systemInfo.statusBarHeight ?? 44;
    // 状态栏到胶囊的间距
    const menuButtonStatusBarGap = menuButtonInfo.top - statusBarHeight;
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    const navBarHeight = menuButtonStatusBarGap * 2 + menuButtonInfo.height + statusBarHeight;

    const paddingX = systemInfo.screenWidth - menuButtonInfo.right;

    setNavigationBarInfo(
      {
        height: navBarHeight,
        top: statusBarHeight + menuButtonStatusBarGap,
        px: paddingX,
        textHeight: menuButtonInfo.height
      }
    );

  }

  return navigationBarInfo || {};
}
