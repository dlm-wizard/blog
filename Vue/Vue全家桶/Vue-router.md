


## Vue-router

我们已经可以通过组件来构建应用程序了，添加上 `Vue-router` 一的话，只需要将组件`components`映射到路由`route`，然后告诉 Vue-router 在哪里渲染他们。

```bash
# 作用
建立起路径和视图之间的映射关系 [router-link 的作用]

这里的路由就是 SPA（单页应用）的路径管理器，并不是指硬件路由，也不是网络七层协议中的网络层路由，但他们的思想原理是一样的。
```

#
### 一：Dev-Tools


* `History`：可以看到 `from 与 to`的信息，你也会看到路由 name 与 path
* `Routes`：所有 routes 列表，


#
### 二：`<router-view>` 与 `<router-link>`

#### router-view

```
1. 是一个 functional 组件
2. 渲染激活的页面
```

#### router-link

```bash
# 作用
在具有路由功能应用中导航，默认渲染为 a 标签，点击该标签不会刷新页面（router-link 截取 click 事件），但是
a 标签会完全刷新页面，SPA 中我们只需要 fetch 改变的数据而不是和普通网页一样 re-fetch 所有资源。

# 内链接：router-link，外链接：a


# 属性
1. tag：渲染标签类型
```

```bash
# router-link to="{ 
                     name: 'user', 
                     params: { id: '1' }, 
                     query: { age: 21 } 
                  }"
                  
# to 的值会被立即传递到 router.push()

-> router.push({ name: 'user', params: { id: '1' }, query: { age: 21 } })
```

#### 声明式与编程式导航

```bash

   声明式 | 编程式
------------ | -------------
<router-link :to="..."> | 	router.push(...) [to 的参数会被传入 router.push()]
```

#
### 三：初始化

#### router.js 文件

```bash
# VueRouter instance
const router = new VueRouter({})


# router 构建选项
         
1. routes
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // 命名路由
    components?: { [name: string]: Component }; // 命名视图组件
    redirect?: string | Location | Function;
    props?: // 路由参数传递
     1. boolean: 「props: {params: route.params}」
     2. Object: 「props: 静态对象」
     3. Function: 「props: 动态对象」
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // 嵌套路由
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
    
    caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
    pathToRegexpOptions?: Object; // 编译正则的选项
  }
  
2. mode # "hash" (浏览器环境) | "abstract" (Node.js 环境) | history
3. base: process.env.BASE_URL 应用路径
4. linkActiveClass / linkExactActiveClass: # 动态样式
5. scrollBehavior
5. parseQuery / stringifyQuery: 自定义 query 解析函数
6. fallback: 不支持 history 浏览器回退 hash 模式
```

#### hash 与 history 模式
    
```bash
# mode 实现：
原理：向 history 栈添加一个新的记录
```

```bash
# hash 模式 - 浏览器自动忽略（#）后的内容
什么是 hash - url 的锚点，代表的是网页中的一个位置，浏览器会滚动到相应位置

# code 
// vue-router 更新视图原理: 监听 hash 变化
// 每一次改变#后，都会在 history 增加一个记录，使用”后退”按钮，就可以回到上一个位置
window.onhashchange
```

```bash
# History模式 -- url 中带着 '#' 比较丑
原理：h5 history 接口 pushState / replaceState() [可以添加和修改 history] -- 执行修改改变当前 url
，但不会立即发送请求
           
(1) 刷新时会发请求
需要服务器支持 -> url 不匹配任何静态资源，只返回 index.html 页面
window.popstate 

(2) 页面跳转
API：this.$router.push(location, onComplete?, onAbort?) -- 向 history 栈添加一个新的记录
```

#
### 四：路由懒加载

结合 Vue 的[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6)和 [Webpack 的代码分割](https://www.webpackjs.com/guides/code-splitting/)功能，轻松实现路由组件的懒加载。

```bash
# webpack
1. router.js - 页面
2. components - 组件

由于项目所有的组件和他们的依赖打包一个 bundle，用户需要加载整个 bundle，包括很多用户可能不会点击的
组件。这消耗了用户带宽与用户的体验，用户没有必要在于页面发生交互前等待这些组件的加载。我们可以动态的异
步的加载这些组件。

利用 webpack 代码分离特性，我们可以把路由、组件代码分离到不同的 chunks 中，路由被激活的时候才去加载，
减少加载时间。用户仅需要下载页面必不可少的代码，大幅提升页面加载速度。

# code
component: () => import(/* webpackChunkName: "Home " */ './views/Home.vue')
1. import 方法在 runtime 动态的加载 es6 模块
2. 引入的声明只会在箭头函数被调用的时候执行，所以懒加载的组价只会在需要是加载。
3. webpack 会为这个文件创建一个运行时动态加载的 chunks，会给它一个名字基于id或随机的hash值
# webpackChunkName 对 chunks 命名
```

#
### 五：动态路由

```bash
# url 匹配指定模式
将某种模式匹配到的所有 url 都映射到同个组件

# 配置 route 对象
routes: [
 { path: '/user/:id', component: User }
]
```

#### 1. 响应路由参数的变化

```bash
# 通过 $route.param 导航
1. 原来的组件实例会被复用 - 两个路由渲染同样组件，比创建到销毁高效很多
注：生命周期钩子不会再调用

# 响应
1. <router-view :key="$route.path" /> // 需要组件重新创建data

2. watch: {
    '$route' (to, from) { // 对路由变化作出响应... }
   }
```

#### 2. $routes 和 $router

我们只要通过 Vue.use(router) 全局注册了 router plugin，我们实际是可以通过 $route 在任何组件中获取当前路由对象的。

```bash
参数为空 -> "" 或 {}
# $route: 路由对象 [激活路由的状态信息] -> 路由对象是不可变的

1. $route.path: String # 当前路由的路径，总是解析为绝对路径，如 "/order"。
2. $route.params: {key: value} # 动态路由参数
3. $route.query: {key: value} # query
4. $route.hash
5. $route.fullPath # 包含 query、hash
6. $route.matched # routes 对象副本
7. $route.name # 传参

# $router: 路由实例 -- 根组件注入到所有子组件
new VueRouter({})， this.$router.模拟：
1. go() [window.history.go]
2. replace [window.history.replaceState]
3. push [window.history.pushState]
```

#### 3. 路由参数传递

```bash
# 传递 params
1. params: {id: a} + this.$route.params
2. props
```

`$router 解耦`

```bash
# 组件与路由高耦合
1. 在组件中使用 $route 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。
=> 配置 props = true
2. 松耦合的组件让我们有更好的扩展性，当业务需求变化的时候，我们可以重构我们的应用。

核心：组件并不需要知道他的数据来源， 可能是 input、$router、父组件 etc...，不管数据源来自哪里，组件同样可以工
作，尽量保持 props 是无状态的。

```

#
### 六：命名路由

```bash
# 所有路由信息都通过 router.js 这个文件控制
如果你改变了路由的路径，我们在这里不需要重构代码或其他链接到本页面的任何组件。

<router-link
 :to="{
       name: 'DestinationDetails',
       params: {id: '1'}
   }"
></router-link>
```

#
### 七：命名视图

```bash
# 同级展示多个视图而不是嵌套展示（sidebar + main）
给不同的router-view定义不同的名字，通过名字进行对应组件的渲染。

routes: [{
    components: {
      default: main,
      b: sidebar
    }
  }];

<router-view class="main" />
<router-view class="sidebar" name="sidebar" />
```

#
### 八：嵌套路由

```bash
# route 中构建子路由
router-view 是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 router-view
```
