#
## 概念

### 项目开始

#### npm run dev

> 从这个入口开始分析，webpack 是如何做编译的

`package.json`:
```js
  "scripts": {
    "dev": "node build/dev-server.js",
    "local": "node build/dev-server.js",
    "build": "node build/build.js",
    "lint": "eslint --ext .js,.vue src"
  }
```

可以看到 npm run dev 就是运行了 `node build/dev-server.js` 文件 

#### build/dev-server.js

为了方便，我们在写服务器脚本的时候，通常还会用个同语言写的 Web Framework 来处理各种细节

* 防御一些常见的攻击
* 提供跨站认证（比如用已有的微博账号注册其他网站）的接口
* 利用cookie处理登陆状态和用户设置
* 生成网页模版之类的

开头声明了一堆依赖

```js
/*使用 NodeJS 自带的文件路径工具*/
var path = require('path')

/*获取 config/index.js 的默认配置「运行与开发配置」*/
var config = require('../config')

/* 
   如果 Node 的环境无法判断当前是 dev / product 环境
   使用 config.dev.env.NODE_ENV 作 为当前的环境
 */
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)

var express = require('express') // 使用 express
var webpack = require('webpack') // 使用 webpack

/*
   一个可以强制打开浏览器并跳转到指定 url 的插件
   用它来调用默认浏览器打开 server 监听的端口
*/
var opn = require('opn')

/*
   一个 express 中间件，用于将http请求代理到其他服务器(跨域情况反向代理)
   例：localhost:8080/api/xxx  -->  localhost:3000/api/xxx
   这里使用该插件可以将前端开发中涉及到的请求代理到 API 服务器上，方便与服务器对接
 */
var proxyMiddleware = require('http-proxy-middleware')

/*根据 Node 环境来引入相应的 webpack 配置*/
var webpackConfig = require('./webpack.dev.conf')

/*server 监听的端口，默认为 config.dev.port设置的端口，即8080*/
var port = process.env.PORT || config.dev.port

/*定义 http 代理表，代理到 API 服务器(获取需要转发的接口) --> 前后端分离*/ 
var proxyTable = config.dev.proxyTable

/*创建 express 实例*/
var app = express()

/*根据 webpack 配置文件创建 Compiler 对象*/
var compiler = webpack(webpackConfig)


/* 
   webpack-dev-middleware 使用 compiler 对象来对相应的文件进行编译和绑定
   编译绑定后将得到的产物存放在内存中, 没有写进磁盘
   将这个中间件交给express使用之后即可访问这些编译后的产品文件
 */
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, // 中间件公共路径与与 webpack 公共路径相同
  stats: {
    colors: true,
    chunks: false
  }
})

/*应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面*/
var hotMiddleware = require('webpack-hot-middleware')(compiler)

// 这个心跳机制是什么意思...
// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: () => {},
//   heartbeat: 2000
// })

// 设置回调来访问编译对象
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

var context = config.dev.context

switch(process.env.NODE_ENV){
    case 'local': var proxypath = 'http://localhost:8001'; break;
    case 'online': var proxypath = 'http://elm.cangdu.org'; break;
    default:  var proxypath = config.dev.proxypath;
}
var options = {
    target: proxypath,
    changeOrigin: true,
}
if (context.length) {
    app.use(proxyMiddleware(context, options))
}

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// 将暂存到内存中的 webpack 编译后的文件挂在到 express 服务上
app.use(devMiddleware)

// 将 Hot-reload 挂在到 express 服务上，并输出相关状态和编译错误
app.use(hotMiddleware)

// 拼接 static 文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)

// 当开发环境中如果遇到了路径为 staticPath 的资源，那么到 ./static 中引用该资源
app.use(staticPath, express.static('./static'))

// 让我们这个 express 服务监听 port 的请求，并且将此服务作为 dev-server.js 的接口暴露
module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')

    // 如果不是测试环境，自动打开浏览器并跳到我们的开发地址
    if (process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
})

/*config/index.js「开发配置」*/
dev: {
    env: {
        /*process.env */
        NODE_ENV: '"development"'
    },
    port: 9000,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    context: [ //代理路径
        '/shopping',
        '/ugc',
        '/v1',
        '/v2',
        '/v3',
        '/v4',
        '/bos',
        '/member',
        '/promotion',
        '/eus',
        '/payapi',
        '/img',
    ],
    /*proxyMiddleware将http请求进行代理转发 */
    proxypath: 'http://cangdu.org:8001',
}
```

#### webpack.dev.conf

```js
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')/*合并配置文件*/
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')/*操作html文件插件*/

/*
   将热重载的相关配置放入entry的每一项中，达到每一个文件都可以实现热重载的目的
   这样webpack.base.conf.js中entry选项就变成了如下：
    entry: {
      app: ['./src/main.js', './build/dev-client']
    }
 */
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

/**
 * webpack-merge的作用类似于 $.extend：少则添加，同则覆盖
 * 调用webpack-merge方法，将基础设置与开发设置进行合并
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
    plugins: [
        /*
           为 webpack 提供一个在编译时可以配置的全局常量
           在这里我们可以通过 "process.env" 这个全局变量的值来判定所处的环境
         */
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        /*热加载插件*/
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',/*编译后文件名*/
            template: 'index.html',/*将 index.html 作为入口*/
            inject: true/*打包过程中添加js(body)、css路径自动添加(head)*/
        })
    ]
})

```

#
#### webpack.base.conf

```js
var path = require('path')
var config = require('../config')
var utils = require('./utils')

/*定义根目录*/
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV


module.exports = {
    /*定义入口js*/
    entry: {
        app: './src/main.js'
    },
    output: {
        /*输出bundle路径*/
        path: config.build.assetsRoot,
        /*
           静态资源绝对路径
           开发路径为'/', 生产路径为'/static'(根目录下static文件夹)
         */
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'/*页面中引用app.js「devMiddleware」*/
    },
    resolve: {
        /*自动补全文件后缀「require、export」*/
        extensions: ['', '.js', '.vue', '.less', '.css', '.scss'],
        /*在前端require模块未找到，像NodeJs一样去node_modules寻找模块*/
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            /*配置别名，避免在结构嵌套过深的情况下出现../../../../xxx这种写法*/
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]/*同fallback*/
    },
    module: {
        /*处理非Js文件「webpack只理解Js」*/
        /*loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块*/
        loaders: [{
            /*匹配文件名*/
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
            /*
               对于图片资源，当文件体积小于10kb时，将其生成为base64，直接插入html中
               当大于10kb时，将图片名称进行按照命名规则进行更改
             */
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[ext]')
            }
        }, {
            /*字体资源打包规则，与图片资源相同*/
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
        /*vue文件中css处理*/
        /*传入名称数组拼接css预处理器loader*/
        loaders: utils.cssLoaders({
            sourceMap: useCssSourceMap/*false */
        }),
        postcss: [
            require('autoprefixer')({
                browsers: ['last 10 versions']
            })
        ]
    }
}
```









