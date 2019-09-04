

## 四：盒模型

> every element in web design is a rectangular box

- 块级元素：div p form ul li h1-h6
- 内联元素：span img a i input textarea

注意："块级元素" 和 "display：block" 并不是一个概念。栗如 `<li>` 元素默认值是 `display：list-item` ，但是符合"块级元素"的基本特征，也就是一个水平 normal flow 上只能显示一个元素，多个块级元素则换行显示。

正是由于"块级元素"具有 `换行特性` ，因此理论上都可以配合 clear 属性清除浮动带来的影响` 。

```css
.clearfix::after {
    context: '.';
    display: block;?不是 none 吗
    clear: both;/*clear 合用于块级元素*/
    overflow: hidden;
}
```



### 1. normal flow

在 html 中任意一个元素其实就是一个对象，也就是一个盒子。默认情况下它是按照出现的先后顺序来排列。当浏览器开始渲染 html 文档时，从窗口顶端开始分配元素需要的空间。css 规范了这样的过程包括了：

1. 块格式化( block formatting )，内联格式化( inline formatting )
2. 再进行相对定位( relative position )

综合上面的描述，也可以理解为格式化上下文对元素盒子做了一定的范围的限制，就是类似 width 和 height 做了限制一样。按照这方面来进行理解的话 `normal flow` 就是一个这样的过程。

由于一个盒子是无法解释 `display: inline-block` 的布局现象的，于是又新增了一个盒子，每个元素都有两个盒子。

- 外在盒子 - 元素是否换行
- 容器盒子 - wh、内容的呈现

| 盒子模型     | 外在盒子 | 容器盒子     |
| ------------ | -------- | ------------ |
| block        | 块级盒子 | 块级容器盒子 |
| inline       | 内联盒子 | 内联盒子     |
| inline-block | 内联盒子 | 块级容器盒子 |

我们通常设置的 `wh` 是作用在 `容器盒子` 上的。

### 2. width 和 height

#### width 的流特性

> width: auto（默认）

1.**包含块宽度** - 块级元素（flow width）

```
无宽度：通过区域自动分配水平空间实现自适应。width: 100%（手动设置）可能会：
1.尺寸溢出
2.margin 操作窗口（好好归纳一下）
```
<div align="center">  <img src="https://uploader.shimo.im/f/D7wMTUEyTWAek1AX.png!thumbnail" width=""/></div><br>

2.**内容宽度** - float、absolute、inline-block、table、内联元素

3.**宽度溢出** - 内联元素 + white-space：no-wrap

### 什么是 flow width？

> BFC 上下文中，在容器盒子的左上角开始分配空间并独占一行。

流动性并不是看上去的宽度 100% 显示这么简单，而是一种 margin/border/padding 和 content-box 自动分配水平空间的机制。


**格式化宽度（流动性）**：在默认情况下，绝对定位元素宽度默认为内容宽度，但有一种情况是由定位祖先决定的。


`非替换元素` `top/right` 、 `top/bottom` 对立方位属性同时存在的时候，元素宽度参照最近的定位祖先计算。

```css
/*如果div定位祖先宽度为100px*/
div { position: absolute; left: 20px; right: 20px; }

div { width: 60px; }
```




```bash
# height（默认：auto）
包裹性：高度由子元素撑开

1. 块级元素：
① 包含块（line boxes 高度垂直堆叠）

2. 内联元素
① 非替换元素：line-height
② 替换元素：图片内联高度 + padding | border | margin
```

```bash
# BFC
在对应的 BFC 上下文中，在容器盒子里从左上角开始，`从上到下垂直地`依次分配空间层叠（stack），并且独占一行，边界紧贴父盒子的边缘，相邻元素距离由 margin 决定，且会发生 margin collapse。除非`创建一个新的格式化上下文，否则块级元素宽度不受浮动元素的影响`。

# IFC
在对应的 IFC 中，内联元素从容器的顶端开始，一个接一个水平排列。
```

```bash
# 脱离 normal flow
1.float 2. position：absolute


应用：
# 1. 块级元素的同行显示
1.改变显示方式（display） 2.改变 normal flow

# 2. 层叠上下文的概念
如果元素不脱离  normal flow，元素盒子是不可能层叠在一起的，我们应该进一步理解 z-index 是如何工作的。
我们应该进一步理解z-index是如何工作的
```

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

### 2. box-sizing

`border-box`其实就是`IE怪异模式`下的盒子模型。在页面中应该声明文档类型「!DOCTYPE html」，让浏览器以 w3c 的标准解析和渲染。若没有进行文档声明，IE 浏览器会将盒子模型解释为 IE 盒子模型。

> 作为外边距，margin 并不会影响盒子模型的大小

```bash
# 盒子模型的大小
box-sizing: border-box（IE 怪异盒模型） | content-box（w3c 标准盒模型）

# 盒子大小 - border box
1. content-box: 属性 w/h 只包含 content-box，不包含 padding、border
2. border-box：属性 w/h 不仅包含 content-box，还包含 padding、border


# padding-box ？ # background-clip 支持
```

### 3. margin

### 3.1 负 margin

```bash
# 非 float 且 position：static
1. 方向为 top 或者 left
设置负值 margin 的时候，元素会按照设置的方向移动相应的距离。

2. 方向为 bottom 或者 right
元素后面的其他元素会往该元素的方向移动相应的距离，并覆盖该元素
# 注：
① 当 position：relative - 元素移动时，后边的元素会「被覆盖」
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

