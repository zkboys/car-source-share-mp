import {PageContent} from "@rc-lib/mp";
import s from './index.module.scss';
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";

export default function Home() {

  const items = [
    {
      id: '359232',
      title: '卡泰驰',
      subTitle: '海尔集团旗下的汽车产业互联网平台',
      desc: '卡泰驰是海尔卡奥斯做深做专汽车工业互联网的具体平台和载体，通过三大业务布局，为用户提供定制化、标准化、生态化的场景解决方案',
    }
  ];

  return (
    <PageContent
      header="车源分享"
      className={s.root}
    >
      {items.map(item => {
        const {id, title, subTitle, desc} = item;

        const handleClick = async () => {
          await Taro.navigateTo({url: `/pages/webview/index?id=${id}`});
        };

        return (
          <View key={id} className={s.item} onClick={handleClick}>
            <View className={s.title}>
              {title}
              <View className={s.subTitle}>{subTitle}</View>
            </View>
            <View className={s.desc}>{desc}</View>
          </View>
        );
      })}
    </PageContent>
  );
}
