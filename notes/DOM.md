* [BOM基础](#bom-%E5%9F%BA%E7%A1%80)
    * [1. window对象](#%E4%B8%80window-%E5%AF%B9%E8%B1%A1)
    * [2. 常用BOM对象](#%E4%BA%8C%E5%B8%B8%E7%94%A8-bom-%E5%AF%B9%E8%B1%A1)
* [DOM基础](#dom-%E5%9F%BA%E7%A1%80)
* [文档的发展历史](#%E4%B8%80%E6%96%87%E6%A1%A3%E7%9A%84%E5%8F%91%E5%B1%95%E5%8E%86%E5%8F%B2)
    * [1. DOM0级与DHTML](#1-dom-0-%E7%BA%A7-%E4%B8%8E-dhtml)
    * [2. DOM1级](#2-dom-1-%E7%BA%A7)
    * [3. DOM2级](#3-dom-2-%E7%BA%A7)[ - DOM2样式接口](#dom-2-%E6%A0%B7%E5%BC%8F%E6%8E%A5%E5%8F%A3)
    * [4. DOM3级](#4-dom-3-%E7%BA%A7)[ - DOM3级事件类型](#dom-3-%E7%BA%A7%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B)
    * 
* [DOM节点类型](#%E4%BA%8Cdom-%E8%8A%82%E7%82%B9%E7%B1%BB%E5%9E%8B)
    * [1. Node类型](#1-node-%E7%B1%BB%E5%9E%8B)
    * [2. Element继承Node接口](#2-element-%E7%BB%A7%E6%89%BF-node-%E6%8E%A5%E5%8F%A3)    
* [节点类型](#2-%E8%8A%82%E7%82%B9%E7%B1%BB%E5%9E%8B)
    * [1. Element（元素结点）](#1-element%E5%85%83%E7%B4%A0%E7%BB%93%E7%82%B9)
    * [2. Attr（属性结点）](#2-attr%E5%B1%9E%E6%80%A7%E7%BB%93%E7%82%B9)
    * [3. Text（文本结点）](#3-text%E6%96%87%E6%9C%AC%E7%BB%93%E7%82%B9)
    * [4. Comment（注释节点）](#4-comment%E6%B3%A8%E9%87%8A%E8%8A%82%E7%82%B9)
    * [5. Document（文档结点）](#5-document%E6%96%87%E6%A1%A3%E7%BB%93%E7%82%B9)
    * [6. DocumentType（文档类型结点）](#6-documenttype%E6%96%87%E6%A1%A3%E7%B1%BB%E5%9E%8B%E7%BB%93%E7%82%B9)
    * [7. DocumentFragment（文档片段结点）](#7-documentfragment%E6%96%87%E6%A1%A3%E7%89%87%E6%AE%B5%E7%BB%93%E7%82%B9)
* [总结](#%E6%80%BB%E7%BB%93)
    * [1. domReady](#1-domready)
    * [2. DOM节点继承层次与嵌套规则](#2-dom%E8%8A%82%E7%82%B9%E7%BB%A7%E6%89%BF%E5%B1%82%E6%AC%A1%E4%B8%8E%E5%B5%8C%E5%A5%97%E8%A7%84%E5%88%99)
* [h5 新增 DOM 规范](#%E4%B8%89h5-%E6%96%B0%E5%A2%9E-dom-%E8%A7%84%E8%8C%83)
    * [1.与class相关扩充](#1-%E4%B8%8E-class-%E7%9B%B8%E5%85%B3%E6%89%A9%E5%85%85)
    * [2.焦点管理](#2-%E7%84%A6%E7%82%B9%E7%AE%A1%E7%90%86)
    * [3.document 的变化](#3-document-%E7%9A%84%E5%8F%98%E5%8C%96)
    * [4.自定义数据集](#4-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%95%B0%E6%8D%AE%E9%9B%86)
    * [5.DOM操作](#5-dom-%E6%93%8D%E4%BD%9C)
    * [6.h5事件](#6-h5-%E4%BA%8B%E4%BB%B6)
#
* [位置信息汇总](#%E4%B8%89%E4%BD%8D%E7%BD%AE%E4%BF%A1%E6%81%AF%E6%B1%87%E6%80%BB)
    * [1. window窗口](#window-%E7%AA%97%E5%8F%A3)
    * [2. Element（元素大小）](#element%E5%85%83%E7%B4%A0%E5%A4%A7%E5%B0%8F)
    * [3. 鼠标和触摸事件](#%E9%BC%A0%E6%A0%87%E5%92%8C%E8%A7%A6%E6%91%B8%E4%BA%8B%E4%BB%B6)
* [前端事件流](#%E5%9B%9B%E5%89%8D%E7%AB%AF%E4%BA%8B%E4%BB%B6%E6%B5%81)
    * [1. 事件处理程序](#1-%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F)
    * [2. 事件对象](#2-%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1)
    * [3. 事件委托](#3-%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%89%98)
* [参考](#%E5%8F%82%E8%80%83)



## BOM 基础

### 一：window 对象

> 必须遵守同源策略

> isFinite()、isNaN()、parseFloat()、parseInt()、编(解)码url

```bash
# 全局对象（Global）
1. JavaScript 全局函数和全局属性的占位符。通过全局对象，可以访问其他所有预定义对象、函数和属性
2. 全局上下文中变量对象就是全局对象呐
全局对象是作用域链的头，顶层作用域声明所有变量都将成为全局对象属性
```

BOM 的核心对象是 window，他表示浏览器窗口的一个实例。每个 iframe 拥有自己的 window 对象。在浏览器中，window 对象具有双重角色，他既是通过 JavaScript 访问浏览器窗口的一个接口，同时又扮演着 ECMA 中规定的 Global 对象。

[window.resize is not working in chrome and opera](https://stackoverflow.com/questions/5139323/window-resize-is-not-working-in-chrome-and-opera)


```bash
# 属性
1. name: 保留字符串，储存容量可达几 MB
在一个 window 的生命周期内,包括 iframe 都共享一个 window.name，并且都拥有读写的权限

2. devicePixelRatio：设备像素比
```

```bash
# 浏览器窗口对象
打开窗口：window.open(url, windowName, [windowFeatures]);

# 窗口及框架关系
1. window.frames # iframe-window 对象数组
2. window.top [最外层窗口]
3. window.parent [直接上层窗口]


# 滚动文档到指定位置（单位：px）
options: {
  top: y / left: x /*坐标*/
  behavior: auto('instant') | 'smooth'
}

1. scrollTo(options)

2. scrollBy(x, y) or (options);

```



### 二：常用 BOM 对象

> demo: url: `<protocol>://<host>「, <hostname>:<port>」/<pathname>?<query>#<hash>`

> `<host>` = `<hostname>:<port>`

```bash
# location 对象 [既是 window 对象的属性，也是 document 对象的属性]
1. 通过 location.名称 获取 [protocol, host, hostname, port, pathname, hash]，除此之外还有：
2. href
3. search
4. assign # 设置当前文档的 URL
5. replace # 设置当前文档的 URL，并且在 history 对象的地址列表中移除当前 URL「应用：跳转移动版网页」
6. reload # 刷新页面


# history 对象
1. length [历史记录数量]
2. go # 前进或后退指定的记录数 
3. back
4. forward


# navigator 对象
1. userAgent # 客户端浏览器信息
2. cookieEnabled # cookie 是否启用
```

#
## DOM 基础

### 一：文档的发展历史

* html(hyper): 显示数据并集中于数据外观
* XML(extensible): 主要用于存储数据和结构，可扩展

> 为什么我们需要 DOM？

> 我们可以通过 BOM 对象（browser object model）来进行交互，但要实现页面的动态交互和效果，操作 html 才是核心

#
### 1. DOM 0 级 与 DHTML

```bash
# 规范
1. JavaScript 早期版本中提供访问和修改文档的 API
2. 第四代浏览器中出现事件处理程序

# 概念
在阅读 DOM 标准的时候，经常会看到 DOM0 这样的字眼，实际上 DOM0级 这个标准是不存在的，还处于未形成标准的初期阶段。
所谓 DOM0级 只是 DOM 历史坐标系中的一个参照点而已。具体地说 DOM0级 就是指 IE4.0 和 Netscape navigator4.0 
最初支持的那个 DHTML。

因为没有规范和标准，两种浏览器的实现并不完全一样，为了兼容性考虑需要写大量的代码

```

#
### 2. DOM 1 级

```bash
# 规范
1. DOM CORE：规定如何映射 XML 的文档结构，以便简化对文档中任意部分的访问和操作
2. DOM HTML：在 DOM CORE 的基础上加以扩展，添加了针对 HTML 的对象（Element）和方法

# 概念
w3c 结合大家的标准推出了标准化的 DOM [!重点 与平台和编程语言无关的接口]，通过 API 脚本可以动态的访问和修改文档
的内容、结构和样式。

主要映射 HTML 文档的结构（什么是文档结构？）
1. DOM 可以将任何 html 与 xml 文档描绘成一棵有有多层结点的树
2. 节点为不同的类型 --继承--> Node 接口 [分别表示了文档中不同的信息及标记]
3. 每个节点都拥有各自的特点、数据和方法，另外也与其他节点存在某种关系
```

#
### 3. DOM 2 级

```bash
# 规范
1. DOM事件（DOM Events）：定义了事件和事件处理的接口
2. DOM样式（DOM Style）：定义了基于CSS为元素应用样式的接口
3. DOM遍历（DOM Traversal）：辅助完成顺序遍历 DOM 结构 [深度优先]
document.createNodeIterator(root,,filter) [root 为搜索起点]
  * filter 对象 [筛选函数]
  * next/previousNode() [与 iterator 类似]


4. 范围（ DOM Range）：定义了操作文档的区域
var range = document.createRange()
属性：
  * startContainer: 范围起点的父节点  
  * startOffset: 起点在父节点偏移量
方法：
  * selectNode(startContainer): 设置范围 [startContainer: 范围起点父节点]
  * setStart(startContainer, offset): 复杂选择
  
  
# 概念
在 DOM1 的基础上 DOM2 引入了更多的交互能力，将 DOM 划分为了更多具有联系的模块，又扩充了鼠标、用户界面事件、范围、遍历
等细分模块，并且增加了操作 css的 API
```

#
#### DOM 2 样式接口

![DOM2 样式继承链](https://uploader.shimo.im/f/bTamJnG0MCsF43zk.png!thumbnail)

> DOM Style，样式的定义可以分为`<link>`（外部样式表）、`<style>`（嵌入样式表）和内联样式

```
# "style="（内联样式r）
element.style
属性：cssText
方法：getPropertyValue(propName)


# 计算样式
window.getComputedStyle(element, [pseudoElt])
兼容IE： element.style.currentStyle

# 样式表
docuemnt.styleSheets/element.sheet
属性：cssRules[idx]（idx：第idx条规则）
```

#
### 4. DOM 3 级

```
# 进一步扩展 DOM，引入了以
1. 统一方式加载和保存文档的方法（DOM Load And Save 模块），
2. 同时新增了验证文档的方法（DOM Validation）
```

#
### DOM 3 级事件类型

#### 4.1 用户界面事件 

> 不一定与用户操作有关，window.event(事件对象)并包含任何信息

```bash
# load 事件

1. window.onload （页面完全加载 [包括图像、Js、css、iframe 等外部资源]）
    * event.target = document

2. img.onload
    * event.target = img
```

```bash
# Image 对象 [与 Image 对象相同]

预加载图像原理：设置 img.src 属性就开始下载

1. 在 DOM 出现前，用 Image 对象在客户端预加载图像
2. script、link 需要添加到 DOM Tree 中才会下载

var img = new Image()
img.src = 'http://cdn.com/img'
```

```bash
# 高频触发事件 
1. window.resize（窗口宽高被调整触发）
			 
2. window.scroll（实际表示的是页面相应元素的变化）
* 标准模式：html.scrollTop/Left
* 混杂模式：body.scrollTop/Left
```

```bash
# 滚动体验
如果事件中涉及到大量的位置计算、DOM 操作、元素重绘等工作且这些工作无法在下一个 scroll 事件触发前完成，就会造成浏览器
掉帧, 加上滚动往往是连续的，会持续触发 scroll 事件导致掉帧扩大、浏览器 CPU 使用率增加、用户体验受到影响

# 应用场景
在滚动事件中绑定回调应用场景：图片的懒加载、下滑自动加载数据、侧边浮动导航栏等

# solve
1. 防抖和节流
2. requestAnimationFrame
			     
栗子：状态机

var ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(realFunc);
        ticking = true;
    }
}

function realFunc() {
    // do something...
    ticking = false;
}
// 滚动事件监听
window.addEventListener('scroll', onScroll, false);


3. 优化事件的 handler
上述方法都是优化 scroll 事件的触发，从本质上讲，我们还是应该优化 scroll 事件的 handler，避免 scroll 事件中修改样式
		   
```


#
#### 4.2 焦点事件

```bash
# blur
# focus
```

#
#### 4.3 鼠标事件

> 事件流：mousedown -> mouseup -> click

```bash
1. mouseenter/leave [不冒泡]

2. mouseover/out [!重点，指针位于一元素上方，移入/出另一元素触发]
    * event.relatedTarget: 鼠标移入的元素，这两个事件独有的event属性
栗子：ul 中包含 li，在 ul 中移动，若移动到 li 边界频繁触发


# mouseover 模拟 mouseenter 事件
1）鼠标不是在元素内部移动
event.relatedTarget !== target(目标元素) 

2）不是目标元素的子元素
var b = event.relatedTarget
while ((b = b.parentNode) && b.nodeName !== '') {
    if (b === target) {
        return true;
    }
}
```

#
#### 4.5 设备与触摸事件

> touch 事件流：touchstart -> mouseover -> mousemove -> mousedown -> mouseup --> click -> touchmove（未移动不触发） --> touchend

```bash
# 设备事件
orientationchange（切换横纵屏）

# 触摸事件
# event [类似鼠标的 event 属性]
1. touchstart（触摸屏幕触发）

2. touchmove（连续滑动）
	 
3. touchend（移开屏幕）
```

#
### 二：DOM 节点类型

DOM 1 定义了一个 Node 接口，在 JavaScript 是作为 Node 类型实现的 [除 IE 外所有浏览器都可以访问该类型][IE 未开源]

### 1. Node 接口类型
	   
```bash
# 属性
1. Node.nodeName：元素大小标签名、属性名 # Element.tagName（常用）

2. Node.nodeValue：属性的值、文本与注释的内容

3. Node.nodeType [数值常量或者字符常量]
# IE 没有公开 Node 类型构造函数（无法访问字符常量），最好还是与数值访问

节点类型 | nodeType
------------ | -------------
Element  | 1
Attr     | 2
Text     | 3
Document | 9
DocumentFragment | 11
```

#
以下所有节点类型的 demo：

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>DocumentFragment文档片段节点</title>  
</head>  
<body> 
<!-- tip区域 -->
    <div id="tip">1</div> 
    <ul class="list-node">
    <li>2<li>
    </ul>  
    <script>  
        var frag = document.createDocumentFragment();  
        for (var i = 0; i < 10; i++) {  
            var li = document.createElement("li");  
            li.innerHTML = `List item${i}`;
            frag.appendChild(li);  
        }  
        document.getElementById("list-node").appendChild(frag);  
    </script>  
</body>  
</html> 
```

### 2. Element 继承 Node 接口

> demo 中的所有标签

#### 1) 节点关系属性

```bash
1. parentNode # 类型可能为 Element、Document or DocumentFragment
2. childNodes # 浏览器处理文本节点中空白符差异 
 -> firstChild / lastChild
3. el.children
 -> firstElementChild / lastElementChild
4. nextSibling/previousSibling
5. ownerDocument
```

#### 2) 节点操作方法

```bash
1. appendChlid()
2. insertBefore(newNode, refNode)
3. removeChild(child)/replaceChild(newChild, oldChild) 
```

# 
### 2. 节点类型

### 1) Element（元素结点） 

> 元素有子元素节点、文本节点，元素是唯一能够拥有属性节点的节点类型

#### 继承

> 所有 html 元素继承 HTMLElement

#### 属性

```bash
1. tagName

# 插入 html 标记
1. children
2. h5 - innerHTML / outerHTML
```

```bash
# innerHTML 的问题
1. 前端安全问题 xss、xsrf（仅建议创建新节点且内容可控 [最好不是用户输入、没有标签]）
2. 重新解析 html，样式与事件消失 [事件代理]

# innerHTML 优点（执行效率）
设置 innerHTML/outerHTML 时，就会创建一个 html 解析器 [在浏览器级别 c++ 代码] 上运行，效率会比 JavaScript 
DOM-API 高很多，不可避免的，创建与销毁 html 解析器也会带来性能损失，最好构建好字符串一次赋值

demo：
	for (var i = 0; i < val.length; i++) {
	    // 绝对要避免频繁创建销毁 innerHTML
	    // 构建好内容后一次赋值
	    ul.innerHTML = `<li>${val[i]}</li>`
	}
```

#### 查找结点

```bash
1. el.querySelectorAll() # nodeList

2. getElementsByTagName() # HTMLCollection

```

#
### 2) Attr（属性结点）

> Element 元素节点对象的属性，!重点（html 中布尔属性只要被设置，其值无论是什么都默认为"true"，取消该属性需要使用 removeAttribute）

> demo 中的 lang、charset、id、class

```bash
栗子：<input type="foo">

theInput.getAttribute("type")
theInput.type "text" # limited to known values


# 对于一个 DOM 对象来说，properties are the properties of that object, and 
attributes are the elements of the attributes property of that object.


1. 你可以在你的 html 上定义 attributes [自定义属性值]
2. 当浏览器解析为 DOM Element，包含属性元素 properties（it's limited to known values ）[属性值]

# demo 如上，"自定义属性值"与"属性值"并不是一一对应的关系
```

#### Element（元素结点）属性

```bash
# id、lang、title、className（关键字冲突）

# 操作局部 class 属性
1. h5 - classList 
    * el.classList.add/remove()

2. attributes（所有属性） # NamedNodeMap - alive
    * el.get/setAttribute()
    * el.removeAttribute
```

#
### 3) Text（文本结点）

> `DocumentFragment文档片段节点`、`1`、`2`、`!元素节点之后的空白区域`都属于 Text(文本节点);

#### Element（元素结点）属性

```bash
1. DOM3 - Node.textContent
2. innerText [非 h5 标准属性]
# 备用属性 textContent
```

#### 合并文本节点

```bash
用 JavaScript 创建文本节点时可以创建相邻文本节点（浏览器在解析时会合并显示，只会作为 DOM 操作结果出现）

el.normalize() # 合并相邻文本节点
    * el.firstChild.nodeValue
    * el.lastChild.nodeValue
    
```

#
### 4) Comment(注释节点)

> demo 中的 `<!-- tip区域 -->`区域


#
### 5) Document（文档结点）

> demo 中的`<!DOCTYPE html>`、`<html>` 均是文档节点子节点

> `document对象` 是 `HTMLDocument`（继承了 Document）的一个实例，是文档中其他所有节点的父节点，可以作为全局对象`window.document`访问，
通过 `window.document`，`iframe.contentDocument`，`xhr.responseXML`，`Element.ownerDocument`获取

> 每个文档都有自己的 `document对象`，浏览器载入 html 文档就存在了

#### 属性

```bash
# 元素节点
1. documentElement
2. body
3. h5 - head

3. childNodes（浏览器差异） # document.doctype 是否作为文档的第一个元素节点

# 文档
1. title # 文档标题标签
2. domain # 域名（可以设置）
3. referrer # 跳转或打开当前页面的页面
4. url
```

#### 结点操作

```bash
# 查找节点
1. d.getElementById()
2. d.getElementsByTagName()
3. getElementsByClassName()

4. d.querySelectorAll()

# 创建节点
1. d.createElement(tagName)
2. d.createTextNode()
3. d.createDocumentFragment()
```

#
### 6) DocumentType（文档类型结点）

> demo 中的`<!DOCTYPE html>`，通过`document.doctype`可以获取该节点


#
### 7) DocumentFragment（文档片段结点）

demo 中的 `var frag = document.createDocumentFragment();`

* 是轻量级的或最小的`Document对象`，它表示文档的一部分或者是一段，不属于 DOM Tree
* 插入 DocumentFragment 结点时，只插入它的所有子孙结点（可以作为占位符，暂时存放一次插入文档的节点）


#
## 总结

```bash
# 动态的集合 [文档结构变化时，会得到更新]
Nodelist、NamedNodeMap、HTMLCollection 

var li = document.getElementsByTagName('li')
for (let i = 0; i > li.length; i++) { # 死循环
    newLi = document.createElement('li')
    li.appendChild(newLi)
}
```

DOM 的关键，就是理解 DOM 对性能的影响. DOM 操作往往是 Js 开销最大的部分，而因访问 NodeList 导致的问题为最多
NodeList 对象都是`"动态的"`，`每次访问 NodeList 对象都会运行一次查询`，所以最好的办法就是尽量减少 DOM 操作。


#
### 1. domReady

```bash
html 要经过浏览器解析才能变成 DOM Tree，事实上，我们在编写大型项目的时候，js文件往往非常多，而且之间会相互调用，
大多数都是外部引用的，不把js代码直接写在页面上。这样的话，如果有个domReady这个方法，我们想用它就调用，不管逻辑代
码写在哪里，都是等到domReady之后去执行的。
	  
```

```bash
# window.onload
 缺点：当页面中有大量远程图片或要请求的远程资源时，我们需要让 js 在点击每张图片时，进行相应的操作，
如果此时外部资源还没有加载完毕，点击图片是不会有任何反应的，大大降低了用户体验。

# DOMContentLoaded
domReady 在加载完 DOM tree 之后就能执行「更早的执行时间」

1. $(function(){}) #  $(document).ready(function(){}) 的简写
2. DOMContentLoaded 事件及其封装方法 # 手写函数
```

#
### 2. DOM节点继承层次与嵌套规则

> DOM节点是一个非常复杂的东西，对它的每一个属性的访问，不走运的话，就可能会向上溯寻到N多个原型链，因此DOM操作是个非常耗性能的操作。Vue 使用了 virtual DOM 的概念，如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

> `我们比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗`。Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。


* innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
* Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)

```bash
# HTML 规范不断升级的过程中，每个元素也不断的添加新属性。

var div = document.createElement('div')
继承链: HTMLElement -> Element -> Node -> EventTarget -> Function -> Object

```

在新的HTML规范中，许多元素的固有属性（比如value）都放到了原型链当中，数量就更加庞大了。因此，未来的发展方向是尽量使用现成的框架来实现，比如MVVM框架，将所有的DOM操作都转交给框架内部做精细处理，这些实现方案当然就包括了虚拟DOM的技术了。但是在使用MVVM框架之前，掌握底层知识是非常重要的，明白为什么这样做，为什么不这样做的目的。这也是为什么要理解DOM节点继承层次的目的。
     


#
### 三：h5 新增 DOM 规范

#### 1. 与 class 相关扩充

```bash
1. getElementsByClassName
2. classList # 操作部分 class
```

#### 2. 焦点管理

* 页面加载
* 用户输入（通常按 tab 键）
* JavaScript 调用 focus 方法

```bash
1. document.activeElement # DOM 中当面获得焦点元素
2. document.head
```

#### 3. document 的变化

```bash
# readystatechange 事件
readystate 属性：
1. loading
2. interactive [文档已解析]

3. complete [即将触发 window.onload]
if (document.readystate == 'complete') {
   // 可以替代 window.onload
}
```


```bash
# 兼容模式（h5没有该区别，尽量实现向后兼容: <!DOCTYPE html>）

1. 标准模式：w3c 的标准解析
2. 混杂模式：自己的方式向后兼容老版本 [DOCTYPE 不存在或格式不正确]
```

#### 4. 自定义数据集

```bash

# data-*：非标准属性 [用于存储自定义数据]

1. 访问
element.dataset 属性访问

demo：
<div id="app" data-appId="208"></div>

var div = document.querySelector('#app')
div.dataset.appId // => 208
```

#### 5. DOM 操作

```bash
# 更新 html
1. innerHTML / outerHTML

# 滚动元素
element.scrollToView（调用元素滚动后出现在视口中）

```

#### 6. h5 事件

```bash
* DOMContentLoaded
* readystatechange
* hashchange：hash 变化
```

### 三：位置信息汇总

### window 窗口

```bash

# 窗口位置
1. screenLeft/Top # 浏览器窗口左上角相对于当前屏幕左上角的水平/垂直像素
```
```bash
# 窗口大小属性（单位：px）
1. innerWidth：视口（viewport）

2. outerHeight
  * chrome：视口（viewport）
  * IE：浏览器窗口本身尺寸
  * ×移动设备
  
3. scrollY：文档垂直滚动 [别名：pageXOffset]


# screen 对象
1. height/width # 屏幕像素高/宽
2. screen.availHeight/availWidth # [height-系统部件]
```

![一张图搞懂 window](https://static.oschina.net/uploads/img/201706/03125304_kgeT.png)

### Element（元素大小）

```js
// 计算某个元素在页面的偏移量
var left = element.offsetLeft

while ((element = element.offsetParent) !== null) {
    left += parent.offsetLeft // 累加至根元素
}
```

> 在 JavaScript 控制页面滚动时，设置了 overflow:scroll 后

```bash
# 概念
1. offest：偏移量 
2. 可见区域: 元素可见的w/h + 内边距 + 滚动条和边框 [外边距不可见]
3. offsetParent: 最近定位包含块（table、html）
4. 元素大小：元素可见的w/h + padding
5. 内容大小：h + padding
6. 滚动像素: 元素的顶部到视口可见内容的顶部 body 的距离 - 如果元素不能被滚动，则为0


# 滚动大小
1. offsetTop/Left # 对于 offsetParent 内边框的偏移
2. offsetHeight/Width # 可见区域

3. scrollTop/Left # 滚动像素
4. scrollHeight/Width # 内容大小

5. clientHeight/Width # 元素大小


# 方法
getBoundingClientRect（返回一个 DOMRect 对象）
1. trbl # 元素（不包括 margin）相对于 viewport 的距离
2. height =  scrollHeight + border		     
```


### 鼠标和触摸事件

```bash
# event对象属性（单位：px）
1. event.clientX/Y（viewport）
2. event.pageX/Y（页面位置）
在页面未滚动的情况下，pageX = clientX [hack：pageX = clientX + document.body.scrollLeft]

3. 屏幕坐标
event.screenX/Y
```

#


### 四：前端事件流

Js 与 html 之间的交互是通过事件来实现的，元素绑定事件处理函数使用了观察者模式，形成了页面行为（js）与页面外观（html）之间的松散耦合。事件流描述了文档接受事件的顺序，在 click 按钮的同时，也点击了按钮的 container 容器，甚至也 click 了整个页面，但是 IE 与 Netscape 提出了完全相反的事件流概念。DOM 2 级规定事件流包括 3 个阶段 [事件捕获阶段、目标事件阶段、事件冒泡阶段]。

```bash
# 栗子（假如你点击了 div 元素）
<body>
    <div class="myDiv"></div>
</body>


# 事件冒泡
 事件开始由最具体的节点接收，然后逐级向上传播到较为不具体的节点
 div -> body -> html -> document -> window

# 事件捕获
不太具体节点应该先接受到事件，而最具体的节点应该最后接受到事件
window -> document -> html -> body -> div

```

### 1. 事件处理程序

### 1.1 DOM0 事件处理程序 

#### 内联事件处理程序

```bash
# 有权访问全局作用域中任何代码
# <input type="button" onclick="alert('val');"></input>

1. html 元素刚渲染完成还未加载js就触发了事件、耦合太重
2. 作用域链各不同浏览器结果不同 [Element, Form 的 DOM 对象，document, window]
```

####  DOM0 级事件处理程序

```js
var btn = document.getElementById('btn')
btn.onclick = function() {}//解决未加载触发问题
btn = null //移除事件处理程序

```


### 1.2 DOM2 级事件处理程序 

```bash
1. 可以绑定多个事件处理程序
2. removeEventListener  移除事件处理程序 [注：所有参数必须相同]	
3. 要保证处理事件代码在大多数浏览器下可以一致运行，只需关注冒泡阶段 [IE]	
		
```

```js
btn.addEventListener(type, listener[, useCapture])
btn.removeEventListener(type, listener[, useCapture])

// IE
attachEvent(type, handler)
detachEvent(type, handler)
```


### 2. 事件对象

无论 DOM 事件处理程序（DOM0 or DOM2），在触发事件时，会传入 event 对象	

```bash
# 属性
1. target：目标（srcElement：IE）
2. currentTarget：处理元素


# 方法
1. preventDefault()：阻止默认行为（returnValue: Boolean - IE）
2. stopPropagation()：阻止事件在文档中捕获、冒泡（cancelBubble: Boolean - IE）
4. stopImmediatePropagation()：阻止冒泡并阻止事件其他监听器的调用
```

```bash
# IE 中事件对象作为 window 的一个属性存在, 不作为参数传入
window.event

# DOM0 级事件处理函数
btn.onclick = function() {
    var event = window.event
}

# DOM2 级事件处理函数
attachEvent 传入的 event 仍作为 window 属性
```

### 3. 事件委托

事件委托的雏形是由事件冒泡来形成的一个通知链，通过事件冒泡把所点击的元素代理在他的父元素上。1. 给很多重复的元素绑定点击事件是很浪费空间的的呐! 因为每个函数都是对象，2. 而且动态添加元素不会绑定点击事件。


```js
var addEvent = function() {
    addHandler (el, type, handler) {
    if (window.addEventListener) {
        el.addEventListener(type, handler, false)
    } 
    else if (window.attachEvent) {
        el.attachEvent(type, handler)
    } else {
        el[`on${type}`] = handler
    }
    },
    removeHandler (el, type, handler) {
    if (window.removeEventListener) {
        el.removeEventListener(type, handler, false)
    } 
    else if (window.detachEvent) {
        el.detachEvent(type, handler)
    } else {
        el[`on${type}`] = null
    }
    }
}

var myEvent = function() {
    addEvent,
    getEvent(event) {
        return event ? event : window.event
    }
    getTarget(event) { // 区分 currentTarget
        return event.target || event.srcElement
    }
    preventDefault(event) {
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    }
    stopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation
        } else {
            event.cancelBubble = true
        }
    }
}
```



#
## 参考
[深入浅出DOM基础——《DOM探索之基础详解篇》学习笔记 ](https://github.com/jawil/blog/issues/9)













       

	       
   
   
   
