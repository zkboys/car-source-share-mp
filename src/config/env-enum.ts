import { createEnum, PickEnumValues } from '@rc-lib/enum';

export const envEnum = createEnum({
  DEVELOP: ['develop', '开发环境'],
  TRIAL: ['trial', '预览环境'],
  RELEASE: ['release', '生产环境'],
});
export type envType = PickEnumValues<typeof envEnum>;
