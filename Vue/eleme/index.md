
#### 首页

> 很多服务器语言中预设首页

> html 中标签和属性名都是大小写不敏感的

```html
<!-- meta 标签不太懂 -->
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
    <meta name="screen-orientation" content="portrait"/><!-- 启用 WebApp 全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes"><!-- uc强制竖屏 -->
    <meta name="format-detection" content="telephone=no"><!-- 忽略数字自动识别为电话号码 -->
    <meta name="full-screen" content="yes"><!-- UC强制全屏 -->
    <meta name="x5-fullscreen" content="true"><!-- QQ强制全屏 -->
    <title>elm</title>
  <link href="./static/css/reset.css" rel="stylesheet"></head>
  <body>
    <div id="app">
    	<router-view></router-view>
    </div>
  </body>
</html>
```
