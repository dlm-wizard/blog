

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





## css 基础

## 一：层叠样式表

> 由键值对 - 《属性，值》构建的声明，使用 `;` 隔开声明

### 1. 层叠

```bash
# 层叠算法是先于优先级算法的
stylesheet（样式表） -> UA-stylesheet（浏览器默认） -> unset
```

### 2. 优先级

```bash
1. !important > 内联样式 > id > class > E > * > 继承
2. 优先级相同，最后的声明将会覆盖之前的声明

进行优先级比较的时候，是从优先级由高到低的顺序按照等级位上的权重值来进行比较的，高位的权重相同，
才比较下一位的权重

栗子：
a. body#god div.dad span.son {width: 200px;}
b. body#god span#test {width: 250px;}

比较顺序：#god+#test > #god，所以 b 优先级 > a
```

### 3. 继承

> 决定了你声明这个属性时该如何计算值

```bash
# 初始值与继承的概念
1. 元素的继承属性没有指定值时，则取父元素同属性的计算值。当非继承属性没有指定值时，取属性的默认值。

2. 理论上讲，任何 css 属性都具有除 null 值以外的 3 个值 initial、inherit、unset 用来
处理继承的机制。chrome 的开发者工具会提示我们  inherit from html。

# 在 css 属性中还有一个计算属性（computed），该值由指定的值计算而来，如 `em、%`等。最主要的作用是用来继承。
```


```bash
# initial
p { display: initial } # { display: inline } - 属性默认值

# inherit
强制非继承属性继承父元素

# unset
1. 继承属性 - inherit
2. 非继承属性 - initial
stylesheet -> UA-stylesheet -> unset # 浏览器检测元素样式的过程
```

#### 3.1 继承与非继承属性

```bash
# 继承属性
1. 文字、颜色、字体间距、行高、水平对齐方式(text-align) 和列表的样式
2. visibility
3. cursor

# 非继承属性
垂直对齐方式(vertical-align)、盒子模型、布局
```


## 二：选择器

### 1. 基本选择器与属性选择器

```bash
# 基本
1. 全局：*
2. 后代：E F
3. 子元素：E > F
4. 后续相邻元素：E + F（后续所有兄弟元素：E ~ F）
5. 选择器组合：s1, s2, s2

# 属性
1. 等于val的元素：E[att="val"]
2. （空格分隔）包含val [class="map isActive ..."]：E[att~="val"]
3. （整体）包含val字符串：E[att*="val"]
```

### 2. 伪元素与伪类

```bash
# 伪元素
E::after / before：设置 Element 在 DOM Tree 中前后的内容，content 属性设置插入内容
（都是匿名可替换元素）

# 伪类
1. :link -> : visited -> :hover -> :active # 层叠样式表

2. 父元素指定类型元素在集合中的位置
E:first-child：E 必须是父元素"第一个子元素"
E:last-child：

E:nth-child(n): # 选择子元素类型为E，如果第n个子元素不是E，则是无效选择符，但n会递增 [所有子元素的集合]
E:nth-of-type(n): n 不会递增。# 指定类型子元素的集合

3. :not 伪类中的选择器也被加入优先级的计算。
```

### 3. 引入样式表

> link 与 @import

```bash
# link
1. html 标记，没有兼容性问题
2. Js 可以通过 CSS API 操作 stylesheet
3. link 同时加载

# @import（样式表头部声明，';'）
1. css 2.1 引入
2. 无法通过 Js 动态操作
3. 在加载过程解析到 @import 导致串行加载
```

### 4. 百分比

```bash
# 参照物基本为包含块
1. 通过 css 属性制定包含块的大小
2. html（html 的百分比的参照物是浏览器）、body 使用百分比继承，子元素都可以使用百分比

# 特殊参照物
1. 包含块宽度：margin / padding
2. font-size: line-height
3. line-height: vertical-align
4. 元素自身宽高：border-radius、transform: translate
```


