#

### 组件

> 核心：可复用性 [组件名：不要现有标准或保留字冲突 -- "todo" is bad choice]








### 渲染函数 & JSX

模板创建 html 需要编译，render 方法可以直接使用

尽管这很简单，但是仍需要把握他的精髓，你可能得不到编译器的支持（runtime-only）、或者模板很重，有几种定义模板的方式，今天展示的是 x/template，给他一个 id，因为我们需要引用这个模板（css selector），而且组件模板只能有一个根元素呐（always use wrapper）











##

![组件通信](https://camo.githubusercontent.com/8ce120d11178c0a9f41fa1812ee4078883dad5d0/687474703a2f2f75706c6f61642d696d616765732e6a69616e7368752e696f2f75706c6f61645f696d616765732f333137343730312d376131356563333532623465376438343f696d6167654d6f6772322f6175746f2d6f7269656e742f7374726970253743696d61676556696577322f322f772f31323430)

#
## 构建简易组件

与 Vue 构建方式相同，但并不需要挂载组件，因为组件的核心就是可复用性，每个组件拥有自己的模板，1. 字符串 2. render 函数，组件可以向 html 标签一样使用
每个组件维护一份 copy 数据对象 data，不同组件之前作用域是相互独立的，这就意味着不同组件之间的数据无法相互引用


* slot：父组件传递内容
* props：父组件传递数据


### `slot`

```bash
# 内容：任意 html 标记
使用 slot 分发父组件内容，替代了 props 单向数据流，slot 元素在组件渲染时会被替换为分发内容，slot 内容作为子组件编译


# 展示不同的内容
我们可能需要用 slot 展示不同的内容，slot 元素有个特殊的 attributes name 以用来定义不同的 slot

<template v-slot:name>
<slot name="name"></slot>


# 默认 slot
<slot>default</slot>
```


### 1. `props`

我们可以使用 slot 接收父组件 html 标签内容，但现在，我们使用 prop 进行传值，为了使用 prop，需要定义组件接收的 props 选项，我们可以像使用 data 一样去使用 props 属性

```html
 <div id="app">
     <!-- 动态 bind -->
     <plan :name="dynaminc"></plan>
     <plan name="curious"></plan>
     <plan name="addict"></plan>
 </div>
<script>
    new Vue.component('plan', {
        // 可以在 prop 中定义一个带有验证需求的对象
        props: 
            name: {
                default: 'xy',//默认值
                type: String,//类型检查
                require: true,//必填
                validator (val) {//自定义验证函数
                    return val.indexOf('xy') !== -1
            }
        },
        template: '<div>{{this.name}}</div>',
    })

    new Vue({
        el: '#app',
        data: {
            dynaminc: '11'
        }
    })
</script>
```

```html
<plan v-for="plan in plans" :name="plan"></plan>

<script>
    new Vue.component('plan', {
        template: '<div>{{this.name}}</div>',
    })

    new Vue({
        el: '#app',
        data: {
            // 使用 v-for 定义相同输出，尝试让我们的组件可读性更高
            plans: ['single', 'curious', 'addict']
        }
    })
</script>
```

### 2. 嵌套 components

现在我们需要在应用的其他组件中使用我们的 component，首先我们要确保 vue 实例内部拥有 data 数据对象，我们向之前那样用 `<template>` 创建一个新的组件，并将我们已有的组件放入其中。并将最外层 new Vue 中的 data 移动到父组件中维护（copy 时 data 必须是函数），这样我们的组件就可以独立使用了
 
 ```html
 <div id="app">
    <h2 class="subtitle">hello reuseable & effective</h2>
    <planb></planb>
</div>

<template id="child">
    <!-- 子组件模板 -->
    <div class="child">
        <input :placeholder="name">
    </div>
</template>

<template id="parent">
    <div class="parent">
        <!-- 嵌套子组件 -->
        <plan v-for="plan in plans" :name="plan"></plan>
    </div>
</template>
 ```
 
 ```js
Vue.component('child', {
    template: '#child',
    props: ['name'],
    data() {
        return {
            plans: ['name', 'age', 'mail'],
        }
    },
})

Vue.component('parent', {
    template: '#parent',
    props: ['name'],
})

new Vue({
    el: '#app',
})
 ```
  
## 全局 / 局部注册

到目前为止我们都可以使用 Vue.components 的方式进行注册，这是一种全局注册的方式，让我们的组件可以在全局应用中使用，但如果你使用一个如 webpack 一样的构建工具的话，即使你不再使用这个组件了，它最终还是会出现在打包结果中，这无疑成为了 JavaScript 的冗余代码，你的用户还不得不将他下载，相反，对于一些组件来说，并没有必要对他们进行全局注册，例如我们不会在 parentComponent 外使用 childComponent 组件，在这样的情形下，我们可以将组件定义为一个 JavaScript 对象，在需要他的父组件中对其进行注册。【如果没有父组件，就在根组件进行注册】

```js
// Vue 代码详见上一小节 demo
let childComponent = {
    template: '#child',
    props: ['name'],
}

let parentComponent = {
    template: '#parent',
    props: {
        name: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            plans: ['name', 'age', 'mail'],
        }
    },
    components: {
        //{key: 组件名称, value: 组件对象}
        plan: childComponent
    }
}

new Vue({
    el: '#app',
    components: {
        planb: parentComponent
    }
})
```

总结一下：我们只需要对必要的组件进行全局注册，如 basebutton、input，剩余的组件我们都进行局部注册

组件通信：当我们有嵌套组件时，我们需要找到一个方法进行组件间的数据通信，我们知道我们可以使用 props 像子组件传递数据，但我们不知道如何通过孩子像父组件传递数据，我们看下面这个 demo 进行理解学习






Vue.component( id, [definition] )




注册或获取全局组件。注册还会自动使用给定的id设置组件的名称

// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', { /* ... */ })

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component('my-component')

vue 组件全局注册无法使用 [一个很好的切入点，从组件扩展到 new Vue 的过程]

在上述使用 webpack 打包的项目需要使用独立构建的 Vue 库，而在 node_modules/vue/package.json 文件中，已经通过 main 属性指定了通过 import Vue from 'vue' 或 require('vue') 所引入的文件是 dist/vue.runtime.common.js，即运行时构建的 Vue 库。直接在 HTML 文件中使用 script 标签引入的是独立构建的 Vue 库


#
### `$emit` / `$on`

> eventbus 解决了兄弟组件之间事件传递问题,本质是订阅发布者模式

```bash
# 事件中心
1. eventbus 通过一个空的Vue实例作为中央事件总线，用它来触发事件和监听事件，巧妙而轻量地实现了任何组件间的通信
2. 订阅者跟发布者都引用这个 `空的Vue实例` ，来完成订阅发布者，摆脱了兄弟之间需要父组件转而传递的复杂

```

#
### `$attrs` / `$listeners`

```
`$attrs` : 父组件中绑定的非 prop 属性
 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。

`$listeners` : 父组件中绑定的非原生事件 (不含 .native 修饰器的)
```

#
### `$parent / $children` 与 `$ref`

```html
<map>
  <markers"></markers>
</map>
           
<map>
    <region>
        <!--  -->
        <markers"></markers>
    </region>
</map>
```

```bash
# $ref
获取组件 / 元素: 只会在组件渲染完成之后生效，并且它们不是响应式的


# $parent
访问父级组件实例: 代替 props 但是数据流向难以调试理解

/*在 markers 内部需要一些类似这样的 hack*/
var map = this.$parent.map || this.$parent.$parent.map

# $parent 属性无法很好的扩展到更深层级的嵌套组件，这就是向任意更深层级的组件提供上下文信息时推荐依赖注入的原因。
```

#
### `provide` / `inject`

provide: 父组件对想要提供给后代的数据 / 方法进行注入，相比 `$parent` 来说，我们在任意后代组件中访问 getMap，而不用暴露整个 `<map>` 实例

```
//父组件
provide: function () {
  return {
    getMap: this.getMap
  }
}

//任意后代组件
inject: ['getMap']
```

```bash
负面影响：
1. 组件关系耦合，重构困难
2. 数据非响应式
3. 想在祖先中更新数据，使用 vuex
```

组件生命周期：
每个 Vue 实例在创建的时候都会经过一系列初始化的步骤，在这个过程也会运行一些叫做生命周期钩子的函数，给了用户在不同阶段添加自己代码的机会。



组件命名：动词 + 名词
1. Mutil-word [所有 html 标签都是 single word]
2. 紧密耦合组件-前缀命名相同 [TodoList, TodoItem TodoBtn]
3.  .vue 文件名单词始终 PascalCase 或者 kebab-case












