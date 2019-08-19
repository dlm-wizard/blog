#
#### webpack异步加载的原理

> ensure 代码切割

把js模块给独立导出一个.js文件的，然后使用这个模块的时候，webpack会构造 `<script>` 元素，由浏览器发起异步请求这个js文件


场景分析:
```
首页里面有个按钮，点击后可以打开baidumap。打开地图的话就要利用baidumap的js,于是
我们不得不在首页中把百度地图的js一起打包进去首页,一个百度地图的js文件是非常大的，用户打开首页的时间就比较长了
```

#
#### webpack模块打包

既然打包成同一个js非常大的话，那么我们完全可以把baidumapjs分类出去，利用浏览器的并发请求js文件处理。为baidumap.js配置一个新的入口就行了，这样就能打包成两个js文件，都插入html即可（如果baidumap.js被多个入口文件引用的话，也可以不用将其设置为入口文件，而且直接利用CommonsChunkPlugin,导出到一个
公共模块即可）


那还有没有更好的解决方案呢？

#
### 懒加载

在用户点击的时候，去下载baidumap的js

```js
mapBtn.click(function() {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.async = true;
  script.src = "http://map.baidu.com/.js"
  head.appendChild(script);
})

# webpack 已经封装好了点击后异步加载
mapBtn.click(function() {
  require.ensure([], function() {
    var baidumap = require('./baidumap.js') //baidumap.js放在我们当前目录下
  })
})
```

#### require.ensure([], cb)

未 require 的模块独立的分为一个 js 文件
```js
1. []：所依赖的其他模块
会当前分离模块与依赖模块打包在一起分离，可能出现重复打包问题：A、B互相依赖，ensure 分别分离了模块 A、B

2. cb：回调函数

require('./common.js')
require.ensure([./b.js], function() {
  require('./common.js')/*使用同步模块*/
  require('./a.js')/*加载分离模块*/
})
```


```js
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
```
