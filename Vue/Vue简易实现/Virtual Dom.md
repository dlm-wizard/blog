* [实现一个简易的 Virtual DOM 算法](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E6%98%93%E7%9A%84-virtual-dom-%E7%AE%97%E6%B3%95)

* [Vnode](#%E4%B8%80vnode)
    * [1. 实现一个 Element](#1-%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA-element)
    * [2. render](#2-render)


* [walk DFS 比较](#%E4%BA%8Cwalk-dfs-%E6%AF%94%E8%BE%83)

    * [1. 同层元素的比较](#1-%E5%90%8C%E5%B1%82%E5%85%83%E7%B4%A0%E7%9A%84%E6%AF%94%E8%BE%83)

    * [2. 深度优先遍历](#2-dfs)


* [diff 算法的实现](#%E4%B8%89diff-%E7%AE%97%E6%B3%95)

    * [1. 时间复杂度](#1-omn--omaxm-ndiff-%E7%AE%97%E6%B3%95)

    * [2. 为什么会存在 listDiff 算法](#2-%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BC%9A%E5%AD%98%E5%9C%A8-listdiff-%E7%AE%97%E6%B3%95)

    * [3. 最小编辑距离](#3-%E6%9C%80%E5%B0%8F%E7%BC%96%E8%BE%91%E8%B7%9D%E7%A6%BB)

    * [4. listDiff 算法的实现 ](#4-listdiff-%E7%9A%84%E5%AE%9E%E7%8E%B0)



* [把差异应用到真正的 DOM 树上](#%E5%9B%9B%E6%8A%8A%E5%B7%AE%E5%BC%82%E5%BA%94%E7%94%A8%E5%88%B0%E7%9C%9F%E6%AD%A3%E7%9A%84-dom-%E6%A0%91%E4%B8%8A)

    * [1. 差异类型](#1-%E5%B7%AE%E5%BC%82%E7%B1%BB%E5%9E%8B)

    * [2. 实现patch，解析patch对象](#2-%E5%AE%9E%E7%8E%B0patch%E8%A7%A3%E6%9E%90patch%E5%AF%B9%E8%B1%A1)


MVC 与 MVP 从代码组织方式降低维护复杂应用难度，但无法减少状态与页面的更新操作，

# 


## 1. 前端状态思考

```bash
# 我们在展示升/降序表单时，需要在 Js 中存储对应字段

var sortKey = ["new", "cancel", "gain" ] //排序的字段，新增（new）、取消（cancel）、净关注（gain）
var sortType = 1 // 升序还是逆序
var data = [{...}, {...}, {..}, ..] // 表格数据

用户点击，通过操作上述字段，然后通过 js 或 jquery 操作 DOM，更新页面状态。

# 维护状态，更新视图
1. 不过页面越来越复杂，需要维护字段和监听事件回调更新页面的 DOM 越来越多，难以维护
2. 既然状态改变了就要操作响应 DOM，为很么不将视图与状态进行绑定
```

```bash
# MVVM：一旦状态发生变化，模版引擎重新渲染整个视图
在模版中声明视图组件与绑定状态，Vue就会在状态更新时自动更新视图
```


### 1.1 模版引擎渲染视图

```bash
# virtual DOM：合并和屏蔽了很多无效的 DOM 操作
渲染好模版后，直接用 innerHTML 重新渲染
1. 轻微移动也需要重新渲染
2. innerHTML： 失去焦点、绑定函数


# 保证了：无论数据变化多少，每次重绘的性能都可以接受
``` 

* innerHTML:  render html string `O(template size)` + 重新创建所有 DOM 元素 `O(DOM size)`

* Virtual DOM: render Virtual DOM + diff `O(template size)` + 必要的 DOM 更新 `O(DOM change)`


### 1.2 why virtual DOM

```bash
# 性能杀手 DOM

DOM 节点是一个非常复杂的东西，对他每一个属性的访问不走运就可能会向上溯寻到N多个原型链，
而且轻微的触碰就会导致页面回流

继承链： HTMLElement -> Element -> Node -> EventTarget -> Function -> Object


# 原生的 Vnode
1. VNode 实例去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多，而且处理起来更快更简单。
2. 本质上就是在 JS 和 DOM 之间做了一个缓存
```

```bash
1. 特定的 render 方法将 VNode 渲染成真实的 DOM节点，插入到文档中
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新树和旧的树进行比较，差异保存在 patch 对象中。
3. 解析 patch 更新视图
```

### 1.3 实现一个简易的 Virtual DOM 算法

原生 Vnode 可以表示 DOM 信息，反过来就可以用 Vnode 构建一颗 DOM 树，状态变更 -> 重新渲染视图
可以修改为状态变更 -> 更新 Vnode 对象，其实并没什么卵用啊，真正的页面实并改变。但可以用新渲染 
Vnode 与 旧的 Vnode 进行对比并记录差异，差异是真正需要的 DOM 操作，然后将 patch 应用到真正的
DOM 树上。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，既然硬盘
这么慢，我们就在它们之间加个缓存：既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）
只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。



```bash
# 总结为以下步骤  

1. 用 Vnode 表示真正 DOM 树结构，然后构建真正 DOM 树，插入到文档中
2. 状态变更构造新 Vnode，然后与旧 Vnode 比较记录差异
3. 将 2 记录差异应用到真正 DOM Tree 更新视图
```

## 2. 实现一个 Element

# 2.1 描述 DOM 的 Vnode 类

```html
<ul id="list">
  <li class="item">item1</li>
  <li class="item">item2</li>
  <li class="item">item3</li>
</ul>
```

```js

/**
 *  模拟真实 dom 的节点类
 * @param tag
 * @param attrs
 * @param children
 */
function Element (tag, attrs, children) {}

  this.tag = tag;
  this.attrs = attrs;
  this.children = children;

  this.key = attrs /*设置this.key属性，为了后面list diff做准备*/
      ? attrs.key
      : void 0
}

module.exports = function el(tag, attrs, children) {
  return new Element(tag, attrs, children);
}

```

> 进行转换：

```js

const el = require('./element');
let ul = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['Item 1']),
  el('li', { class: 'item' }, ['Item 2']),
  el('li', { class: 'item' }, ['Item 3'])
])

let $ul = ul.render();
document.body.appendChild($ul);
```




### 2.2 render


> 现在 ul 变量是表示的 DOM 节点结构的 Vnode 对象，并不在页面中真实存在，首次渲染时我们可以通过 Vnode 
对象构建一颗真正的 DOM 树


```js
Element.prototype.render = function () {

  let el = document.createElement(this.tag);
  let attrs = this.attrs;

  for (let attr in attrs) {
    let value = attrs[attr];
    el._.setAttr(attr, value);
  }


  let children = this.children || [];


  children.forEach((child) => {
    let childElem = (child instanceof Element)
      ? child.render()
      : document.createTextNode(child); // 字符串构建为文本节点
    el.appendChild(childElem);

  });

  return el;
}

```

#
## 3. diff 算法 [同层元素的比较]

diff 算法进行 Vnode 的对比，并返回一个 patch 对象，用来存储两个节点。但 Vue 比 React 不同的地方 Vue 是从新老子元素列表的两头向中间遍历，并多做了一些特殊判断。


### 3.1 深度优先遍历记录差异

如果元素之间进行完全的一个比较，即新旧 Vnode 1.父元素，2.本身，3.子元素 之间进行一个混杂的比较，其实现的时间复杂度为O(n^3)，你很少会跨层级的移动元素，所以这里做同级元素之间的一个比较，则其时间复杂度则为O(n)，栗子：节点跨层级移动了


![跨层级处理结点](https://user-gold-cdn.xitu.io/2018/4/3/1628b06256b89434?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



```js
// 同级元素比较时，可能会出现的四种情况
const REPLACE = 0  //  整个元素都不一样，即元素被replace掉
const ATTRS   = 1  //  元素的attrs不一样
const TEXT    = 2  // 元素的text文本不一样
const REORDER = 3  // reorder => 3 [listdiff]

// diff 函数，对比两棵树
function diff (oldTree, newTree) {
  var index = 0 // 当前节点的标志
  var patches = {} // 用来记录每个节点差异的对象
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

// 对两棵树进行深度优先遍历
function dfsWalk (oldNode, newNode, index, patches) {
  // 对比oldNode和newNode的不同，记录下来
  patches[index] = [...]

  diffChildren(oldNode.children, newNode.children, index, patches)
}

// 遍历子节点
function diffChildren (oldChildren, newChildren, index, patches) {
  var leftNode = null
  var currentNodeIndex = index
  oldChildren.forEach(function (child, i) {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count) // 计算节点的标识
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches) // 深度遍历子节点
    leftNode = child
  })
}
```

![深度优先遍历](https://pic1.zhimg.com/80/v2-d10040b6bda4d51ed249d3a182179110_hd.jpg)


```bash
# REPLACE [如div换成section]
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}]

# ATTRS[div新增id为container]
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}, {
  type: PROPS,
  props: {
    id: "container"
  }
}]

# 文本节点 [记录下]
patches[2] = [{
  type: TEXT,
  content: "Virtual DOM"
}]
```

### 3.2 页面渲染性能优化

![diff 时间复杂度](https://pic2.zhimg.com/80/v2-669c55ae5500bd0416457291dac908a5_hd.jpg)

那么如果一个列表 123 被顺序被我替换为了 312，按照以上 diff 进行对比，都会记录为 replace 然后被替换掉，实际上是不需要模版重新渲染的，只需要经过节点移动就可以达到，这就是两个列表对比的算法。因为只有三个节点浏览器还能吃得消，看不出性能上有什么区别，但如果有N多节点呢？并且节点只是做了一小部分 remove，insert，move 的操作，进行DOM的重新渲染，那岂不是操作太昂贵？

### 3.3 listdiff 算法

我们知道了新旧节点的顺序，求最小的删除、插入操作（移动可以看为删除和插入结合），这个问题抽象出来就是字符串最小编辑距离问题，通过动态规划求解时间复杂度为 O(m*n)，我们并不需要真正的最小编辑距离，可以将转换为： key 唯一标识元素，在该条件下求新旧子元素列表的最小插入、删除、移动操作 记录为：


```js
patches[0] = [{
  type: REORDER,
  moves: [{remove or insert}, {remove or insert}, ...]
}]
```

因为tagName是可重复的，不能用这个来进行对比。所以需要给子节点加上唯一标识key，列表对比的时候，使用key进行对比，这样才能复用老 DOM 树上的节点。



#
## 4. 把差异应用到真正的 DOM 树上 

### 4.1 patch [解析patch对象]

因为 Vnode 和 render 出来真正的 DOM 树的信息、结构是一样的，所以我们可以对 Vnode 进行 DFS 遍历，遍历的时候根据patches 对象找出当前遍历的节点差异，然后进行相应的 DOM 操作。

#
## 5. 结语

virtual DOM 主要是实现了上述三个步骤的函数：element、diff、patch，然后就可以根据实际进行使用

```js
// 1. 构建虚拟DOM
var tree = el('div', {'id': 'app'}, [
    el('h1', {style: 'color: blue'}, ['hello']),
    el('p', ['virtual-dom']),
    el('ul', [el('li')])
])

// 2. 通过虚拟DOM构建真正的DOM
var root = tree.render()
document.body.appendChild(root)

// 3. 生成新的虚拟DOM
var newTree = el('div', {'id': 'app'}, [
    el('h1', {style: 'color: red'}, ['hello']),
    el('p', ['virtual-dom']),
    el('ul', [el('li'), el('li')])
])

// 4. 比较两棵虚拟DOM树的不同
var patches = diff(tree, newTree)

// 5. 在真正的DOM元素上应用变更
patch(root, patches)
```





# code

### 最小编辑距离问题

```bash

# 列表更新本质上是一个最小编辑距离问题

给定两个字符串 a 和 b，只允许以下三种操作：[插入, 删除, 替换..]

求：把 a 转换成 b 的最小操作次数，也就是所谓的最小编辑距离。
举例： "xy" => "xz"，只需要把 y 替换成 z，因此，最小编辑距离为 1。
"xyz" => "xy"，只需要删除 z ，因此，最小编辑距离为 1。
```

```js

/**
 * 动态规划算法
 * 
 * a 的长度是 m，b 的长度是 n，要求 a[1]a[2]...a[m] => b[1]b[2]...b[n]
 * d[m][n]: 把 a 转换成 b 的最小操作（insert、remove、replace）次数
 * 
 * 
 * 寻常: 
 *  1. dp[i][0] = i // 把长度为 i 的 a 字符串转化为空肯定是操作 i 次
 *  2. dp[0][j] = j
 *
 * 
 * 状态转移方程：
 * 
 * 1. a[m] == a[n], 问题可以转化为 
 *    栗子："xyz" => "efg" 最小编辑距离等于 "xy" => "ef"
 *    d[m][n] == d[m-1][n-1]
 * 
 * 
 * 
 * 2. a[m] !== a[n] 可以分为三种情况
 *    栗子1："xyz" => "efg" 最小编辑距离等于 "xy" => "efg" 最小编辑距离 + 1
 *    d[m][n] == d[m-1][n] + 1
 *    
 *    栗子2："xyz" => "efg" 最小编辑距离等于 "xyzg" => "efg" 最小编辑距离 + 1，
 *    !难点：因为都以 g 结尾，根据 1 得到最小编辑距离等于 "xyz" => "ef"
 *    d[m][n] == d[m][n-1] + 1
 * 
 * 
 *    栗子2："xyz" => "efg" 最小编辑距离等于 "xyg" => "efg" 最小编辑距离 + 1，
 *    因为都以 g 结尾，根据 1 得到最小编辑距离等于 "xy" => "ef"
 *    d[m][n] == d[m-1][n-1] + 1
 * 
 */
function dynamicPlanning(a, b) {

  let lenA = a.length;
  let lenB = b.length;
  let d = [];
  d[0] = [];

  // 寻常
  for (let j = 0; j <= lenB; j++) {
    d[0].push(j);
  }
  for (let i = 1; i <= lenA; i++) {
      d[i] = [];
      d[i][0] = i;
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      if (a[i-1] === b[j-1]) {
        d[i][j] = d[i-1][j-1];
      } 
      else {
        let m1 = d[i-1][j];
        let m2 = d[i][j - 1];
        let m3 = d[i-1][j-1];
        d[i][j] = Math.min(m1, m2, m3) + 1;
      }
    }
  }

  return d[lenA][lenB];
}
```

#
### 简易实现 diff1

```js
// 同级元素比较时，可能会出现的四种情况
const REPLACE = 0  //  整个元素都不一样，即元素被replace掉
const ATTRS   = 1  //  元素的attrs不一样
const TEXT    = 2  // 元素的text文本不一样
const REORDER = 3  // reorder => 3 /*属于第二种 diff 算法，暂不讨论*/


//diff 入口，比较新旧Vnode对象的差异
function diff(oldTree, newTree) {
  const patches = {}
  let index = 0//当前节点的标志
  walk(oldTree, newTree, index, patches)
  return patchesr
}

// 对比oldNode和newNode的不同，记录下来
function walk(oldNode, newNode, index, patches) {
  let currentPatch = []

  //listDiff处理 remove 情况
  if (newNode === null || newNode === undefined) {
    // ...
  }

  //元素的text文本不一样
  else if (typeof oldNode === 'string' && typeof newNode === 'string') {

    if (newNode !== oldNode) {
      currentPatch.push({ type: TEXT, content: newNode })
    }

    // 元素的attrs不一样
    else if (
      oldNode.tagName === newNode.tagName &&
      oldNode.key === newNode.key
    ) {
      let attrPatches = diffAttrs(oldNode, newNode)

      if (attrPatches) {
        currentPatch.push({ type: ATTRS, attrs: attrPatches })
      }

      diffChildren(oldTree.children, newTree.children, patches, index) //深度优先遍历
    }
    //元素被replace掉
    else {
      currentPatch.push({ type: REPLACE, node: newNode })
    }
  }

  if (currentPatch.length) {
    patches[index] = currentPatch // 记录差异
  }
}


function diffAttrs (oldNode, newNode) {
  let count = 0
  let oldAttrs = oldNode.attrs
  let newAttrs = newNode.attrs

  let key, value
  let attrsPatches = {}


  for (key in oldAttrs) { //新节点属性变化
    value = oldAttrs[key] 
    if (newAttrs[key] !== value) {
      count++
      attrsPatches[key] = newAttrs[key]
    }
  }

  for (key in newAttrs) { //新节点新增属性
    value = newAttrs[key]
    if (!oldAttrs.hasOwnProperty(key)) {
      count++
      attrsPatches[key] = value
    }
  }

  return count === 0 ? null : attrsPatches


// DFS 深度优先遍历子节点 
function diffChildren(oldChildren, newChildren, index, patches) {

  let diffs = listDiff(oldChildren, newChildren, 'key') //listdiff 

  if (diffs.moves.length) {
    let reorderPatch = { type: REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }


  let leaveNode = null
  let currentNodeIndex = index

  for (let i = 0; i < oldChildren.length; i++) {
    let child = oldChildren[i]
    let newChild = newChild[i]

    //为每个节点都加上唯一标志
    currentNodeIndex = (leaveNode && leaveNode.count) ? 
    currentNodeIndex + leaveNode.count+1 : currentNodeIndex+1 
    

    walk(child, newChild, currentNodeIndex, patches) //深度遍历子节点
    leaveNode = child
  }
}
```

#
### 简易实现 listdiff

![listDiff实现](https://pic2.zhimg.com/80/v2-982b8829c09fed98a9fe7c58d9eb1be1_hd.jpg)

```js
/**
 * 
 * 1. newList 向 oldList 的形式靠近进行操作（移动操作）
 *    遍历 oldList，如果 newList 有 key 值相同的元素则插入 simulateList，反之插入 null，得到 simulateList
 * 
 * 
 * 2. 稍微处理一下 simulateList
 *    移除 null 并将 newList 中的新元素插入 
 * 
 * 
 * 3. simulateList 向 newList 的形式靠近，并将这里的移动操作全部记录到 moves 数组
 *    => （注：元素的移动会包括 remove 和 insert 结合）
 * 
 * 
 * 4. 最后得出一个moves数组，存储了所有节点移动类的操作
 * 
 * 
 * @param {Array} oldList - 原始列表
 * @param {Array} newList - 经过一些操作的得出的新列表
 * @return {Object} - {moves: <Array>}
 * 
 */
function diff(oldList, newList, key) { 

  let oldMap = getKeyIndexAndFree(oldList, key)
  let newMap = getKeyIndexAndFree(newList, key)

  let newFree = newMap.free

  let oldKeyIndex = oldMap.keyIndex
  let newKeyIndex = newMap.keyIndex

  let moves = [] /*记录所有移动*/


  let children = []
  let i = 0
  let item
  let itemKey
  let freeIndex = 0


  while (i < oldList.length) { /*1.*/
    item = oldList[i]
    itemKey = getItemKey(item, key) /*newNode 是否拥有 oldNode 的属性*/
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        let newItemIndex = newKeyIndex[itemKey] /*存放 Index*/
        children.push(newList[newItemIndex])
      }
    } else {
      let freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }


  let simulateList = children.slice(0) /*2.*/

  //顺序存储同层元素移动操作
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)//记录移除操作
      removeSimulate(i)//移除元素
    } else {
      i++
    }
  }


  // i 是 newList 的指针，j 是 simulateList 的指针
  let i = j = 0

  while (i < newList.length) { /*3.*/
    item = newList[i]
    itemKey = getItemKey(item, key)

    let simulateItem = simulateList[j]
    let simulateItemKey = getItemKey(simulateItem, key)


    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } 
      else {
        let nextItemKey = getItemKey(simulateList[j + 1])

        if (nextItemKey === itemKey) { /*若移除掉当前的 simulateItem 可以让 item 在正确的位置，那么直接移除*/
          remove(i)
          removeSimulate(j)
          j++
        } 
        else {
          insert(i, item)
        }
        i++
      }
    }
  }

  function remove(index) { /*记录remove操作*/
    let move = { index: index, type: 0 };
    moves.push(move)
  }

  function insert(index, item) { /*记录insert操作*/
    let move = { index: index, item: item, type: 1 }
    moves.push(move)
  }

  function removeSimulate(index) { /*移除节点*/
    simulateList.splice(index, 1)
  }

  return { moves: moves, children: children }
}


/**
 * 获取 oldList 与 newList key值与位置的映射关系
 * => keyIndex = { itemKey: i } 
 */
function getKeyIndexAndFree(list, key) {

  let keyIndex = {}
  let free = []
  
  for (let i = 0; len = list.length; i++) {
    let item = list[i]
    let itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } 
    else {
      free.push(item)
    }
  }

  return {  keyIndex: keyIndex, free: free }
}

function getItemKey(item, key) {
  if (!item || !key) return void 0
  return typeof key === 'string' ? item[key] : key(item)
}
```

#
### 简易实现 patch

```js
function patch(node, patches) {
  let walker = { index: 0 }
  dfsWalk = (node, walker, patches)
}


function dfsWalk(node, walker, patches) {

  let currentPatches = patches[walker.index]/*从 patches 中取出当前结点的差异*/
  let len = node.childNodes ? node.childNodes.length : 0


  for (let i = 0; i < len; i++) { /*深度遍历子结点*/
    let child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}


function applyPatches(node, currentPatches) {

  currentPatches.forEach(currentPatch => {

    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node);
        break;
      case REORDER:
        reorderChildren(node, currentPatch.moves);
        break;
      case ATTRS:
        setAttrs(node, currentPatch.props);
        break;
      case TEXT:
        node.textContent = currentPatch.content;
        break;
      default:
        throw new Error('Unknown patch type ' + currentPatch.type);
    }
  })
}
```




```js
// 应用 attributes 的差异
function setAttrs (node, props) {
  for (let key in props) {
    if (props[key] === void 0) {
      node.removeAttribute(key)
    } 
    else {
      let value = props[key]
      _.setAttr(node, key, value)
    }
  }
}


// 移动节点
function reorderChildren(node, moves) {

  let staticNodeList = Array.form(node.childNodes)// 方便使用数组 API
  let maps = {}// 缓存同层节点，在插入时 reuse

  staticNodeList.forEach(node => {
    //Element节点
    if (node.nodeType == 1) { 
      let key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    } 
  })

  // 同层元素之间比较
  moves.forEach(move => {

    let index = move.index

    if (move.type === 0) { // remove
      if (staticNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } 

    else if (move.type === 1) { // insert

      let insertNode = maps[move.item.key] ? 
        maps[move.item.key] : (typeof move.item === 'object') ? // reuse old item
           move.item.render() : document.createTextNode(move.item)// 创建新节点
          
      staticNodeList.splice(index, 0, insertNode)

      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}
```


#

## 参考

[深度剖析：如何实现一个 Virtual DOM 算法 #13](https://github.com/livoras/blog/issues/13)

[最小编辑距离问题：递归与动态规划](https://github.com/youngwind/blog/issues/106)

[网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？](https://www.zhihu.com/question/31809713)


[合格前端系列第五弹-Virtual Dom && Diff](https://zhuanlan.zhihu.com/p/27437595)