## 三：文本
```bash
# 空白字符显示、自动换行
white-space： nowrap（忽略空白符，文本不换行（</br>除外）） | normal（自动换行）

# 文本溢出
 .ellipsis {
    overflow: hidden; 
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

### 1. `vertical-align` 与 `line-height`

> 对于内联元素的各种行为，我们都可以使用者两种属性来解释，想要深入了解可以阅读这篇文章[CSS深入理解vertical-align和line-height的关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)

```html
<div>
    <!-- 图片下边会有一块空白空间 -->
    <!-- 1、vertical-align失效 2、line-height很小 -->
    <img src="1.jpg">
</div>
```

#### 1.1 空白节点

在 html5 文档的声明下，块级元素内部的内联元素表现，就好像块级元素内部还有一个没有宽度实体的空白节点。


```bash
# 空白空间的来源

1. vertical-align # 默认 baseline
2. 空白空间=(line-height - font-size)/2

# 衍生：垂直居中
通过 line-height 定高，元素 vertical-align：middle 垂直居中的方法。

1. 空白节点响应 line-height 形成高度，此时图片通过 vertical-align 就可以和这个被 line-height 撑高的空白节点垂直对齐了。

但并不是完全垂直居中，因为空白节点垂直中心只是字符 content-area 的中心，这个位置比绝对居中的位置要低一些，middle 的中线位置（字符中心）并不是 area 绝对居中的位置。也就是说 area 是垂直居中的，但是图片的中线是文字的 content-area 的中心

很简单，我们此时让 font-size：0，因此此时 content-area 的高度是0，各种乱七八糟的高度都在高度为0的这条线上，绝对中心线和中线垂直，自然垂直居中
```

```bash
# vertical-align
1. 行内元素与table-cell元素
vertical-align：middle - 什么意思？


# line-height 

# text-align
```



## 四：盒模型

> every element in web design is a rectangular box

* 块级元素：div  p  form  ul  li  h1-h6
* 行内元素：span  img  a  i  input  textarea

### 1. box-sizing


`border-box`其实就是`IE怪异模式`下的盒子模型。在页面中应该声明文档类型「!DOCTYPE html」，让浏览器以w3c的标准解析和渲染。若没有进行文档声明，IE 浏览器会将盒子模型解释为 IE 盒子模型。

> 作为外边距，margin 并不会影响盒子模型的大小


```bash
# 盒子模型的大小
box-sizing: border-box（IE 怪异盒模型） | content-box（w3c 标准盒模型）

# 盒子大小 - border box
1. content-box: 属性 w/h 只包含 content-box，不包含 padding、border
2. border-box：属性 w/h 不仅包含 content-box，还包含 padding、border


# padding-box ？ # background-clip 支持
```

### 2. width 和 height

```bash
# width（默认：auto）

1. 块级元素：包含块宽度
2. 行内元素（float、position、absolute、inline-block、table）：内容宽度
3. （inline-block + white-space：no-wrap）：宽度溢出
```

```bash
# height（默认：auto）
包裹性：高度由子元素撑开

1. 块级元素：
① 包含块（line boxes 高度垂直堆叠）

2. 行内元素
① 非替换元素：line-height
② 替换元素：图片内联高度 + padding | border | margin
```

### 3. margin

### 3.1 负 margin


```bash
# 非 float 且 position：static
1. 方向为 top 或者 left
设置负值 margin 的时候，元素会按照设置的方向移动相应的距离。

2. 方向为 bottom 或者 right
元素本身并不会移动，元素后面的其他元素会往该元素的方向移动相应的距离，并覆盖该元素
# 注：
① 当 position：relative - 元素移动时，后边的元素会被该元素覆盖
② 当 position：absolute - 脱离 noraml flow，所以不会对后边元素造成影响


