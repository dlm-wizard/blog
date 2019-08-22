#### 安装webpack

* 配置时注意是绝对路径还是相对路径
* 

```bash
# 需要先初始化，生成package.json
npm init

# 管理 node 版本
nvm list
nvm use

npm install webpack --save-dev

# webpack4中除了正常安装webpack之外，需要再单独安一个webpack-cli
npm i webpack webpack-cli -D

npm i -D 是 npm install --save-dev 的简写，
是指安装模块并保存到 package.json 的 devDependencies中，主要在开发环境中的依赖包
```

#
#### 0配置了什么

```bash
# node v8.2版本以后都会有一个npx [npx webpack]

webpack // 不设置mode的情况下 打包出来的文件自动压缩

webpack --mode development // 设置mode为开发模式，打包后的文件不被压缩

# 执行 npx webpack 
webpack会自动查找项目中src目录下的index.js文件，然后进行打包，生成一个dist目录并存在一个打包好的main.js文件

这些算是0配置的操作了，名字都是定义好的，不能变，想想也很鸡肋
```

#
#### 编译打包
```bash
栗子：npx webpack

Hash: 58647e19231e01cad38a # hash 值
Version: webpack 4.39.1 # webpack 版本
Time: 288ms
Built at: 2019-08-04 6:31:41 PM
  Asset [打包后生成的文件]       Size [文件的大小]       Chunks [此次打包的分块]       Chunk Names [此次打包块名称]
    main.js                     930 bytes               0 [emitted]                  main
Entrypoint main = main.js
[0] ./src/index.js 51 bytes {0} [built]
```

```js
require('./login')
```


#
#### css 文件
```js
sudo npm install --save-dev css-loader style-loader

require('style-loader!css-loader!./css/common.css')
```

#
#### webpack是基于Node的

```bash
# 启动devServer
webpack-dev-server

module.exports = {
    entry: '',               // 入口文件
    output: {},              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}
```

#
#### 入口文件

> 应付多种多样的需求, 有三种输入方式来匹配你的不同需求

* String:  依赖都在这个入口文件中指定 [单页程序]

* Array<string>:  两个平行的没有依赖关系的文件打包为一个新的文件
    
* entry: {[entryChunkName: string]: string|Array<string>}
    
```js
entry: {
        chunkName: entry1,
        chunkName: ['entry2', 'entry2'],
    },
```


```js
const path = require('path');

module.exports = {
    // 1.写成数组的方式就可以打包多入口文件，不过这里打包后的文件都合成了一个文件
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    // ...
}
```

#
#### 出口文件 [如何向硬盘写入编译文件]


> filename

* String:  多入口文件如果继续使用 String，之间会覆盖

* 占位符
    * chunkhash: 对静态资源版本号的管理，上线时非常有用 [只需要上线被我们改过的文件]
    
> publicPath: 上线以后地址肯定与本地相对路径不同 [也可以理解为占位符]
    
占位符 | 描述
------------ | -------------
[hash] | 打包的 hash
[chunkhash] | md5值（保证文件的唯一性）
[name] | entryChunkName（模块名称）
[id] | 模块标识符(module identifier)
[query] | 模块的 query，例如，文件名 ? 后面的字符串
    
* entry: {[entryChunkName: string]: string|Array<string>}

```js
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        filename: '[name].js', // 打包后会生成index.js和login.js文件
        path: path.resolve('dist'),
        publicPath: 'http://cdn.com' // 需要上线的设置
    }
}
```


#
#### 配置Html模板

> 1. 文件都打包好了，但是我们在使用的时候不能在dist目录下去创建一个html文件，然后去引用打包后的js吧

> 2. hash 与 版本号(md5值)不确定~

#### 插件

> webpack 插件列表是一个数组

1. 具有 `apply` 属性的 js 对象 [`apply` 被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问]

2. 插件是可配置的 [参数 or 选项] => new 实例（完全决定于插件的实现）

