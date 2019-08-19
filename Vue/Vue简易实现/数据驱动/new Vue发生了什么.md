* [Library VS Framework](#library-vs-framework)
* [一：数据驱动](#%E4%B8%80%E6%95%B0%E6%8D%AE%E9%A9%B1%E5%8A%A8)

* [二：`new Vue` 发生了什么？](#%E4%BA%8Cnew-vue-%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88)
    * [1. 混入 `_init` 方法](#1-%E6%B7%B7%E5%85%A5%E7%9A%84-_init-%E6%96%B9%E6%B3%95%E4%B8%BB%E8%A6%81%E5%81%9A%E4%BA%86%E4%B8%80%E5%A0%86%E5%88%9D%E5%A7%8B%E5%8C%96%E7%9A%84%E5%B7%A5%E4%BD%9C)
    * [2. 初始化 data](#2-%E5%88%9D%E5%A7%8B%E5%8C%96-data)

    
看源码比较忌讳想要一次把所有流程上的分支条件都看清楚，经常会看一看你就不知道自己在看什么了...

```
noop: 空函数


```

#
### Library VS Framework

#### Library
* 本质上是一些函数的集合 [每次调用函数，实现一个特定的功能，接着把控制权交给使用者]
* Jquery 库的核心：封装 DOM，简化 DOM 操作

#### Framework：
* 是一套完善的解决方案 [You call Library, Frameworks call you]


### 一：数据驱动

> 核心思想：数据驱动

> 今天只分析数据是怎么映射到 DOM 的，其实数据驱动还有一个核心思想就是由数据的变化来驱动视图的变化 => 深入响应式原理

```
# 数据驱动
1. 指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。
2. 它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。

3. 特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，
 我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。
```

### 二：new Vue 发生了什么？

```
将 JavaScript 定义的数据渲染到了 DOM 上，这就是 new Vue 的时候帮我们做的事情
```

```js
// Vue 类的实现
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  
  }
  this._init(options) // 传入我们的配置对象 [Vue 原型方法]
}
```

#### 1. 混入的 `_init` 方法，主要做了一堆初始化的工作

```bash
1. 定义 uid

2. 合并 options，可以理解为会把我们传入的 options 最终都 merge 到 $.options 上
可以通过 $options.el/data 访问到选项对象 中的 el/data

3. 一堆初始化函数，逻辑非常清楚
生命周期、事件中心、render、state

4. 对传入的 el 做挂载操作
vm.$mount(vm.$options.el)
```

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // a uid
  vm._uid = uid++ 

  let startTag, endTag
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`
    endTag = `vue-perf-end:${vm._uid}`
    mark(startTag)
  }

  // a flag to avoid this being observed
  vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }
  // expose real self
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    vm._name = formatComponentName(vm, false)
    mark(endTag)
    measure(`vue ${vm._name} init`, startTag, endTag)
  }

  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

#
#### 2. 初始化 data

```bash
1. 在生命钩子beforeCreate与created之间初始化选项对象，这也就是Vue对options中的数据进行“响应式化”的过程。

2. 其他option参数双向绑定的核心原理是一致的。
```

```bash
1. 如果定义了 props，就初始化 props
initProps(vm, opts.props)

2. ...，就初始化 methods
initMethods(vm, opts.methods)

3. ...，就初始化 data [重点介绍一下]
initData(vm)
```

```js
/*初始化props、methods、data、computed与watch*/
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  /*初始化data*/
  if (opts.data) {
    initData(vm)
  } else {
    /*该组件没有data的时候绑定一个空对象*/
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}
```

#### `initData`

```js
function initData (vm: Component) {

  /*得到data数据*/
  let data = vm.$options.data
  /*判断data是一个函数（推荐）还是对象，并且存储到data和vm._data 中*/
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  /*判断是否是对象*/
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn()
  }

  // proxy data on instance
  /*遍历data对象*/
  const keys = Object.keys(data)
  const props = vm.$options.props
  let i = keys.length

  //遍历data中的数据
  while (i--) {
    /*保证data中的key不与props中的key重复，props优先，如果有冲突会产生warning*/
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn()
    } else if (!isReserved(keys[i])) {
      /*判断是否是保留字段*/

      /*!代理: 将data上面的属性代理到了vm实例上*/
      proxy(vm, `_data`, keys[i])
    }
  }
  // observe data
  /*从这里开始我们要observe了，开始对数据进行绑定，这里有尤大大的注释asRootData，这步作为根数据，下面会进行递归observe进行对深层对象的绑定。*/
  observe(data, true /* asRootData */)
}
```

> vm 对象对 data 数据进行代理

```js
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

