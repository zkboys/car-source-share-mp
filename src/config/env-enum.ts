import { createEnum, PickEnumValues } from '@rc-lib/enum';

export const envEnum = createEnum({
  DEVELOP: ['develop', '开发环境', { pcDomain: 'https://test-cn.cogolinks.com' }],
  TRIAL: ['trial', '预览环境', { pcDomain: 'https://test.cogolinks.com' }],
  RELEASE: ['release', '生产环境', { pcDomain: 'https://cn.cogolinks.com' }],
});
export type envType = PickEnumValues<typeof envEnum>;
