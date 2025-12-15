import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';

// 默认分享信息
const defaultAppShare = {
  title: '欢迎加入我们！',
  path: '/pages/login/index',
  imageUrl: 'https://oss-ali-pub-prod.cogolinks.com/20241022103433311_11051_83_6f0bff42fbb6531_10080001227.jpg'
};

const defaultTimelineShare = {
  title: '欢迎加入我们！享受全方位支持与丰厚收益回报，一起成长共赢～',
  query: '/pages/login/index',
};

export function useShare() {
  useShareAppMessage(() => defaultAppShare);
  useShareTimeline(() => defaultTimelineShare);
}
