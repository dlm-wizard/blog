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



#
### 实现一个简易的 Virtual DOM 算法

#### 什么是 virtual DOM

```
# virtual DOM：合并和屏蔽了很多无效的 DOM 操作

DOM 节点是一个非常复杂的东西，对他每一个属性的访问不走运就可能会向上溯寻到N多个原型链，因此DOM操作是个非常耗性能的操作
因为 DOM 节点继承链  HTMLParagraphElement 实例 -> HTMLParagraphElement -> HTMLElement -> Element -> Node
-> EventTarget -> Function -> Object


而 Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。在 Vue 中，Virtual
DOM 是用 VNode 这么一个 Class 去描述
```

#### 为什么使用 virtual DOM

* innerHTML:  render html string `O(template size)` + 重新创建所有 DOM 元素 `O(DOM size)`
* Virtual DOM: diff `O(template size)` + 必要的 DOM 更新 `O(DOM change)`

```bash
# virtual DOM 的优势

1. virtual DOM 是以 Js 对象为基础而不依赖于真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等
2. 本质上就是在 JS 和 DOM 之间做了一个缓存
3. 通过 patch 的核心 [diff 算法]
# 保证了：不管你的数据变化多少，每次重绘的性能都可以接受
```

### 一：Vnode

```bash
1. 通过特定的 render 方法将 virtual DOM 其渲染成真实的 DOM节点，插入到文档中

2. 当状态变更的时候，重新构造一棵新的对象树。然后用新树和旧的树进行比较 [JS层面的计算]，返回一个 patch（即补丁对象）

3. 通过特定的操作解析 patch 对象，完成页面的重新渲染，视图就更新了
```

#### 1. 实现一个 Element

> 实现 JavaScript 对象去模拟 DOM 结点的展示形式，ez, 只需要记录其节点类型、属性，还有子节点即可

```js
/**
 * 用于模拟真实 dom 的节点类
 * @param tag
 * @param attrs
 * @param children
 */
function Element (tag, attrs, children) {
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
> 具备上述构造函数后，我们可以把如下所示的 DOM 节点

```html
<ul id="list">
  <li class="item">item1</li>
  <li class="item">item2</li>
  <li class="item">item3</li>
</ul>
```
> 进行转换：
```js
const el = require('./element');

let ul = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['Item 1']),
  el('li', { class: 'item' }, ['Item 2']),
  el('li', { class: 'item' }, ['Item 3'])
])
```

#### 2. render

> 其中 ul 变量是一个 Js 对象，用于表示的 DOM 节点结构，并不在页面中真实存在，同时我们可以根据这个变量构建真正的 DOM 节点

```js
/**
 * 渲染节点对象，生成具有真实 dom 结构的节点
 */
Element.prototype.render = function () {
  let elem = document.createElement(this.tag);
  let attrs = this.attrs;

  for (let attr in attrs) {
    let value = attrs[attr];
    el._.setAttr(attr, value);
  }

  let children = this.children || [];

  children.forEach((child) => {
    let childElem = (child instanceof Element)
      ? child.render() // 如果子节点也是虚拟 DOM 则递归构建 DOM 节点
      : document.createTextNode(child); // 如果是字符串则只构建文本节点
    elem.appendChild(childElem);
  });

  return elem;
}
```
> render 方法会根据 tag 构建一个真正的 DOM 节点，然后设置这个节点的属性，最后递归地把其子节点也构建出来

```
let $ul = ul.render();
document.body.appendChild($ul);
```
> 至此页面文档的 body 标签中就拥有真实的 ul DOM 节点


#
### 二：walk DFS 比较

实现一个 diff 算法进行虚拟节点的对比，并返回一个 patch 对象，用来存储两个节点不同的地方

#### 1. 同层元素的比较

```bash
# 如果元素之间进行完全的一个比较，即新旧 Element对象 的 
1.父元素，2.本身，3.子元素 
之间进行一个混杂的比较，其实现的时间复杂度为O(n^3)

