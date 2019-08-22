## Vuex

Vue.js开发复杂的应用时，经常会遇到多个组件共享同一个状态，亦或是多个组件会去更新同一个状态，在应用代码量较少的时候。

1. 我们可以组件间通信去维护修改数据
1. 通过事件总线「event bus」来进行数据的传递以及修改。

但是当应用逐渐庞大以后，代码就会变得难以维护，从父组件开始通过 prop 传递多层嵌套的数据由于层级过深而显得异常脆弱，而事件总线也会因为组件的增多、代码量的增大而显得交互错综复杂，难以捋清其中的传递关系。

那么为什么我们不能将数据层与组件层抽离开来呢？把数据层放到全局形成一个单一的Store，组件层变得更薄，专门用来进行数据的展示及操作。所有数据的变更都需要经过全局的 Store 来进行，形成一个单向数据流，使数据变化变得“可预测”。

Vuex 是对 Vue.js应用程序进行状态管理的库，它借鉴了 Flux、redux 的基本思想，将共享的数据抽离到全局，以一个单例存放，同时利用 Vue.js 的响应式机制来进行高效的状态管理与更新。正是因为Vuex使用了Vue.js内部的“响应式机制”，所以 Vuex 是一个专门为Vue.js设计并与之高度契合的框架「简洁高效但是只能 vuex 使用...」

先来看一下这张Vuex的数据流程图，熟悉Vuex使用的同学应该已经有所了解。

