#
![流程图](https://camo.githubusercontent.com/fe8c027c70f11d144c546f9612065c83a54f3c5b/68747470733a2f2f7374617469632e6f736368696e612e6e65742f75706c6f6164732f73706163652f323031372f303532312f3134343433355f636c59795f323931323334312e706e67)

如上图所示，我们可以看到，整体实现分为四步

1. 实现一个 `Observer` ，对数据进行劫持，通知数据的变化
1. 实现一个 `Compile` ，对指令进行解析，初始化视图，并且订阅数据的变更，绑定好更新函数
1. 实现一个 `Watcher `，将其作为以上两者的一个中介点，在接收数据变更的同时，让 `Dep` 添加当前 `Watcher` ，并及时通知视图进行 `update`
1. 实现MVVM，整合以上三者，作为一个入口函数




#
```js
  /**
   * @class 双向绑定类 new Vue(options)
   * 代理 vm.$data 中每个属性
   * observe:  实现对 Vue 自身 data 数据劫持，监听数据的属性变更，并在变动时进行 notify
   * Compile:  实现指令解析，初始化视图，并订阅数据变化，绑定好更新函数
   * Watcher:  1. 一方面接收 Observer 通过 dep 传递过来的数据变化，
   *           2. 一方面通知 Compile 进行 view update
   */
  function Vue (options) {
    this.$options = options || {};
    let data = this._data = this.$options.data; // vm.$data
    let self = this; // vue instance

    Object.keys(data).forEach(key => {
      self._proxyData(key); // this.msg 代理为 this.data.msg
    });
    observe(data, this);
    new Compile(options.el || document.body, this);
  }
  Vue.prototype = {
    /**
     * [属性代理]
     * @param  {[type]} key    [数据key]
     * @param  {[type]} setter [属性set]
     * @param  {[type]} getter [属性get]
     */
    _proxyData: function (key, setter, getter) {
      let self = this;
      setter = setter ||
      Object.defineProperty(self, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return self._data[key]; // 触发 getter
        },
        set: function proxySetter(newVal) {
          self._data[key] = newVal; // 触发 setter
        }
      })
    }
  }
```

#
#### 数据劫持

1. 使数据对象变得'可观测'，让属性!!「主动」告诉我们他被读取或修改了：Object.defineProperty()

2. 劫持 data 所有属性：

```js
Object.keys(data).forEach(key => {
  observeProperty(data, key, data[key])
})
```

```js
/**
 * @class 观察者类 Observer that are attached to each observed
 * @param {[type]} value [vm参数]
 */
function observe(vm, asRootData) {
  if (!vm || typeof vm !== 'object') {
    return;
  }
  return new Observer(vm);
}
function Observer(vm) {
  this.vm = vm;
  if (Array.isArray(vm)) { // 响应式数组
    Object.setPrototypeOf(vm, arrayMethods)
    this.observeArray(value);
  } else {
    this.walk(vm) 
  }  
}
Observer.prototype = {
  walk: function (obj) {
    let self = this;
    Object.keys(obj).forEach(key => { // 劫持data所有属性
      self.observeProperty(obj, key, obj[key]);
    });
  },
  observeProperty: function (obj, key, val) {
    let dep = new Dep(); 
    let childOb = observe(val); // 递归

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.depend();
        }
        if (childOb) {
          childOb.dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (val === newVal || (newVal !== newVal && val !== val)) { // NaN
          return;
        }
        val = newVal;
        childOb = observe(newVal); // 监听子属性
        dep.notify(); // 通知数据变更
      }
    })
  }
}
let uid = 0;
 /*Watcher实例*/
/**
 * @class 依赖类 Dep
 */
function Dep() {
  this.id = uid++; // dep id

  this.subs = [];
}
Dep.target = null; // 缓存订阅者
Dep.prototype = {
  /**
   * [添加订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
  addSub: function (sub) { 
    this.subs.push(sub);
  },
  /**
   * [移除订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
  removeSub: function (sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
      this.subs.splice(index, 1);
    }
  },
  // 通知数据变更
  notify: function () { 
    this.subs.forEach(sub => {
      sub.update(); // 执行订阅者的update更新函数
    });
  },
  // add Watcher
  depend: function () {
    Dep.target.addDep(this);
  }
}
/**
 * @class 观察类 [Observer 是观察者类]
 * 
 * 解释下一 addDep 的逻辑
 * 观察者与依赖是一对一的关系，一个观察者维持了一系列订阅者对象，而订阅者对象只能订阅一个观察者
 * 
 * 1. 实例化的时候将自己添加到dep中
 * 2. 通过Dep接收数据更新的通知，调用自身update方法，触发Compile中绑定的更新函数，进而更新视图
 * 
 * @param {[type]}   vm      [vm.$data]
 * @param {[type]}   expOrFn [属性表达式]
 * @param {Function} cb      [回调函数(一半用来做view动态更新)]
 */
function Watcher(vm, expOrFn, cb) {
  this.vm = vm; // data
  expOrFn = expOrFn.trim();
  this.expOrFn = expOrFn;
  this.cb = cb;
  this.depIds = {}; // 维护不同订阅者的 id

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  }
  else {
    this.getter = this.parseGetter(expOrFn);// 简易循环依赖处理
  }
  this.value = this.get(); // 触发依赖收集
}
Watcher.prototype = {
  update: function () { // watcher 的 update() 操作
    this.run();
  },
  run: function () {
    let newVal = this.get(); // 获取新数据
    let oldVal = this.value;
    if (newVal === oldVal) {
      return;
    }
    this.value = newVal;
    this.cb.call(this.vm, newVal, oldVal);
  },
  get: function () {
    Dep.target = this; // 将当前订阅者指向自己
    let value = this.getter.call(this.vm, this.vm); // 触发getter，将自身添加到dep中
    Dep.target = null; // 添加完成 重置
    return value;
  },
  // 添加Watcher to dep.subs[] [一个 Watcher 实例最多对应一个 dep ]
  addDep: function (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
  parseGetter: function (exp) {
    if (/[^\w.$]/.test(exp)) return;

    let exps = exp.split('.');

    // 简易的循环依赖处理, 获取最里层属性
    return function (obj) {
      for (let i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    }
  }
}
```

```js
/**
 * 1. 该函数将挂载元素与 vue 实例 data 属性挂载到 Compile 实例的 $el 与 $vm 属性下
 * 2. 遍历过程中会有多次的 dom 操作，为提高性能我们会将 el 节点转化为 fragment 文档碎片进行解析操作
 * 
 * @param {传入挂载 Element} el 
 * @param {vm.$data: vm实例}  vm
 */
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el); /*是否为 Element 结点*/
  if (this.$el) {
    // 文档碎片
    this.$fragment = this.nodeFragment(this.$el);
    this.compileElement(this.$fragment);
    this.$el.appendChild(this.$fragment) /*将文档碎片放回真实dom*/
  }
}
/**
 * 遍历挂载结点下所有 Element（递归解析子节点）：
 *    1.Compile 实例通过 self 传递，可以通过 self.$vm 和 self.$el 访问 vm 实例与挂载元素
 *    2.Element（元素结点）：处理元素属性
 *    3.Text（文本结点）：正则匹配插值语法进行替换
 *    
 * @param {挂载 Element} this 
 * @param {挂载 Element 所有孩子结点}  childNodes
 */
Compile.prototype = {
  compileElement: function (el) {
    let self = this;
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{((?:.|\n)+?)\}\}/;/*插值法*/

      if (self.isElementNode(node)) { // 如果是element节点, 就进行指令解析
        self.compile(node);
      }
      else if (self.isTextNode(node) && reg.test(text)) { // 如果是text节点，匹配是存在插值语法
        self.compileText(node, RegExp.$1); // 匹配第一个选项
      }

      if (node.childNodes && node.childNodes.length) { // 递归解析子节点
        self.compileElement(node);
      }
    })
  },
  // 文档碎片
  nodeFragment: function (el) {
    let fragment = document.createDocumentFragment(); // 创建一个新的空白文档结点
    let child;

    while (child = el.firstChild) { // 子结点都放入文档碎片中
      fragment.appendChild(child);
    }
    return fragment;
  },
  /**
   * 指令解析：获取当前编译 Element 的所有属性
   * 遍历属性，根据不同指令调用不同指令处理与指令渲染合集
   * 
   * @param {当前编译 Element} self 
   * @param {当前结点所有属性}  nodeAttrs
   * @param {属性值表达式}  exp
   */
  compile: function (node) {
    let nodeAttrs = node.attributes;
    let self = this;

    [].slice.call(nodeAttrs).forEach(attr => {
      var attrName = attr.name;
      if (self.isDirective(attrName)) { /*筛选出v-属性*/
        var exp = attr.value;
        var dir = attrName.substring(2); /*截去 v-*/
        // 事件指令
        if (self.isEventDirective(dir)) {
          compileUtil.eventHandler(node, self.$vm, exp, dir);
        }
        // 普通指令
        else {
          compileUtil[dir] && compileUtil[dir](node, self.$vm.data, exp);
        }

        node.removeAttribute(attrName);
      }
    });
  },
  // {{ test }} 匹配变量 test
  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm.data, exp);
  },
  isElementNode: function (node) { // element节点
    return node.nodeType === 1;
  },
  isTextNode: function (node) { // text纯文本
    return node.nodeType === 3
  },
  isDirective: function (attr) { // x-XXX指令判定
    return attr.indexOf('x-') === 0;
  },
  // 事件指令判定
  isEventDirective: function (dir) {
    return dir.indexOf('on') === 0;
  },
}

// 定义$elm，缓存当前执行input事件的input dom对象
let $elm;
let timer = null;
// 指令处理集合 
// this 为 Compile 实例, 通过 self 传递
const compileUtil = {
  html: function (node, data, exp) {
    this.bind(node, data, exp, 'html');
  },
  text: function (node, data, exp) {
    this.bind(node, data, exp, 'text');
  },
  // v-model 与 vm.$data 中的属性双向绑定
  model: function (node, data, exp) {
    this.bind(node, data, exp, 'model');

    let self = this;
    let val = this._getVmVal(data, exp); // 获取挂载在 vm.$data 上的 value
    // 监听input事件
    node.addEventListener('input', function (e) {
      let newVal = e.target.value;
      $elm = e.target;
      if (val === newVal) {
        return;
      }
      // 设置定时器  完成ui js的异步渲染
      clearTimeout(timer);
      timer = setTimeout(function () {
        self._setVmVal(data, exp, newVal);
        val = newVal;
      })
    });
  },
  // 拼接处指令渲染合集
  bind: function (node, data, exp, dir) {
    let updaterFn = updater[dir + 'Updater'];

    // 指令渲染
    updaterFn && updaterFn(node, this._getVmVal(data, exp));

    // 订阅数据变化，绑定更新函数
    new Watcher(data, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  // 事件处理 v-on:click
  eventHandler: function (node, vm, exp, dir) {
    let eventType = dir.split(':')[1]; // click
    let fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  /**
   * [获取挂载在 vm.$data 上的 value]
   * @param  {[type]} data  [mvvm实例]
   * @param  {[type]} exp [expression]
   */
  _getVmVal: function (data, exp) {
    let val = data;
    exp = exp.split('.');
    exp.forEach(key => {/*简易的循环获取实际data属性*/
      key = key.trim();
      val = val[key];
    });
    return val;
  },
  /**
   * [设置挂载在 vm.$data 实例上的 value 值]
   * @param  {[type]} data    [mvvm实例]
   * @param  {[type]} exp   [expression]
   * @param  {[type]} value [新值]
   */
  _setVmVal: function (data, exp, value) {
    let val = data;
    exps = exp.split('.');
    exps.forEach((key, index) => {
      key = key.trim();
      if (index < exps.length - 1) {
        val = val[key];
      }
      else {
        val[key] = value;
      }
    });
  }
}
// 指令渲染集合
const updater = {
  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  },
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  modelUpdater: function (node, value, oldValue) {
    // 不对当前操作 input 进行渲染操作
    if ($elm === node) {
      return false;
    }
    $elm = undefined;
    node.value = typeof value === 'undefined' ? '' : value;
  }
}
```
  
