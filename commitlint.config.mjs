export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    'type-enum': [0], // 关闭 type 检查
    'type-empty': [0], // 允许 type 为空
    'subject-empty': [0], // 允许 subject 为空
    'subject-full-stop': [0], // 不检查句号结尾
    'header-max-length': [0], // 不限制长度
  },
};
