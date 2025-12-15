import merge from 'lodash/merge';
import { envEnum } from './env-enum';
import { getEnv } from '@rc-lib/mp';
import { Config } from '@/config/types';
import defaultConfig from './default';
import developConfig from './develop';
import trialConfig from './trial';
import releaseConfig from './release';

const envConfig = {
  // 开发（本机）环境配置
  [envEnum.DEVELOP]: developConfig,
  // 预览（测试）环境配置
  [envEnum.TRIAL]: trialConfig,
  // 发布（生产）环境配置
  [envEnum.RELEASE]: releaseConfig,
}[getEnv()];

const config = merge({}, defaultConfig, envConfig);

export default config as Config;
