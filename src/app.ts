import {PropsWithChildren} from 'react'
import {useLaunch} from '@tarojs/taro'
import './theme.scss';
import './app.scss'
import '@rc-lib/mp/es/style';

function App({children}: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}


export default App
