* []()
    * [1. ]()
    
* []()
    * [1. ]()
    
* []()
    * [1. ]()
    
* []()
    * [1. ]()
    
    
# 
### why vuex
Vuex 是一个专为 Vue 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

![vuex](https://vuex.vuejs.org/flow.png)

```js
new Vue({
  // state: 视图是由state数据驱动的
  data () {
    return {
      count: 0
    }
  },
  // view: 视图上可以响应用户的一些交互派发actions
  template: `
    <div>{{ count }}</div>
  `,
  // actions: 可以对state进行修改
  methods: {
    increment () {
      this.count++
    }
  }
})
```

```bash
# $emit与$on（派发监听事件）
当组件非常多非常复杂，到处派发监听事件代码很快变得难以维护
只应该把需要全局共享的数据放到vuex中

# 事件总线

# 单独维护state
将state从组件中剥离出去，相当于将这些东西在外层再打包一层，将组件级别的数据变成应用级别的数据

显示定义一个全局对象，再去上层封装一些数据存取的接口不是也可以吗？
1. vuex 状态存储是响应式的，vue组件从 store 中读取状态时，若 store 中状态发送变化，那么相应的组件
也会得到相应的更新

2. 只能通过显示的提交（commit）mutation 更方便的跟踪每一个状态的变化，更方便的追踪每一个状态的变化
```

vuex作为vue的一个生态插件，也是通过npm发布的，我们再import的时候，是通过 rollup 技术打包了 `src/index.js` 中的代码

```js
export default {
  // new Vuex.Store
  Store,
  // Vue.use(vuex) 执行 install 方法
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```
new vue 的时候传入了 store

const app = new Vue({
  el: "#app",
  store
});

```js
// 在 beforeCreate 钩子函数混入 vuexInit
Vue.mixin({ beforeCreate: vuexInit })

// 和 Vue router 非常相似，通过这样的我们将所有 vue 实例都混入了 this.$store 对象
// 非根组件就像 parent 上面找
function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
```
执行 
const store = new Vuex.Store({
  modules: {
    modules: {
      A: moduleA
    },
    state: {
      count: 1
    }
  }
});








