import {WebView} from '@tarojs/components';
import {useRouter} from '@tarojs/taro';
import {useEffect, useState} from 'react';

export default function WebViewPage() {
  const router = useRouter();
  // const [url, setUrl] = useState('http://m.ktccar.cn/359232');
  const [url, setUrl] = useState('http://localhost:5174/359232');

  useEffect(() => {
    // 如果通过路由参数传递了 URL，使用传递的 URL
    if (router.params?.url) {
      setUrl(decodeURIComponent(router.params.url));
    }
  }, [router.params]);

  return <WebView src={url}/>
}

