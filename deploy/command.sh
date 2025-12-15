# 输出node版本
node -v

# 设置版本号
sed -i "s/{{BUILD_ID}}/${BUILD_ID}/g" deploy/upload.js

# 设置分支
GIT_BRANCH_ESCAPED=$(printf '%s\n' "$GIT_BRANCH" | sed 's/[&/\]/\\&/g')
sed -i "s/{{GIT_BRANCH}}/${GIT_BRANCH_ESCAPED}/g" deploy/upload.js

# 覆盖开发版本配置，审核版用的是开发配置
#cp src/config/release.ts src/config/develop.ts

# 安装依赖
yarn install

# 前端构建
yarn build

# 上传
node deploy/upload.js
