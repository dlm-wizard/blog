

一、vue-router 是什么

   这里的路由就是SPA（单页应用）的路径管理器，并不是指「硬件路由」，也不是网络七层协议中的「网络层路由」，但他们的思想原理是一样的。

  1. 本质：

    就是建立起url和页面之间的映射关系 [传统的页面应用，是用一些超链接来实现页面切换、跳转的]

  2. 为什么不能用 <a> ?

    这是因为用Vue做的都是单页应用（当你的项目准备打包时，运行npm run build时，就会生成dist文件夹，这里面只有静态资源和一个index.html页面），所以 <a> 是不起作用的
    

二、vue-router实现原理

    SPA(single page application): 只有一个完整的页面；它在加载页面时，不会加载整个页面，而是只更新某个指定的容器中内容
    
     1. VueRouter instance
     
        const router = new VueRouter({
          routes: [
            { path: '/foo', component: Foo,
              children: [
                { path: 'bar', component: Bar }
              ]
            }
          ]
        })
      
      2. routes [router 构建选项]
      
        declare type RouteConfig = {
          path: string;
          component?: Component;
          name?: string; // 命名路由
          components?: { [name: string]: Component }; // 命名视图组件
          redirect?: string | Location | Function;
          props?: boolean | Object | Function;
          alias?: string | Array<string>;
          children?: Array<RouteConfig>; // 嵌套路由
          beforeEnter?: (to: Route, from: Route, next: Function) => void;
          meta?: any;

          caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
          pathToRegexpOptions?: Object; // 编译正则的选项
        }

        const router = new VueRouter({
          mode: 'history',
          routes: [...]
        })
    
    <router-view><!-- 留坑，非常重要 -->
    
    
    mode 实现关键：
      向 history 栈添加一个新的记录

        1、hash 模式
           hash（#）后的内容浏览器自动忽略，模拟完整 url
           
         (1) 什么是 hash
               url 的锚点， 代表的是网页中的一个位置，单单改变（#）后的部分，浏览器只会滚动到相应位置，不会重新加载网页

                /**
                 * vue-router 更新视图原理: 监听 hash 变化
                 * 每一次改变#后，都会在 history 增加一个记录，使用”后退”按钮，就可以回到上一个位置
                 */
                window.onhashchange


        2、History模式 -- url 中自带 '#' 很丑不啦
           h5 history 接口 pushState / replaceState() [可以添加和修改 history] -- 执行修改改变当前 url，但不会立即发送请求
           
           
         (1) 刷新时会发请求
               需要服务器支持 -> url 不匹配任何静态资源，返回 index.html 页面
                
               window.popstate 


        3、页面跳转
        
           API：this.$router.push(location, onComplete?, onAbort?) -- 向 history 栈添加一个新的记录
           
               声明式 | 编程式
            ------------ | -------------
            <router-link :to="..."> | 	router.push(...) [to 的参数会被传入 router.push()]
            


三、 $route 和 $router [e 呀]
    
    1. $route 是“路由对象” [激活路由的状态信息] -> 路由对象是不可变的
        参数为空 -> "" 或 {}
        
        ① $route.path: String
            当前路由的路径，总是解析为绝对路径，如 "/order"。

        ② $route.params: {key: value}
             路径参数：':param' 
             eg: /city/:cityid

        ③ $route.query: {key: value}
            url 查询参数
            eg：/foo?user = 1，$route.query = {user: 1}

        ④ $route.hash
            当前路由的 hash 值 (不带 #)

        ⑤ $route.fullPath
            完成解析后的 url，包含查询参数和 hash 的完整路径。

        ⑥ $route.matched
             routes 数组对象的副本：
              routes: [{ path: '/foo', component: Foo,
                children: [{ path: 'bar', component: Bar }]
              }]

        ⑦ $route.name 当前路径名字/*传参*/



    2. $router: VueRouter instance -- 根组件注入到所有子组件
    
         new VueRouter({})/*路由的跳转方法，钩子函数*/
         
           this.$router.模拟：
           
              I.  go() [window.history.go]
              II. replace [window.history.replaceState]
                  push [window.history.pushState]

三、 传参

     1.name 传参

        /*路由文件src/router/index.js里配置 name 属性*/
        routes: [{
              path: '/',
              name: 'Hello',
              component: Hello
        }]
        => 当前路由里：$route.name 访问

    2. <router-link to=""> or url 传参

        <router-link :to="{name:'xy',params:{user:'xy',id:'15'}}"> [路由配置（一般不用）：path:'/params/:newsId/:newsTitle']
        
        => this.$route.params.user/id


    3. query
    
        <router-link :to="{ name:'Query',query: { queryId:  status }}" >
        
        => this.$route.query.queryId


四、vue-router 配置子路由(二级路由)


  
  
  
七、单页面多路由区域操作
在一个页面里我们有两个以上<router-view>区域，我们通过配置路由的js文件，来操作这些区域的内容

1.App.vue文件，在<router-view>下面新写了两行<router-view>标签,并加入了些CSS样式

<template>
  <div id="app">
    <img src="./assets/logo.png">
       <router-link :to="{name:'HelloWorld'}"><h1>H1</h1></router-link>
       <router-link :to="{name:'H1'}"><h1>H2</h1></router-link>
    <router-view></router-view>
    <router-view name="left" style="float:left;width:50%;background-color:#ccc;height:300px;"/>
    <router-view name="right" style="float:right;width:50%;background-color:yellowgreen;height:300px;"/>
  </div>
</template>
2.需要在路由里配置这三个区域，配置主要是在components字段里进行

export default new Router({
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        components: {default: HelloWorld,
          left:H1,//显示H1组件内容'I am H1 page,Welcome to H1'
          right:H2//显示H2组件内容'I am H2 page,Welcome to H2'
        }
      },
      {
        path: '/h1',
        name: 'H1',
        components: {default: HelloWorld,
          left:H2,//显示H2组件内容
          right:H1//显示H1组件内容
        }
      }
    ]
  })
上边的代码我们编写了两个路径，一个是默认的‘/’，另一个是‘/Hi’.在两个路径下的components里面，我们对三个区域都定义了显示内容。最后页面展示如下图：



九、 如何设置404页面
用户会经常输错页面，当用户输错页面时，我们希望给他一个友好的提示页面，这个页面就是我们常说的404页面。vue-router也为我们提供了这样的机制。

设置我们的路由配置文件（/src/router/index.js）
{
   path:'*',
   component:Error
}
这里的path:'*'就是输入地址不匹配时，自动显示出Error.vue的文件内容

在/src/components/文件夹下新建一个Error.vue的文件。简单输入一些有关错误页面的内容。
<template>
    <div>
        <h2>{{ msg }}</h2>
    </div>
</template>
<script>
export default {
  data () {
    return {
      msg: 'Error:404'
    }
  }
}
</script>
此时我们随意输入一个错误的地址时，便会自动跳转到404页面