但是在我们前端开发中，很少会出现跨层级处理节点，所以这里会做一个同级元素之间的一个比较，则其时间复杂度则为O(n)
```
> 栗子：
```bash
# 两个 Element对象 进行对比

1. 右边的新 Element 发现A节点已经没有了，则会直接销毁A以及下面的子节点
2. 在D节点上面发现多了一个A节点，则会重新创建一个新的A节点以及相应的子节点

# 不会做进一步跨层级的比较 [结点跨层级移动了]
```

![跨层级处理结点](https://user-gold-cdn.xitu.io/2018/4/3/1628b06256b89434?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


> 在这里，我们做同级元素比较时，可能会出现四种情况，先设置四个常量进行表示

> diff入口方法及四种状态如下
```js
# 0. 整个元素都不一样，即元素被replace掉
# 1. 元素的attrs不一样
# 2. 元素的text文本不一样
# 3. 元素顺序被替换，即元素需要reorder

const REPLACE = 0  // replace => 0
const ATTRS   = 1  // attrs   => 1
const TEXT    = 2  // text    => 2
const REORDER = 3  // reorder => 3 /*属于第二种 diff 算法，暂不讨论*/


/**
 * diff 入口，比较新旧两棵树的差异
 * 
 * 1. walk: 对两棵树进行深度优先遍历
 * 2. diffChildren: 遍历子节点
 */
function diff(oldTree, newTree) {
  const patches = {} /*用来记录每个节点差异的补丁对象*/
  let index = 0
  walk(oldTree, newTree, index, patches)
  return patchesr
}
```

> OK，状态定义好了，一个一个实现，获取到每个状态的不同。

> 1. 这里需要注意的一点就是，我们这里的diff比较只会和上面的流程图显示的一样，只会两两之间进行比较，如果有节点remove掉，这里会pass掉，直接走list diff

> 2. 首先先从最顶层的元素依次往下进行比较，直到最后一层元素结束，并把每个层级的差异存到patch对象中去，即实现walk方法

```js
// 对两棵树进行深度优先遍历
function walk(oldNode, newNode, index, patches) {
  let currentPatch = []

  if (newNode === null || newNode === undefined) {
    /*oldNode被remove掉了, listDiff处理*/
  }
  else if (_.isString(oldNode) && _.isString(newNode)) { /*比较文本之间的不同 [是没有子结点的]*/
    
    if (newNode !== oldNode) {
      currentPatch.push({
        type: TEXT,
        content: newNode
      })
    }
    else if ( /*比较attrs的不同*/
      oldNode.tagName === newNode.tagName &&
      oldNode.key === newNode.key
    ) {
      let attrPatches = diffAttrs(oldNode, newNode)
      if (attrPatches) {
        currentPatch.push({
          type: ATTRS,
          attrs: attrPatches
        })
      }

      diffChildren(oldTree.children, newTree.children, patches, index) /*递归进行子节点的diff比较*/
    }
    else {
      currentPatch.push({
        type: REPLACE,
        node: newNode
      })
    }
  }
  
  if (currentPatch.length) {
    patches[index] = currentPatch /*记录新的对象树与老树的差异*/
  }
}