![vuex](https://vuex.vuejs.org/vuex.png)

Vuex实现了一个单向数据流，

* 全局拥有 State 存放数据「所有修改 State 的操作必须通过 Mutation 进行」
* Mutation 的同时提供了订阅者模式供外部插件调用获取 State 数据的更新
* 所有异步接口需要走 Action「通过 Mutation 修改 State」

最后，根据 State 的变化，渲染到视图上。Vuex 运行依赖 Vue 内部数据双向绑定机制，需要 new一个Vue 对象来实现“响应式化”

#
### 安装

#### 1. Vue.use()
vuex 的引入如下，十分简单，那么问题来了，Vuex是怎样把store注入到Vue实例中去的呢？
```
Vue.use(Vuex);

/*将store放入Vue创建时的option中*/
new Vue({
    el: '#app',
    store
});
```

Vue 提供了 Vue.use 方法用来给 Vue 安装插件，内部通过调用插件的 install 方法(当插件是一个对象的时候)来进行插件的安装。

我们来看一下 Vuex 的 install 实现。

```
/*暴露给外部的插件 install 方法，供 Vue.use 调用安装插件*/
export function install (_Vue) {
  if (Vue) {
    /*避免重复安装（Vue.use内部也会检测一次是否重复安装同一个插件）*/
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  /*保存Vue，同时用于检测是否重复安装*/
  Vue = _Vue
  /*将 vuexInit 混淆进 Vue 的 beforeCreate*/
  applyMixin(Vue)
}
```

这段 install 代码做了两件事情，一件是防止 Vuex 被重复安装，另一件是执行 applyMixin，目的是执行 vuexInit 方法初始化 Vuex。如果是 Vue1.0，Vuex 会将 vuexInit 方法放入Vue的_init方法中，而对于 Vue2.0，则会将 vuexinit 混淆进Vue的 beforeCreate 钩子中。来看一下 vuexInit 的代码。

#
#### 2. applyMixin 方法的定义与使用

`Vue.mixin({ beforeCreate: vuexInit })`

```
 /*Vuex的init钩子，会将 store 存入每一个Vue实例钩子列表*/
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      /*存在store其实代表的就是Root节点，直接执行store（function时）或者使用store（非function）*/
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      /*子组件直接从父组件中获取$store，这样就保证了所有组件都公用了全局的同一份store*/
      this.$store = options.parent.$store
    }
  }
```
vuexInit会尝试从options中获取store

1. 当前组件是根组件（Root节点），则options中会存在store，直接获取赋值给$store即可
1. 当前组件是非根组件，则通过options中的parent获取父组件的$store引用。这样一来，所有的组件都获取到了同一份内存地址的Store实例，于是我们可以在每一个组件中通过this.$store愉快地访问全局的Store实例了。

那么，什么是Store实例？

#
### Store

我们传入到根组件的store，就是Store实例，用Vuex提供的Store方法构造。

#### 1. 首先是构造函数

```
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules
  // ...
})
```

Store 对象的构造函数接收一个对象参数，它包含 actions、getters、state、mutations、modules 等 Vuex 的核心概念，this._rawModule 表示模块的配置，this._children 表示它的所有子模块，this.state 表示这个模块定义的 state

```
constructor (options = {}) {
    /*
      在浏览器环境下，如果插件还未安装（!Vue即判断是否未安装），则它会自动安装。
      它允许用户在某些情况下避免自动安装。
    */
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `Store must be called with the new operator.`)
    }

    const {
      /*一个数组，包含应用在 store 上的插件方法。这些插件直接接收 store 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）*/
      plugins = [],
      /*使 Vuex store 进入严格模式，在严格模式下，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误。*/
      strict = false
    } = options

    /*从option中取出state「es6 解构赋值」对象*/
    let {
      state = {}
    } = options
    if (typeof state === 'function') { /* 如果state是function则执行，最终得到一个对象 */
      state = state()
    }

    // store internal state
    /* 用来判断严格模式下是否是用mutation修改state的 */
    this._committing = false
    /* 存放action */
    this._actions = Object.create(null)
    /* 存放mutation */
    this._mutations = Object.create(null)
    /* 存放getter */
    this._wrappedGetters = Object.create(null)
    /* module收集器 */
    this._modules = new ModuleCollection(options)
    /* 根据namespace存放module */
    this._modulesNamespaceMap = Object.create(null)
    /* 存放订阅者 */
    this._subscribers = []
    /* 用以实现Watch的Vue实例 */
    this._watcherVM = new Vue()

    /*将dispatch与commit调用的this绑定为store对象本身，否则在组件内部this.dispatch时的this会指向组件的vm*/
    const store = this
    const { dispatch, commit } = this
    /* 为dispatch与commit绑定this（Store实例本身） */
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    /*严格模式(使 Vuex store 进入严格模式，在严格模式下，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误)*/
    this.strict = strict

    /*初始化根module，这也同时递归注册了所有子module，收集所有module的getter到_wrappedGetters中去，this._modules.root代表根module才独有保存的Module对象*/
    installModule(this, state, [], this._modules.root)

    /* 通过vm重设store，新建Vue对象使用Vue内部的响应式实现注册state以及computed */
    resetStoreVM(this, state)

    // apply plugins
    /* 调用插件 */
    plugins.forEach(plugin => plugin(this))

    /* devtool插件 */
    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }
```

Store的构造类除了初始化一些内部变量以外，主要执行了installModule（初始化module）以及resetStoreVM（通过VM使store“响应式”）。

#
#### 模块的意义

> 允许嵌套子模块

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象「应用变得非常复杂时，store 对象可能会非常的臃肿」
```
const moduleA = {
  state: { ... },
  mutations: { ... },
}

const moduleB = {
  state: { ... },
  mutations: { ... },
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### installModule

installModule的作用主要是为module加上namespace名字空间（默认模块内 action、mutation 和 getter 是注册在全局命名空间的，）后，注册mutation、action以及getter，同时递归安装所有子module。

```
/*初始化module*/
function installModule (store, rootState, path, module, hot) {
  /* 是否是根module */
  const isRoot = !path.length
  /* 获取module的namespace */
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  /* 如果有namespace则在_modulesNamespaceMap中注册 */
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    /* 获取父级的state */
    const parentState = getNestedState(rootState, path.slice(0, -1))
    /* module的name */
    const moduleName = path[path.length - 1]
    store.`_withCommit`(() => {
      /* 将子module设成响应式的 */
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  /* 遍历注册mutation */
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  /* 遍历注册action */
  module.forEachAction((action, key) => {
    const namespacedType = namespace + key
    registerAction(store, namespacedType, action, local)
  })

  /* 遍历注册getter */
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  /* 递归安装mudule */
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

#
#### resetStoreVM
在说resetStoreVM之前，先来看一个小demo。

```
let globalData = {
    d: 'hello world'
};
new Vue({
    data () {
        return {
            $$state: {
                globalData
            }
        }
    }
});

/* modify */
setTimeout(() => {
    globalData.d = 'hi~';
}, 1000);

Vue.prototype.globalData = globalData;

/* 任意模板中 */
<div>{{globalData.d}}</div>
```

上述代码在全局有一个globalData，它被传入一个Vue对象的data中，之后在任意Vue模板中对该变量进行展示，因为此时globalData已经在Vue的prototype上了所以直接通过this.prototype访问，也就是在模板中的{{prototype.d}}。此时，setTimeout在1s之后将globalData.d进行修改，我们发现模板中的globalData.d发生了变化。其实上述部分就是Vuex依赖Vue核心实现数据的“响应式化”。

接着来看代码。

```
/* 通过vm重设store，新建Vue对象使用Vue内部的响应式实现注册state以及computed */
function resetStoreVM (store, state, hot) {
  /* 存放之前的vm对象 */
  const oldVm = store._vm 

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}

  /* 通过Object.defineProperty为每一个getter方法设置get方法，比如获取this.$store.getters.test的时候获取的是store._vm.test，也就是Vue对象的computed属性 */
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  /* Vue.config.silent暂时设置为true的目的是在new一个Vue实例的过程中不会报出一切警告 */
  Vue.config.silent = true
  /*  这里new了一个Vue对象，运用Vue内部的响应式实现注册state以及computed*/
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  /* 使能严格模式，保证修改store只能通过mutation */
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    /* 解除旧vm的state的引用，以及销毁旧的Vue对象 */
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

resetStoreVM首先会遍历wrappedGetters，使用Object.defineProperty方法为每一个getter绑定上get方法，这样我们就可以在组件里访问this.$store.getters.test就等同于访问store._vm.test。

```
forEachValue(wrappedGetters, (fn, key) => {
  // use computed to leverage its lazy-caching mechanism
  computed[key] = () => fn(store)
  Object.defineProperty(store.getters, key, {
    get: () => store._vm[key],
    enumerable: true // for local getters
  })
})
```

之后Vuex采用了new一个Vue对象来实现数据的“响应式化”，运用Vue.js内部提供的数据双向绑定功能来实现store的数据与视图的同步更新。

```
store._vm = new Vue({
  data: {
    $$state: state
  },
  computed
})
```

这时候我们访问store._vm.test也就访问了Vue实例中的属性。

这两步执行完以后，我们就可以通过this.$store.getter.test访问vm中的test属性了。




