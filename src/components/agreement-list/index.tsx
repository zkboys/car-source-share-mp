import {
  privacyOssUrl,
  taxOssUrl,
  fetchAgentBaseInfo,
  fetchQueryPersonCenter,
  Person,
  AgentBaseInfo,
  agencyOssUrl,
} from '@/api';
import {useState, useEffect} from 'react';
import {View} from '@tarojs/components';
import {authStatusEnum, agentTypeEnum} from '@/enums';
import {Agreement} from '@rc-lib/mp';
import c from 'classnames';
import s from './index.module.less';

export type AgreementProps = {
  className?: string;
};

export function AgreementList(props: AgreementProps) {
  const {className} = props;

  const [info, setInfo] = useState<Person & AgentBaseInfo>();
  const {status = authStatusEnum.AUTHENTICATED, agentType} = info || {};
  const authed = status === authStatusEnum.AUTHENTICATED;
  const isPersonal = agentType === agentTypeEnum.PERSONAL;

  useEffect(() => {
    (async () => {
      const kycInfo = await fetchAgentBaseInfo();
      const userInfo = await fetchQueryPersonCenter();
      setInfo({...(kycInfo || {}), ...(userInfo || {})});
    })();
  }, []);

  if (!authed) return;

  const renderContent = () => {
    if (isPersonal) {
      return (
        <>
          查看<Agreement url={taxOssUrl}>《代征税款服务协议》</Agreement>和
          <Agreement url={privacyOssUrl}>《个人信息处理授权书》</Agreement>
        </>
      );
    }

    return (
      <>
        查看 <Agreement url={agencyOssUrl}>《CoGoLinks跨境支付代理合作协议》</Agreement>
      </>
    );
  };

  return <View className={c(s.root, className)}>{renderContent()}</View>
}
