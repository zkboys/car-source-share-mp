import {defineConfig, type UserConfigExport} from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type {Input} from 'postcss';
import devConfig from './dev'
import prodConfig from './prod'

const isAnalyzer = process.env.ANALYZER === 'true';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
// @ts-ignore
export default defineConfig<'webpack5'>(async (merge, {command, mode}) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'dist',
    date: '2025-8-12',
    // designWidth: 375,
    designWidth(input: Input) {
      // Taroify 组件使用 750 设计稿
      if (input?.file?.includes('@taroify')) {
        return 750;
      }
      // 自定义代码使用 375 设计稿
      return 375;
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      "@tarojs/plugin-generator"
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)

        // css引用顺序提示，项目使用css module 可以忽略提示 但是要注意 :global、 css变量、 媒体查询等全局性质的代码。
        if (chain.plugins.has('miniCssExtractPlugin')) {
          chain.plugin('miniCssExtractPlugin').tap(args => {
            args[0].ignoreOrder = true;
            return args;
          });
        }

        // 分析依赖
        if (isAnalyzer) {
          chain.plugin('analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, []);
        }

        // 启用后开发模式下文件大小会有缩减 3638KB -> 2633KB
        // chain.merge({
        //   optimization: {
        //     usedExports: true,     // 标记未使用的导出
        //     minimize: true,         // 启用代码压缩和删除死代码
        //     sideEffects: true,       // 启用副作用识别机制
        //     splitChunks: {
        //       chunks: 'all', // 拆分公共代码
        //       minSize: 0
        //     },
        //   }
        // })
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }


  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