# float
1. 与浮动方向相同 - 元素会往对应方向移动对应的距离
2. 相反 - 向该元素方向移动并覆盖该元素


# 应用
1. 半遮挡标题 2. 一列定宽两列流布局 3. 圣杯与双飞翼布局
```

### 3.1 margin collapse 与 水平居中

```bash
# 水平居中
margin: 0 auto

原理：当包含块的 width 为 非 auto 的值时，我们一定？可以计算出 margin 的值，因为元素宽度与包含块相关，
margin = (包含块width-(左b+左p+width+右p+右b))/2。不能垂直居中的原理也很简单，包含块高度依赖于子元
素的高度，是不能最初确定初始值的。 [margin 百分比也是以自身的宽度作为参照物的]


# margin collapse
两个或多个毗邻的普通流中的块元素垂直方向上的 margin 会折叠

1. 毗邻：没有被非空内容、padding、border 或 clear 隔开
2. 垂直方向
3. 
# margin collapse
# margin collapse
延续的传统排版的段间距问题，同一个 BFC 中两个盒子具有相对方向的外边距时，其外边距会发生叠加。创建
新的 BFC 以毒攻毒的方式解决 margin collapse 问题。


```

### 4. normal flow

在 html 中任意一个元素其实就是一个对象，也就是一个盒子。默认情况下它是按照出现的先后顺序来排列。当浏览器开始渲染 html 文档时，从窗口顶端开始分配元素需要的空间。css 规范了这样的过程包括了：

1. 块格式化( block formatting )，行内格式化( inline formatting )
2. 再进行相对定位( relative positioning )

综合上面的描述，也可以理解为格式化上下文对元素盒子做了一定的范围的限制，就是类似  width 和 height 做了限制一样。按照这方面来进行理解的话 `普通流` 就是一个这样的过程


```bash
# BFC
在对应的 BFC 上下文中，在容器盒子里从左上角开始，`从上到下垂直地`依次分配空间层叠（stack），并且独占一行，边界紧贴父盒子的边缘，相邻元素距离由 margin 决定，且会发生 margin collapse。除非`创建一个新的格式化上下文，否则块级元素宽度不受浮动元素的影响`。

# IFC
在对应的 IFC 中，行内元素从容器的顶端开始，一个接一个水平排列。
```

在 css 中可以通过 `float` 与 `position：absolute`两种方法让元素脱离 normal flow，但 `float`内容仍然存在与 normal flow 中。 如果元素不脱离  normal flow，元素盒子是不可能层叠在一起的。我们应该进一步理解z-index是如何工作的，尤其是层叠上下文的概念。

每个 html 元素都属于一个层叠上下文、制定层叠上下文中的每个定位元素都具有一个整数的层叠级别

```bash
# BFC
页面中的一块渲染区域，并且有一套渲染规则（明确地，它是一个独立的盒子，并且这个独立的盒子内部布局不受外界影响，当然也不会影响到外面的元素），决定了子元素将如何定位以及和其他元素的关系与相互作用。

# 称为 BFC 的条件
1. 根元素 html
2. float 非 none
3. position： absolute | fixed
4. display：inline-block | table-cell | table-caption | flex | grid
5. overflow 非 visible
常用：overflow:hidden | float:left/right | position:absolute

# BFC 布局规则
1. margin collapse
2. BFC 区域不会与浮动盒子重叠
3. 计算 BFC 高度时包括浮动元素
```


```bash
# 盒子阴影
想象一下在盒子下方设置了相同颜色的盒子进行偏移
box-shadow：none | [ , <shadow> ]*

shadow：inset?（内阴影 ） && <length>{2,4} && <color>?
<length>：水平偏移 | 垂直偏移 | 模糊半径 | 阴影大小

# 盒子轮廓
outline：与 border 相同（border 外且不占用盒子空间） 

