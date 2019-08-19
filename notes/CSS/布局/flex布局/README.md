* [Flexbox 格式化上下文](#flexbox-%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%B8%8A%E4%B8%8B%E6%96%87)
    
* [flex-item](#%E4%B8%80flex-item-%E7%9B%B8%E5%85%B3)
    * [1. flex-basis](#flex-basis)
    * [2. flex-grow](#flex-grow)
    * [3. flex-shrink](#flex-shrink)

* [flex-container](#%E4%BA%8Cflex-container-%E7%9B%B8%E5%85%B3)
    * [1. margin](#margin)
    * [2. justify-content](#justify-content)
    * [3. align-items](#align-items)
    * [4. flex-wrap](#flex-wrap)
    * [5. align-self](#align-self)
    * [6. align-content](#align-content)



## Flexbox 格式化上下文

### 一些概念

```bash
flex lines：flex 布局元素沿 flex lines 对齐，若干虚拟 flex-container 被布局算法用来分组和对齐

# 单行
flex-wrap：nowrap [内容可能溢出]

# flex-item 分配剩余空间方式与 flex-container 分配方式

# 
1. width: flex-basis
2. height: align-items <-（height: auto 无法决定盒子高度）
```

注意区分 flex-item 是作为 flex-container 还是作为 item 在进行布局 [flex-direction: column反向布局]


#
## 一：flex-item 相关

```css
/*建议优先使用该书写格式*/
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

/*默认值*/
flex：0, 1, auto <-（default）


1. flex：1 /*只有一个值且为<Number>默认指定flex-grow，等于1, 1, 0%，注意：flex-basis=0%*/
2. flex：30px | 30% /*只有一个值且为<length>默认指定的flex-basis， 等于0, 1, 30px*/
```

## 1. 计算空间

### flex-basis

> 浏览器根据这个属性计算「主轴」剩余空间，元素盒子的「（flex-direction: row 时）width/（flex-direction: column 时）height」会失效

```bash
# flex-basis
> the initial main size of the flex item, before free space is distributed according to the flex factors.

# flex-auto
> When specified on a flex item, the auto keyword retrieves the value of the main size property as the used flex-basis. If that value is itself auto, then the used value is content.
```


```bash
# 在剩余空间根据 flex-grow 自由分配之前，元素在 main axis 所占据的空间

flex-basis: <length> | auto <- (default);
1. length：显示指定
2. auto：等于元素 content-box 的值
3. 0%：将 item 视作 0 尺寸，声明尺寸也没什么用
```

<div align="center"><img width="75%" height="75%" src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/flex-basis.png?raw=true"/></div><br>

```html
<style>
    #app {
        display: flex;
        align-items: center;
        justify-content: center;
        /* 元素盒子模型与所占据主轴空间没有必然联系 */
        /* 盒子不一定反映 flex-basis */
        flex-basis: 100%;
    }

    .plan {
        color: white;
        background-color: pink;
        width: 30%;
        height: 50px;
        line-height: 50px;
        vertical-align: center;
        font-weight: bold;
        border-radius: 20px;
        margin: 10px 0;
    }
</style>

  <div>
      <h2 class="subtitle">hello reuseable & effective
      </h2>
      <div id="app">
          <div class="plan">
              <div class="desc">
                  <span>hello</span>
              </div>
          </div>
      </div>
  </div>
```


#
## 2. 空间分配

### flex-grow

> 盒子大小分配剩余空间的比例

```bash
# 空间分配初始
剩余可分配空间 = 总空间 - flex-basis空间

flex-grow: <number> | 0 <- (default);
```

flex-grow
<div align="center">  <img src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/flex-grow.png?raw=true" width="75%" height="75%" /></div><br>

```css
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: burlywood;
    height: 300px;
}
.plan {
    color: white;
    background-color: pink;
    width: 30%;
    /*height=根据剩余空间自动分配*/
    line-height: 50px;
    flex-grow: 1;
}
.plan:last-child {
    flex: 2;
}
```


### flex-shrink

为什么没有被缩小呢？
```bash
# 空间分配初始
缩小空间 = 总空间 - flex-basis空间

flex-grow: <number> | 1 <- (default);
```


#
## 二：flex-container 属性相关

> 当 flex-container 结束 `flex item layout` 且所有子元素的 flex-basis 都确定后，它们将在容器内部进行对齐，container 内子元素的 `float`、`clear`和`vertical-align`属性将失效

> 在所有的 `flex-basis` 与 自动边距确定后，进行对齐计算


## 1. 单行对齐方式

### margin

> 轻松实现导航结构

```bash
# flexbox 上下文中

1. 没有 margin 合并
2. margin: auto 优先级高于任何对齐方式，优先进行剩余空间的分配
```

**margin 分配剩余空间**

```bash
1. 任意主轴剩余可分配空间都会被分配给 margin: auto
2. 忽略溢出盒子的自动边距（盒子间距由 margin 决定）

demo：盒子右边距为 40px，剩余空间一定会溢出盒子，被自动忽略

# 可以推导出 => margin: auto = item 与 上一 item 之间的最大空间
```

<div align="center">  <img src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/flex-margin.png?raw=true" width="75%" height="75%"/></div><br>

```css
#app {
    display: flex;
    justify-content: center;
    background-color: burlywood;
    height: 300px;
}
.plan {
    color: white;
    background-color: pink;
    width: 70px;
    height: 50px;
    line-height: 50px;
    margin: 0 40px;
}
.plan:last-child {
    margin-left: auto;/*溢出自动忽略*/
}
```


### justify-content

> 主轴上的剩余空间

> `justify-content: flex-start | flex-end | center | space-between（两端对齐） | space-around（环绕）;`


<div align="center">  <img src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/justify-content.png?raw=true" width="75%" height="75%" /></div><br>

```css
#app {
    display: flex;
    padding-top: 30px;
    justify-content: space-between;/*两端对齐*/
    background-color: burlywood;
    height: 200px;
}

#anotherApp {
    display: flex;
    padding-top: 30px;
    justify-content: space-around;/*环绕*/
    background-color: burlywood;
    height: 200px;
}

.plan {
    color: white;
    background-color: pink;
    width: 70px;
    height: 50px;
    line-height: 50px;
}
```


### align-items

> 交叉轴上的剩余空间

> `align-items: flex-start | flex-end | center | baseline | stretch <- （default）;`


```bash
1. 当交叉轴有多余空间时，它设置容器内 flex lines 的对齐方式，要理解定义，还需要了解 flex lines 和 multi-line。
2. stretch: flex-item height=flex-container height
```

<div align="center">  <img src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/align-items.png?raw=true" width="75%" height="75%" /></div><br>

```css
#app {
    display: flex;
    align-items: center;
    background-color: burlywood;
    height: 150px;
}

#anotherApp {
    display: flex;
    background-color: burlywood;
    height: 300px;
}

.plan {
    color: white;
    background-color: pink;
    width: 30%;
    height: auto;
    line-height: 50px;
}
```

#
## 2. 多行对齐方式

### flex-wrap 相关

> flex-container 中的 item（flex layout 后） 沿着 flex lines（布局算法分组后的 virtual container，与主轴方向平行） 对齐

> `flex-wrap: nowrap | wrap | wrap-reverse;`: 决定 flex-container =>  line 或 lines

```bash
# line
1. 所有 flex-item 都在同一行（有可能导致内容溢出）
2. line width/height = flex-container width/height（就是 flex 容器 content-box大小）


# lines
1. 每一行的布局都是独立的（justify-content 和 align-items 只考虑单行 container 中的 flex-item）
2. line 交叉轴的height（row）/width（column）：可以包含 flex-item 的最小值
```


### align-self

> `align-self: auto <-（default：继承 align-items） | flex-start | flex-end | center | baseline | stretch;`


### align-content

> 定义了 flex lines 的对齐方式

> `justify-content: flex-start | flex-end | center | space-between（两端对齐） | space-around（环绕）;`

<div align="center">  <img src="https://github.com/dlm-wizard/Interview/blob/master/notes/CSS/%E5%B8%83%E5%B1%80/flex%E5%B8%83%E5%B1%80/assets/align-items+content.png?raw=true" width="75%" height="75%" /></div><br>

```css
#wrap,
#wrap1 {
    display: flex;
    flex-wrap: wrap;
    background-color: burlywood;
    height: 150px;
}

#wrap {
    align-content: center;
    height: 250px;
}

#wrap1 {
    align-items: flex-start;
}
#wrap1 .plan:nth-child(2) {
    align-self: flex-end;
}

.plan {
    color: white;
    background-color: pink;
    width: 30%;
    height: 60px;
    line-height: 50px;
}
```





