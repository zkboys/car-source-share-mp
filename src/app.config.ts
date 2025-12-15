export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/detail/index',
    'pages/user-center/index',
    'pages/login/index',
    'pages/upload-file/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },

  tabBar: {
    color: '#4E5969',
    selectedColor: '#165DDB',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    // 注意：tabBar 在 @/common/setTheme函数中有关于主题的设置
    list: [
      {
        pagePath: 'pages/home/index',
        selectedIconPath: 'images/home-active.png',
        iconPath: 'images/home.png',
        text: '首页',
      },
      {
        pagePath: 'pages/user-center/index',
        selectedIconPath: 'images/user-active.png',
        iconPath: 'images/user.png',
        text: '个人中心',
      },
    ],
  },
})
