* [生成 render 函数](#%E4%B8%80%E7%94%9F%E6%88%90-render-%E5%87%BD%E6%95%B0)
    * [1. 重新定义 $mount 方法](#1-%E9%87%8D%E6%96%B0%E5%AE%9A%E4%B9%89-mount-%E6%96%B9%E6%B3%95)
    * [2. render 方法](#2-render-%E6%96%B9%E6%B3%95)
    * [3. 编译相关](#3-%E7%BC%96%E8%AF%91%E7%9B%B8%E5%85%B3)
    
* [Vue 原型 mount 方法](#%E4%BA%8Cvue-%E5%8E%9F%E5%9E%8B-mount-%E6%96%B9%E6%B3%95)
    * [1. 渲染 watcher 的概念](#1-%E6%B8%B2%E6%9F%93-watcher-%E7%9A%84%E6%A6%82%E5%BF%B5)

* [_render 渲染实例为VNode](#%E4%B8%89_render-%E6%B8%B2%E6%9F%93%E5%AE%9E%E4%BE%8B%E4%B8%BAvnode)
    
* [_update 更新视图](#%E5%9B%9B_update-%E6%9B%B4%E6%96%B0%E8%A7%86%E5%9B%BE)
    * [1. 浏览器环境下的 patch 方法](#1-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84-patch-%E6%96%B9%E6%B3%95)
    * [2. patch 函数的实现](#2-patch-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0)
    * [3. createElm 创建真实的 DOM 节点](#3-createelm-%E5%88%9B%E5%BB%BA%E7%9C%9F%E5%AE%9E%E7%9A%84-dom-%E8%8A%82%E7%82%B9)

    
## Vue 实例挂载的实现

![vue 实例挂载实现](https://ustbhuangyi.github.io/vue-analysis/assets/new-vue.png)

### 一：生成 render 函数

* `runtimeonly`: template 是无法编译的
* `runtime-compiler 版本`

#### 1. 重新定义 $mount 方法 

```bash
# vue $mount 原型方法

src/platform/web/runtime/index.js # public mount method

src/platform/web/entry-runtime-with-compiler.js # 缓存 public mount method 后重写
因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理
```

```bash
# 首先缓存了原型上的 $mount 方法，再重新定义该方法，我们来分析下重新定义的这段方法

1. 首先，它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。 [会直接进行覆盖的]
2. 接下来的是很关键的逻辑 —— render 方法 || 在线编译为 render 方法
3. 最后，调用原先原型上的 $mount 方法挂载。
```

#
####  2. render 方法

> 所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用SPA开发组件，还是写了 el 或者 template 属性，`**最终都会被编译成 render 方法**`

```bash
* 如果没有定义 render 方法
   (1) [从 el 或 template]获取 template
        -> el: template = getOuterHTML(el)
        -> template:
           * 字符串 [cache 缓存该方法查询结果]
             template = (1. el = query(id) && 2. return el.innerHTML)
           * DOM 对象
             template.innerHTML
         
   (2) template 在线编译为 render 方法 [compileToFunctions]

* 有 render 函数，go on...

 
# return mount.call(this, el) // 最终调用 Vue 原型 mount 方法实现挂载
```


```js
Vue.prototype.$mount = function (
        el?: string | Element,
    ): Component {
        // query: return querySelector(el) || 已经是 DOM 对象
        el = el && query(el)

        const options = this.$options
        // resolve template/el and convert to render function
        if (!options.render) {
            let template = options.template

            if (template) {
                if (typeof template === 'string') {

                    // 1. template: 字符串，cache 缓存该方法查询结果
                    // 2. el = query(id) -> el.innerHTML
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template)
                    }
                    // 3. template: DOM 对象直接取 innerHTML
                } else if (template.nodeType) {
                    template = template.innerHTML
                }
                
            } else if (el) {
                template = getOuterHTML(el)
            }
            // 编译相关
            if (template) {

                const { render, staticRenderFns } = compileToFunctions(template, {
                    outputSourceRange: process.env.NODE_ENV !== 'production',
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                }, this)
                options.render = render
                options.staticRenderFns = staticRenderFns
            }
        }
        return mount.call(this, el) // 调用缓存Vue原型的mount方法
    }
```

#
####  3. 编译相关

> template 编译成 render 方法的过程非常重要，但编译的过程是非常复杂的。

```bash
1. 调用 compileToFunctions 生成一个 render 函数和一个 staticRenderFns

options.render = render # 渲染 Vnode 时会用到
options.staticRenderFns = staticRenderFns
```



### 二：Vue 原型 mount 方法

```js
// public mount method
Vue.prototype.$mount = function (
    el?: string | Element,
): Component {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el)
}
```

#
#### 1. 渲染 watcher 的概念

```bash
Watcher 在这里起到两个作用：

1. 初始化的时候会执行回调函数
2. 当 vm 实例中的劫持的数据发生变化的时候执行回调函数
```

```bash
# mountComponent

1.  核心就是先实例化一个渲染 Watcher
2. new Watcher 的回调函数中调用 updateComponent
     * vm._render() // 生成虚拟 Node
     * vm._update(VNode) // 更新 DOM
```

> 渲染 watcher 的概念，和响应式原理强相关的一个类，其实就是观察者模式，也有很多自定义 watcher

```js
export function mountComponent(
     vm: Component,
     el: ?Element,
 ): Component {
     vm.$el = el
     if (!vm.$options.render) {
         vm.$options.render = createEmptyVNode // 创建一个空的 VNode
     }
     callHook(vm, 'beforeMount')

     let updateComponent

     updateComponent = () => {
         vm._update(vm._render())
     }

     new Watcher(vm, updateComponent, noop, {
         before() {
             if (vm._isMounted && !vm._isDestroyed) {
                 callHook(vm, 'beforeUpdate')
             }
         }
     }, true /* isRenderWatcher */)

     // manually mounted instance, call mounted on self
     // mounted is called for render-created child components in its inserted hook
     if (vm.$vnode == null) {
         vm._isMounted = true
         callHook(vm, 'mounted')
     }
     return vm
 }
```

```bash
# 注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。

1. vm._isMounted = true：表示这个实例已经挂载了
2. 同时执行 mounted 钩子函数。 
```

#
###  三：_render 渲染实例为 VNode

* 编译生成 `render函数`
* 手写 `render函数`


```bash
# vm._render 最终是通过执行 createElement 方法并返回的是 vnode
_render 方法用来把实例渲染为一个虚拟 Vnode

1. 模板编译成的 render 函数：vm._c
2. 手写 render 函数：vm.$createElement
```

```bash
# 模板与插值语法
1. 在html中定义了插值，在未执行vue的时候会先把这个东西渲染出来
2. 在new vue之后执行mounted的时候再从插值替换为我们真实的数据


# render函数
render函数是在执行完之后，再将我们的message替换上去，更好的体验 [不会再渲染插值] ，Vue 不会从 template 选项
或 el 选项指定挂载元素中提取出 HTML template 编译渲染函数。


# render API：
1. render (createElement) => return createElement()
   # createElement() => VNode
2. 函数组件还会接收额外 context 参数，为没有实例的函数组件提供上下文信息。


```

```html
<div id="app">
  {{ message }}
</div>

```

```js
// 相当于上面的插值语法
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

> 可以看到，`render 函数`中的 `createElement` 方法就是 `vm.$createElement` 方法，vm.$createElement 是在 initRender（初始化render） 中定义的，_renderProxy 就是通过 ES6 proxy 进行代理

```js
Vue.prototype._render = function () {
   // ... 
   // vm._renderProxy: proxy 实例代理了 vm [has 拦截判断对象属性的操作]
   vnode = render.call(vm._renderProxy, vm.$createElement)
   
   // ...
   if (!(vnode instanceof VNode)) {
       // 根节点只能有一个 Vnode
       if (Array.isArray(vnode)) {
           warn()
       }
       vnode = createEmptyVNode()
   }
}


```

```js
export function initRender (vm: Component) {
  // ... 
  // 编译生成 render函数
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false) 
  // 手写 render函数
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```


#
###  四：_update 更新视图


* 首次渲染时会调用 `_update` 将 VNode 映射为真实的 DOM
* 响应式原理：数据更新（`_update`）驱动视图变化


```js
Vue.prototype._update = function (vnode: VNode) {
  // 这些参数都是在数据更新的时候使用的
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  
  activeInstance = vm
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) { 
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
...
```

> 定义patch方法
 

```
// 浏览器端才有 patch 方法，否则是空函数（服务端 nodeJs 是不可能碰到 DOM 的）
// platforms/web/runtime/index.js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

```bash
# 这个方法在 weex 和 web 平台上的定义是不同的
weex操作DOM API与web平台不同
```

#
#### 1. 浏览器环境下的 patch 方法


```js
// nodeOps：封装了一系列 DOM 操作的方法
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
// DOM 上属性、class、style等由模块生成
// platformModules下定义了很多属性、类的一些钩子函数，在patch过程中，会调用不同模块的钩子函数
import platformModules from 'web/runtime/modules/index'


const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })

```

#### 1.1 函数柯里化技巧

```bash
# createPatchFunction

1. 定义了很多很多辅助函数，最后返回了patch方法

2.思考：Vue 为什么绕了这么大一圈，将 patch 定义在这里呢？实际上应用的是函数柯里化的技巧
   * 因为 vueJs 跨端可以跑在 web 上和 Weex 上「操作 DOM API 是不同的」，nodeOps 和 modules 是和平台相关的
   * 通过函数柯里化的技巧可以一次传入 patch 函数
   
如果我们自己写的话，免不了很多 if「web」-else「Weex」 条件分支的判断，闭包的技巧直线对 nodeOps 和 modules 的持有，
在接下来调用方法时，不用再传入这些差异化的参数
```


#
#### 2. patch 函数的实现

```js
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)

我们在页面首次渲染时传入的参数
1. oldVnode = vm.$el # 挂载DOM元素
2. vnode = vnode # 实例渲染的Vnode
```

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend
  
  // 遍历模块拿到钩子 
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ...

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {..} 
    
    else {
      // 显然首次渲染时是一个真实的DOM
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) { // 数据更新时的逻辑
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else { 
        if (isRealElement) {
          // 服务端渲染逻辑
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
           
          // 将挂载的DOM转换为Vnode
          oldVnode = emptyNodeAt(oldVnode)
        }

        // 缓存转换前的挂载DOM元素
        const oldElm = oldVnode.elm
        // 挂载DOM的父元素body
        const parentElm = nodeOps.parentNode(oldElm)

        // 挂载vnode到真实的DOM上 [首次渲染parentElm为body]
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. 
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {..}

        // 我们新创建了一个结点，从父节点删除掉原来 DOM 结点，替换完成
        // 在html、body元素上进行挂载warn的原因
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }
    // 执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

#
#### 2.1 createElm 创建真实的 DOM 节点

```bash
# 通过Vnode创建真实的 DOM 并插入到它的父节点中
1. createComponent 方法目的是尝试创建子组件
2. 判断 vnode 是否包含 tag
   * Y：检验是否是一个合法标签，然后再去调用平台 DOM 的操作去创建一个占位符元素
   * N：注释或纯文本节点，调用 insert 直接插入即可
3. 调用 createChildren 递归创建子元素
4. 最后调用 insert 将元素插入父节点中
```


```js
function createElm (
 vnode,
 insertedVnodeQueue,
 parentElm,
 refElm,
 nested,
 ownerArray,
 index
) {
 if (isDef(vnode.elm) && isDef(ownerArray)) {
   // This vnode was used in a previous render!
   // now it's used as a new node, overwriting its elm would cause
   // potential patch errors down the road when it's used as an insertion
   // reference node. Instead, we clone the node on-demand before creating
   // associated DOM element for it.
   vnode = ownerArray[index] = cloneVNode(vnode)
 }

 vnode.isRootInsert = !nested // for transition enter check
 // 尝试创建子组件
 if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
   return
 }

 const data = vnode.data
 const children = vnode.children
 const tag = vnode.tag
 // 是否包含 tag 标签
 if (isDef(tag)) {
   if (process.env.NODE_ENV !== 'production') {
     if (data && data.pre) {
       creatingElmInVPre++
     }
     if (isUnknownElement(vnode, creatingElmInVPre)) {
       warn()
     }
   }
   // 创建占位符元素
   vnode.elm = vnode.ns
     ? nodeOps.createElementNS(vnode.ns, tag)
     : nodeOps.createElement(tag, vnode)
   // 设置css作用域
   setScope(vnode)
   
  // 创建子元素
  // DFS（遍历子虚拟节点，递归调用 createElm）
  // 遍历过程中把vnode.elm作为父容器的DOM节点占位符传入
  createChildren(vnode, children, insertedVnodeQueue)
  if (isDef(data)) {
    invokeCreateHooks(vnode, insertedVnodeQueue)
  }
  insert(parentElm, vnode.elm, refElm)

   if (process.env.NODE_ENV !== 'production' && data && data.pre) {
     creatingElmInVPre--
   }
 } 
 // 不包含 tag 标签可能是注释节点或纯文本节点
 // 可以直接插入到DOM树中
 else if (isTrue(vnode.isComment)) {
   vnode.elm = nodeOps.createComment(vnode.text)
   insert(parentElm, vnode.elm, refElm)
 } else {
   vnode.elm = nodeOps.createTextNode(vnode.text)
   insert(parentElm, vnode.elm, refElm)
  }
 }
```

#
#### 2.2 createChildren 创建子元素

```js
function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
        if (process.env.NODE_ENV !== 'production') {
            // 校验节点 key 属性
            checkDuplicateKeys(children)
        }
        for (let i = 0; i < children.length; ++i) {
            // 深度优先遍历创建子元素
            createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        }
    } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
}
```

#
#### 2.3 insert 将元素插入父节点

```js
function insert(parent, elm, ref) {
    if (isDef(parent)) {
        if (isDef(ref)) {
            if (ref.parentNode === parent) {
                nodeOps.insertBefore(parent, elm, ref)
            }
        } else {
            nodeOps.appendChild(parent, elm)
        }
    }
}
```


#
#### 3. createElm 创建真实的 DOM 节点

```js
function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
        if (isDef(i.create)) i.create(emptyNode, vnode)
        if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
}

```


