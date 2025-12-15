/* eslint-disable */
const ci = require('miniprogram-ci');
const path = require('path');
const projectConfig = require('../project.config.json');
const projectPath = path.join(__dirname, '..', 'dist');
const privateKeyPath = path.join(__dirname, '..', 'deploy', 'private.key');

(async () => {
  const project = new ci.Project({
    appid: projectConfig.appid,
    type: 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores: ['node_modules/**/*'],
  });

  const res = await ci.upload({
    project,
    version: '1.0.{{BUILD_ID}}',
    // desc: `脚本 在 ${formatDate()} 提交上传，分支：{{GIT_BRANCH}}，已将生产配置同步到开发，可直接提审`,
    desc: `脚本 在 ${formatDate()} 提交上传，分支：{{GIT_BRANCH}}`,
    setting: {
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
    },
    onProgressUpdate: console.log,
  });
  console.log('🎉 上传成功:', res);
  process.exit(0);
})();

function formatDate(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  const map = {
    yyyy: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    dd: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    SSS: String(d.getMilliseconds()).padStart(3, '0'),
  };

  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (match) => map[match]);
}
