import Taro from "@tarojs/taro";
import {Empty, TouchableView, useFunction} from "@rc-lib/mp";
import {View} from "@tarojs/components";
import {ArrowRight} from '@taroify/icons';
import {NoticeItem} from "@/pages/home/types";
import {noticeTypeEnum} from "@/enums";
import s from './index.module.scss';

export function NoticeCard(props: any) {
  const {data} = props;

  const handleToDo = (item: NoticeItem) => {
    const url = noticeTypeEnum.getItem(item.type)?.redirectPath;
    Taro.navigateTo({url});
  };

  const renderContent = useFunction(() => {
    if (!data?.length) return <Empty
      src="https://oss-ali-pub-prod.cogolinks.com/20250827135725518_20145_61_29179f6de5183a1_10080002102.png"
      className={s.empty}/>;

    return (
      <View className={s.list}>
        {
          data?.map((item: NoticeItem, idx) => {
            return (
              <TouchableView
                key={idx}
                onClick={() => handleToDo(item)}
              >
                <View className={s.i_top}>
                  <View className={s.i_title}>{item.title}</View>
                  <View>
                    {item.type === noticeTypeEnum.AUTHENTICATED ?
                      <View className={s.action}>去处理</View> :
                      <ArrowRight className={s.arrow}/>}
                  </View>
                </View>
                {item.content && <View className={s.i_desc}>{item.content}</View>}
              </TouchableView>
            )
          })
        }
      </View>
    );
  });

  return <View className={s.root}>
    <View className={s.title}>重要通知</View>
    {renderContent()}
  </View>
}