// 记录的都是新结点的变化
function diffAttrs (oldNode, newNode) {
  let count = 0
  let oldAttrs = oldNode.attrs
  let newAttrs = newNode.attrs

  let key, value
  let attrsPatches = {}

  for (key in oldAttrs) { /*存在不同的 attr*/
    value = oldAttrs[key] 
    if (newAttrs[key] !== value) { /*如果 oldAttrs 移除掉一些 attrfos, newAttrs[key] === undefined*/
      count++
      attrsPatches[key] = newAttrs[key]
    }
  }
  for (key in newAttrs) { /*存在新的 attr*/
    value = newAttrs[key]
    if (!oldAttrs.hasOwnProperty(key)) {
      count++
      attrsPatches[key] = value
    }
  }

  if (count === 0) {
    return null
  }

  return attrsPatches
}
```

#### 2. DFS

> 每遍历到一个节点 [为每个节点加上一个唯一的标记] 就把该节点和新树进行对比，如果有差异就记录到一个对象里面

![深度优先遍历](https://pic1.zhimg.com/80/v2-d10040b6bda4d51ed249d3a182179110_hd.jpg)

```js
// 遍历子结点
function diffChildren(oldChildren, newChildren, index, patches) {

  let diffs = listDiff(oldChildren, newChildren, 'key') /*list-diff 算法*/
  newChildren = diffs.children

  if (diffs.moves.length) {
    let reorderPatch = { type: REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }
  
  let leftNode = null
  let currentNodeIndex = index

  for (let i = 0; i < oldChildren.length; i++) {
    let child = oldChildren[i]
    let newChild = newChild[i]


    currentNodeIndex = (leftNode && leftNode.count) ? /*为每个节点加上一个唯一的标记*/
    currentNodeIndex + leftNode.count+1 : currentNodeIndex+1 /*count 表示 leftNode 节点拥有的子孙节点个数*/

    
    walk(child, newChild, currentNodeIndex, patches) /*深度遍历子节点*/
    leftNode = child
  }
}
```

#
### 三：diff 算法

#### 1. O(m*n) => O(max(m, n))diff 算法

![diff 时间复杂度](https://pic2.zhimg.com/80/v2-669c55ae5500bd0416457291dac908a5_hd.jpg)

> 举个栗子，有新旧两个Element对象分别为：

```js
let oldTree = el('ul', { id: 'list' }, [
  el('li', { key: 1 }, ['Item 1']),
  el('li', {}, ['Item']),
  el('li', { key: 2 }, ['Item 2']),
  el('li', { key: 3 }, ['Item 3'])
])
let newTree = el('ul', { id: 'list' }, [
  el('li', { key: 3 }, ['Item 3']),
  el('li', { key: 1 }, ['Item 1']),
  el('li', {}, ['Item']),
  el('li', { key: 4 }, ['Item 4'])
])
```

![listDiff实现](https://pic2.zhimg.com/80/v2-982b8829c09fed98a9fe7c58d9eb1be1_hd.jpg)


#### 2. 为什么会存在 listDiff 算法

> 你依然可以用类似 innerHTML 的思路去写你的应用

```bash
# walk 方法也可以实现 diff 比较

可以看出来这里只做了一次节点的move。如果直接按照上面的diff进行比较，并且通过后面的patch方法进行patch对象的解析渲染，
那么将需要操作三次DOM节点才能完成视图最后的update。


# 页面渲染效率

1. 如果只有三个节点的话那还好，我们的浏览器还能吃的消，看不出啥性能上的区别。
2. 那么问题来了，如果有N多节点，并且这些节点只是做了一小部分remove，insert，move的操作，那么如果我们还是按照一一对应
的DOM操作进行DOM的重新渲染，那岂不是操作太昂贵？
```

> 所以，才会衍生出list diff这种算法，专门进行负责收集remove，insert，move操作

> 当然对于这个操作我们需要提前在节点的attrs里面申明一个DOM属性，表示该节点的唯一性。[v-for :key="item.id"]


#### 3. 最小编辑距离

> 把 a 转换成 b 的最小操作次数 为什么会存在 

```bash
# 列表更新本质上是一个最小编辑距离问题

给定两个字符串 a 和 b，只允许以下三种操作：[插入一个字符, 删除.., 替换..]

求：把 a 转换成 b 的最小操作次数，也就是所谓的最小编辑距离。
举例： "xy" => "xz"，只需要把 y 替换成 z，因此，最小编辑距离为 1。
"xyz" => "xy"，只需要删除 z ，因此，最小编辑距离为 1。
```

```js
/**
 * 动态规划算法
 * 
 * a 的长度是 m，b 的长度是 n，要求 a[1]a[2]...a[m] => b[1]b[2]...b[n]
 * d[m][n]: 把 a 转换成 b 的最小操作次数
 * 
 * 
 * 寻常: 
 *  1. dp[i][0] = i // 把长度为 i 的 a 字符串转化为空肯定是操作 i 次
 *  2. dp[0][j] = j
 *
 * d[m][n] a. 可以由 d[m-1][n-1] 两个字符串同时添加字符得到
 *         b. 也可以由 d[m-1][n] 或 d[m][n-1] 添加一个字符得到
 * 
 * 动态转移方程:
 *  1. a[m] = b[n]
 *     => d[m][n] = d[m-1]d[n-1] 
 *  解释一下就是在长度为 m-1 的 a 字符串与长度为 n-1 的 b 字符串的基础上在 a 与 b 字符串结尾都添加一
 *  个相同的字符，转换的时候新添字符因为相同并不用移动，所以 d[m][n] = d[m-1]d[n-1] 
 *   
 *  2. a[m] != b[n]
 *     => d[m][n] = min(d[m-1]d[n-1], d[m]d[n-1], d[m-1]d[n]) + 1
 *  
 *  (1) d[m-1]d[n-1]，若 m != n，都需要在上一个字符串长度的基础上再加上一次操作
 *  (2) d[m]d[n-1]，若 m != n，
 *  (3) d[m-1]d[n])，若 m != n，
 * 
 */
function dynamicPlanning(a, b) {
  let lenA = a.length;
  let lenB = b.length;
  let d = [];
  d[0] = [];

  for (let j = 0; j <= lenB; j++) {
    d[0].push(j);
  }

  for (let i = 0; i <= lenA; i++) {
    if (d[i]) {
      d[i][0] = i;
    } else {
      d[i] = [];
      d[i][0] = i;
    }
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      if (a[i - 1] === b[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        let m1 = d[i - 1][j] + 1;
        let m2 = d[i][j - 1] + 1;
        let m3 = d[i - 1][j - 1] + 1;
        d[i][j] = Math.min(m1, m2, m3);
      }
    }
  }

  return d[lenA][lenB];
}
```

#### 4. listDiff 的实现 

```js
/**
 * Diff two list in O(N).
 * 
 * 1. newChildren 向 oldChildren 的形式靠近进行操作
 *    => 移动操作，代码中做法是直接遍历 oldChildren 进行操作，得到 simulateChildren=[key1, 无key, null, key3]
 * 
 *      (1) oldChildren[key1] 对应 newChildren 中的第二个元素
 *      (2) oldChildren[无key] 对应 newChildren 中的第三个元素
 *      (3) oldChildren[key2] 没有对应元素, 直接设为 null
 *      (4) oldChildren[key3] 对应 newChildren 中的第一个元素
 * 
 * 2. 稍微处理一下 simulateChildren
 * 
 * 3. simulateChildren 向 newChildren 的形式靠近，并将这里的移动操作全部记录下来
 *    => （注：元素的 move 这里会当成 remove 和 insert 的结合）
 * 
 * 4. 最后得出一个moves数组，存储了所有节点移动类的操作
 * 
 * 
 * @param {Array} oldList - 原始列表
 * @param {Array} newList - 经过一些操作的得出的新列表
 * @return {Object} - {moves: <Array>}
 *                  - moves list操作记录的集合
 * 
 */
 // oldChildren newChildren :key="" [以什么属性的变化来进行比较, key 可以作为函数传入]
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

  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSiulate(i) /*移除 simulateList 中不存在的元素*/
    } else {
      i++
    }
  }

  // i  => new list
  // j  => simulateList
  let i = j = 0
  while (i < newList.length) { /*3.*/
    item = newList[i]
    itemKey = getItemKey(item, key)

    let simulateItem = simulateList[j]
    let simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {

      if (itemKey === simulateItemKey) {
        j++
      } else {
        let nextItemKey = getItemKey(simulateList[j + 1])

        if (nextItemKey === itemKey) { /*若移除掉当前的 simulateItem 可以让 item 在正确的位置，那么直接移除*/
          remove(i)
          removeSiulate(j)
          j++ /*让j的值是对的*/
        } else {
          insert(i, item)
        }

        i++
      }
    }
  }

  function remove(index) { /*记录 remove 操作*/
    let move = {
      index: index,
      type: 0
    }
    moves.push(move)
  }
  function insert(index, item) { /*记录 insert 操作*/
    let move = {
      index: index,
      item: item,
      type: 1
    }
    moves.push(move)
  }
  function removeSiulate(index) { /*移除 simulateList 对应实际 list 中 remove 节点的元素*/
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * 返回 list 转变成 key-item keyIndex 对象的形式
 * 
 * keyIndex = {
 *  itemKey: i // list[] idx
 * } 
 * 
 */
function getKeyIndexAndFree(list, key) {
  let keyIndex = {}
  let free = []
  
  for (let i = 0; len = list.length; i++) {
    let item = list[i]
    let itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey(item, key) {
  if (!item || !key) return void 0

  return typeof key === 'string' ? item[key] : key(item)
}
```

#
### 四：把差异应用到真正的 DOM 树上 

#
#### 1. 差异类型

> 例如，发生节点替换：

```js
patches[0] = [{
  type: REPALCE,
  node: node // el('li', {class: 'item'}, ['Item 1'])
}]
```

> 给节点添加 id 属性为 container：

```js
patches[0] = [{
  type: PROPS,
  props: {
    id: "container"
  }
}]
```

> 修改文本节点的文本内容：

```js
patches[2] = [{
  type: TEXT,
  content: "new content here."
}]
```

> 我们使用英文字母唯一地标识每一个子节点，得到旧的节点顺序比如：

> a b c d e f g h i

> 现在对节点进行删除、插入、移动的操作后（举例新增j节点，删除e节点，移动h节点）得到新的节点顺序：

> a b c h d f g i j

> 如果发生的改变是 div 的子节点重新排序呢？一种方案是直接进行替换，但是这样做的话 DOM 操作的开销较大；第二种方案就是移动节点，我们可以基于 `字符串的最小编辑距离算` 法对列表进行对比。

```js
patches[0] = [{
  type: REORDER,
  moves: [{remove or insert}, {remove or insert}, ...]
}]
```


#
#### 2. 实现patch，解析patch对象


> 因为步骤一所构建的 Js 对象树和 render 出来的真正的 DOM 树的信息／结构是一样的，所以我们可以对该 DOM 树也进行 DFS 遍历，遍历的时候根据步骤二生成的 patches 对象找出当前遍历的节点差异，然后进行相应的 DOM 操作。

```js
// 进行差异应用
function patch(node, patches) {
  let walker = { index: 0 }
  dfsWalk = (node, walker, patches)
}

function dfsWalk(node, walker, patches) {
  let currentPatches = patches[walker.index]/*从 patches 中拿出当前结点差异*/
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
  }
  })
}
```

```js
// 应用 attrs 的差异
function setAttrs (node, props) {
  for (let key in props) {
    if (props[key] === void 0) {
      node.removeAttribute(key)
    } else {
      let value = props[key]
      _.setAttr(node, key, value)
    }
  }
}

// 应用 listDiff 的差异
function reorderChildren(node, moves) {
  
  let staticNodeList = _.toArray(node.childNodes)
  let maps = {} /*hasMap缓存key值结点*/

  staticNodeList.forEach(node => {
    if (_.isElementNode(node)) { /*如果当前节点是Element，通过maps将含有key字段的节点进行存储*/
      let key = node.getAttribute('key')
      if (key) {
        maps[key] = node/*缓存含有key值的特殊结点*/
      }
    }
  })

  moves.forEach(move => {
    let index = move.index
    
    if (move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index])
      }

      staticNodeList.splice(index, 1)/*删除结点*/

    } else if (move.type === 1) { // insert item

      let insertNode = maps[move.item.key]
        ? maps[move.item.key] // reuse old item
        : (typeof move.item === 'object')
          ? move.item.render()
          : document.createTextNode(move.item)

      staticNodeList.splice(index, 0, insertNode)/*添加结点*/

      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}
```

#
## 参考
[网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？](https://www.zhihu.com/question/31809713)

[合格前端系列第五弹-Virtual Dom && Diff](https://zhuanlan.zhihu.com/p/27437595)





