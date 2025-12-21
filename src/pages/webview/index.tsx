import {WebView} from '@tarojs/components';
import {useRouter} from '@tarojs/taro';

export default function WebViewPage() {
  const router = useRouter();
  const {id} = router.params;
  const baseUrl = 'http://m.ktccar.cn';
  const url = `${baseUrl}/${id}`;

  return <WebView src={url}/>
}