```js
// 1. 我们需要实现 html 打包功能，可以通过一个模板实现打包出引用好路径的 html
// 2. html-webpack-plugin 插件：npm i html-webpack-plugin -D [安装]
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件

const config = {
  // ...  
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    // 插件生成的 html 未和项目下 html 建立联系
    // 实际项目中，html 文件往往复杂度比较高，自定义的程度也更大
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};


// 打包后生成 index.html
<script type="text/javascript" src="main-75aec88f1e3b755900ed.js"></script><script type="text/javascript" src="a-a537a8bfaf5a111f8e9e.js"></script></body>
```
> context: string || 默认使用根目录 [绝对路径，用于从配置中解析入口起点(entry point)和 loader]

```js
module.exports = {
    // context: ,
    plugins: [
        new htmlWebpackPlugin({
            // 为什么这里路径指向根目录下 index.html
            template: 'index.html', // context 的概念
            // // 会在打包好的bundle.js后面加上hash串
            hash: true
        })
    ]
}
```

```js
// 旧版本模板语法可以拿到 htmlWebpackPlugins 对象且作为 Js 语句执行，不用通过 templateParameters 对象
// 通过 {key: value} 可以拿到打包 output 的所有信息
<%= for (var name in htmlWebpackPlugins.files) {
        key: JSON.stringfy(htmlWebpackPlugins.files[key])
    }%> 

不知道新版是否可以拿到打包后的信息
```


![htmlWebpackPlugin.files](https://uploader.shimo.im/f/AZ6Y15RhMb4q0H1G.png!thumbnail)

> 生成的文件都在项目的 js 目录下，不符合实际生产的要求，上线的代码可以高度自定义配置，需要压缩并且确定缓存情况

```js
output: {
    path: path.resolve('./dist'), // html 生成在Js目录下，修改一下静态路径
    filename: 'js/[name]-[chunkhash].js', // 可以指定 js文件 路径
    publicPath: 'http://cdn.com',
},
```


```js
new htmlWebpackPlugin({
    // 为什么这里路径指向根目录下 index.html
    template: 'index.html', // context 的概念
    filename: 'index-[hash].html',
    // 模板语法 : Js 引擎
    templateParameters: {
        'date': new Date(),
    },
    minify: // 如何压缩 [mode是'production' -> true]
    {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,// 值匹配默认值,删除属性
        removeScriptTypeAttributes: true,// 删除 type="text/javascript"
        removeStyleLinkTypeAttributes: true,
      },
    inject: 'body', // 脚本放在 head 还是 body
    hash: true, // 清除缓存
    cache: true, // 文件被更改时才发出文件
})
```




#### 处理多页应用

> 对应生成多个 html

> 插件列表是一个数组，我们只需要在下面继续再调用一次该插件即可 [不同的页面可以指定不同 or 相同模板]

> 在调用插件的过程中，我们共享所有 chunk，并没有区分 html 应该引用的 chunk

```js
plugins: [ 
new htmlWebpackPlugin({
    template: 'index.html',
    filename: 'a-[hash].html',
    templateParameters: {
        'date': new Date(),
    },
    chunks: ['2_main', '2_a'], // 指定匹配 entry 中不同 chunk
    minify: 
    {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    inject: 'body', 
    hash: true,
    cache: true,
}),
new htmlWebpackPlugin({
    template: 'index.html',
    filename: 'b-[hash].html',
    templateParameters: {
        'date': new Date(),
    },
    excludeChunks: ['2_main', '2_a'], // 反向匹配
    inject: 'body',
}),
]
```

#### 极致的性能

> 初始化脚本迁入页面而不以链接形式引用 [增加 tcp 请求]

> 提高脚本运行和加载速度

inline 的引入当前文件内容

既然我们可以在 webpack 配置文件中运行 js，那么可以直接调用 NodeJs 读取文件 API 直接读取我们想要引入的文件呢？

直接读取引用文件是不会经过 webpack 处理的...

```js
// 注：不禁用 hash 与 cache 配置 inline 不生效
1. new HtmlWebpackInlineSourcePlugin()

2. new htmlWebpackPlugin({
    // ...
    inlineSource: '.(js|css)$', // embed all javascript and css inline
}),

```


以上基本介绍完了html和js的打包配置了
现在我们还缺一个好兄弟css，webpack对css的解析需要用到loader，所以我们先提前安装好，待会好方便使用

#
#### 

```



```