# 盒子大小与内容
在盒子装不下内容的时候，我们可以隐藏部分内容
overflow：visiable（默认） | hidden | clip  | scroll | auto（按需出现滚动条 ）
```

不要使用 hidden 全局属性，使用
display: none 回流
visibility：hidden => 不会触发绑定事件
opacity=0 => 仍会触发事件

### 浮动

> 包裹+破坏性。浮动元素的本质是文字环绕图片，影响的不仅是自己，也影响周围的元素对其进行环绕。

```bash
# 没有 trbl 等位置属性

1. 包裹性：带有方向的 display：inline-block
2. 破坏性：破坏了 inline-box [切断 line-box 链]，浮动盒子没有高度（没有 inline-box 就不会产生 line-box，所以没有高度）
3. 下一个兄弟元素会紧贴到该元素之前的非浮动元素之后

# 清清除浮动
因为浮动盒子的破坏性，浮动盒子没有高度，包含块中没有内容可以撑开其高度

1. 给包含块定义高度
2. BFC（1.让包含块也浮动 2.overflow:hidden）
3. display: table（table layout 计算）
4. 通用类 .clearfix
.clearfix::after {
    context: '.';
    display: block;?不是 none 吗
    clear: both;/*clear 合用于块级元素*/
    overflow: hidden;
} 
.clearfloat{zoom:1} /* 兼容 ie6、7 hasLayout(BFC) */
```

### 定位

> position（包裹性+破坏性）

```
#
absolute
1. 包裹性：带有位置的 display: inline-block
2. z-index
3. 脱离 normal flow，参照物为同一包含块内的定位祖先（非 static && body）
4. 不再占据原来的空间并且有可能覆盖下层的元素

fixed：参照物是 viewport

sticky：当元素在容器中被滚动超过指定的偏移值时，元素在容器内固定在指定位置 （normal flow ）
栗子：如果你设置了top: 50px，那么在 sticky 元素到达距离 relative 顶部 50px 的位置时固定，不再向上移动。

3. 蛋疼的属性 sticky
(1) 出现原因，也是因为监听 scroll 事件来实现粘性布局使浏览器进入慢滚动的模式
(2) 与浏览器想要通过硬件加速来提升滚动的体验是相悖的。
```


## 变换、过渡和变化

### transforms

```bash
指的就是对一个物品拉伸、压缩、旋转和偏移

translate3d（3d位移）、rotate3d：3d（旋转）、scale3d（缩放）

```

### transition

```bash
# 过渡属性：emmm ~ 字面意思
transition-property：none | all（默认所有）| 属性

# duration
transition-duration：time

# delay
transition-delay：time

# 动画类型
transition-timing-function：ease | linear | ease-in（慢到快） | ease-out（快到慢） | ease-in-out（慢快慢） | 
[cubic-bezier()](https://cubic-bezier.com/#.17,.67,.83,.67)
```

### animation

animation 是动画效果，有时间轴的概念，可以控制每一帧的状态效果，可以重复触发并且有中间状态。

```bash
# 与 transition 对比

1. 没有时间轴概念（@keyframes）
2. 没有中间状态（只有开始和结束2帧）
3. 通过事件触发一次（iteration-count：infinite）
```

```bash
# 时间轴、duration、delay
@keyframes：动画持续时间的百分比
duration：time
delay：time

# 动画效果
transition-timing-functionease | linear | ease-in（慢到快）| ease-out（快到慢） | ease-in-out（慢快慢） | 
[cubic-bezier()](https://cubic-bezier.com/#.17,.67,.83,.67)

# 播放次数
iteration-count：Number | infinite

# 播放方向
direction：normal（时间轴顺序） | reverse（时间轴反序） | alternate（轮流） | alternate-reverse（反序轮流）

# 播放状态
play-state：running | paused

# 结束后样式
fill-mode：none（未开始前） | forwards(结束) | backwords(第一帧) | both(animation-direction轮流应用forwards和backwards规则)
```

#
## 参考














       

	       
   
   
   
