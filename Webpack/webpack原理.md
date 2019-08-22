
### webpack 工作原理
#### Tapable

```bash
# 核心是使用Tapable 来实现插件(plugins)的binding和applying.

1. 事件流
   webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来

   webpack整体是一个插件架构，所有的功能都以插件的方式集成在构建流程中，通过发布订阅事件来触发各个插件执行。


webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例
```


#

```js

module.exports = {
    // 1. 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个 chunk
    entry: {
        app: './src/main.js'
    },
    output: {
        // 2. 生成文件，是模块构建的终点，包括输出文件与输出路径
        path: config.build.assetsRoot,

        /**
         * 静态资源路径（判断目前所处的环境）
         * 开发路径为'/', 生产路径为'/static'(根目录下static文件夹)
         */
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        
        // 输出文件名称（name 为 entry 中定义的 key 值）
        filename: '[name].js'
    },
    // 3. 文件路径指向(可加快打包过程)
    resolve: {
        // 自动解析拓展，可以在引用文件的时候不用写后缀
        extensions: ['', '.js', '.vue', '.less', '.css', '.scss'],
        /*在前端require模块未找到，像NodeJs一样去node_modules寻找模块*/
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            // 配置别名，避免在结构嵌套过深的情况下出现../../../../xxx这种写法
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    /*同fallback*/
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    // 配置不同模块处理规则
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            /**
             * 对于图片资源，当文件体积小于10kb时，将其生成为base64，直接插入html中
             * 当大于10kb时，将图片名称进行按照命名规则进行更改
             */
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[ext]')
            }
        }, {
            // 字体资源打包规则，与图片资源相同
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    eslint: {
    formatter: require('eslint-friendly-formatter')
    },
    // 这块配置是什么情况，我以为是 scss loader 找不到报错的配置，在初始 vue-cli 脚手架里没有
    vue: {
        /*传入名称数组拼接loader*/
        /*vue中各种css预处理器对应loader*/
        loaders: utils.cssLoaders({
            sourceMap: useCssSourceMap
        }),
        postcss: [
            require('autoprefixer')({/*CSS3中的一些需要兼容写法的属性添加响应的前缀*/
                browsers: ['last 10 versions']
            })
        ]
    }
}
```

```js
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 将热重载的相关配置放入entry的每一项中，达到每一个文件都可以实现热重载的目的
 * 这样webpack.base.conf.js中entry选项就变成了如下：
 *  entry: {
 *    app: ['./src/main.js', './build/dev-client']
 *  }
 */
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

/**
 * 作用类似于 $.extend：少则添加，同则覆盖
 * 合并将基础设置与开发设置
 */
module.exports = merge(baseWebpackConfig, {
    module: {
        /*独立css文件预处理器编译*/
        loaders: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap
        })
    },
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    // 1. webpack 各插件对象，在 webpack 的事件流中执行对应的方法
    plugins: [
        /**
         * DefinePlugin 可以为 webpack 提供一个在编译时可以配置的全局常量
         * 在这里我们可以通过 "process.env" 这个全局变量的值来判定所处的环境
         */
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        /*热加载插件*/
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',/*指定编译后生成html文件名*/
            template: 'index.html',/*编译文件*/
            inject: true/*打包过程中添加js(body)、css路径自动添加(head)*/
        })
    ]
})
```

#
### webpack模块打包

#### 

```bash
指定webpack开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库
```

> 当我们需要

```

module.exports = {
  // 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个 chunk
  entry: './path/to/my/entry/file.js',
  entry: {
    index: './src/index.js',
    login: './src/login.js'
   }
};
```



#
#### 最简单的 webpack 配置

打包编译的时候一般都执行 `npm run dev` 这样的命令, 既然是通过npm执行的命令，我们就应该找到 `package.json` 里的执行脚本去配置一下命令
```js
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',    // 入口文件[主模块]
    output: {
        // 添加hash可以防止文件缓存，每次都会生成4位的hash串
        filename: 'bundle.[hash:4].js', // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    }
}

// 配置执行文件
  "scripts": {
    // devServer帮我们把文件放到内存中了，所以并不会输出打包后的dist文件夹
    "dev": "node build/dev-server.js",/*开发环境下打包文件，*/
    "build": "node build/build.js",/*上线打包文件*/
  },
```

#### 配置Html模板

文件都打包好了，使用的时候不能在 `dist` 目录下去创建一个 `html` 文件，然后去引用打包后的js吧

我们需要实现html打包功能，可以通过一个模板实现打包出引用好路径的html来

```js
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new HtmlWebpackPlugin({
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            // 会在打包好的bundle.js后面加上hash串
            hash: true, // 打包后自动引用 js
        })
    ]
}

// 多页面 
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['index']   // js对应关系,index.js对应的是index.html
    })
]
``
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css')
 ]
```

#
#### 常用的loader：

* babel-loader： 让下一代的js文件转换成现代浏览器能够支持的JS文件。
```
babel有些复杂，所以大多数都会新建一个.babelrc进行配置

css-loader
```

* utils.cssLoaders

* file-loader: 生成的文件名就是文件内容的MD5哈希值并会保留所引用资源的原始扩展名

* url-loader: 功能类似 file-loader,但是文件大小低于指定的限制时，可以返回一个DataURL事实上，在使用less,scss,stylus这些的时候，npm会提示你差什么插件，差什么，你就安上就行了

#
#### 插件(plugins)

```bash
Loaders将各类型的文件处理成webpack能够处理的模块，plugins有着很强的能力。
插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。但也是最复杂的一个。比如对js文件进行压缩优化的UglifyJsPlugin插件
```

> loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。

> 插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。[插件接口](https://www.webpackjs.com/api/plugins/)功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，

1. 你只需要 require() 它，
2. 然后把它添加到 plugins 数组中「多数插件可以通过选项(option)自定义」
3. 你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

```js
const webpack = require('webpack'); // 使用webpack

module.exports = {
  //...
  plugins: [
        // 抽取公共文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })
  ]
};

module.exports = config;
```
[插件列表](https://www.webpackjs.com/plugins/)

#### 目前为止，在开发阶段的东西我们已经基本完成了


#
#### 插件(chunk)

```bash
coding split的产物，我们可以对一些代码打包成一个单独的chunk
比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间

在webpack3及以前我们都利用CommonsChunkPlugin将一些公共代码分割成一个chunk，实现单独加载
```

#
#### 产品阶段的构建

> 在产品阶段，还需要对资源进行别的处理，例如压缩，优化，缓存，分离css和js

process.env.NODE_ENV 将被一个字符串替代，引入那些不会进行生产但很有用的代码
```js
var ENV = process.env.NODE_ENV
module.exports = {
      // ... 
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(ENV)
        })
      ]
  }
```

#
#### 优化插件


* OccurenceOrderPlugin: 为组件分配ID,通过这个插件webpack可以分析和优先考虑使用最多  的模块，然后为他们分配最小的

* IDUglifyJsPlugin: 压缩代码

下面是他们的使用方法：

```js
module.exports =  = {    
  // ...     
  new webpack.optimize.OccurenceOrderPlugin()     
  new webpack.optimize.UglifyJsPlugin()
}

然后在我们使用npm run build会发现代码是压缩的
```









