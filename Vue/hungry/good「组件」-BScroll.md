#

#### 1.1 滚动原理

浏览器：

> 当我们的视口展示不下内容的时候，会通过滚动条的方式让用户滚动屏幕看到剩余的内容。

1. 页面内容的高度超过视口高度的时候，会出现纵向滚动条；
2. 当页面内容的宽度超过视口宽度的时候，会出现横向滚动条。

#
#### 1.2 why better-scroll

移动端，如果你使用过 overflow: scroll 生成一个滚动容器，会发现它的滚动是比较卡顿，呆滞的

因为我们早已习惯了目前的主流操作系统和浏览器视窗的滚动体验，比如滚动到边缘会有回弹，手指停止滑动以后还会按惯性继续滚动一会，手指快速滑动时页面也会快速滚动。而这种原生滚动容器却没有，就会让人感到卡顿


* 绿色部分: wrapper「父容器」，它会有固定的高度
* 黄色部分为 content「父容器的第一个子元素」，它的高度会随着内容的大小而撑高。

那么，当 content 的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这就是 BetterScroll 的滚动原理

```
监听了 touchstart、touchend 事件，会e.preventDefault？？
```

![better-scroll](https://raw.githubusercontent.com/ustbhuangyi/better-scroll/master/packages/vuepress-docs/docs/.vuepress/public/assets/images/schematic.png)

#### 1.3 初始化时机

> 因为它在初始化的时候，会计算父元素和子元素的高度和宽度，来决定是否可以纵向和横向滚动

我们在初始化它的时候，必须确保父元素和子元素的内容已经正确渲染了

#### 1.4 重新计算

> 子元素或者父元素 DOM 结构发生改变的时候

必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常

# 
#### 2.1 惯性滚动

> 用户滚动操作结束时的逻辑

变量：

newX：横轴最终位置
newY：纵轴最终位置

处理事件：

1. touchend：触点离开触控平面
2. mouseup：鼠标抬起
3. touchcancel：触控点被打乱「多个触点」
4. mousecancel 事件的处理函数


**BScroll.prototype._end**
```js
在用户滑动操作结束时，如果开启了惯性滚动，用 momentum 函数计算惯性滚动距离和时间。
/**
 * /*以下可以作为配置项传入Bscroll*/
 * momentumLimitTime: 300ms「触发动画滑动时间最小值」
 * momentumLimitDistance: 15px「触发动画滑动距离最小值」
 * startX: 横轴初始化位置
 * startY: 纵轴初始化位置
 * 
 * /*API*/
 * x: 横坐标
 * y: 纵坐标
 * maxScrollX: 最大横向滚动距离「负值」
 * maxScrollY: 最大纵向滚动距离「负值」
 * 
 * duration: 滚动时长
 */
BScroll.prototype._end = function (e) {
    ...
     /*计算*/
    if (this.options.momentum && duration < this.options.momentumLimitTime && (absDistY > this.options.momentumLimitDistance || absDistX > this.options.momentumLimitDistance)) {
      
      /*如果已经有啦水平滚动条...*/
      let momentumX = this.hasHorizontalScroll ? 
      momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options)
      : {destination: newX, duration: 0}
        
      let momentumY = this.hasVerticalScroll ? 
      momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options)
      : {destination: newY, duration: 0}
      
      /*取到滚动距离和时间*/
      newX = momentumX.destination
      newY = momentumY.destination
      time = Math.max(momentumX.duration, momentumY.duration)
      this.isInTransition = 1
    }
    ...
}
```

首先根据 
滚动距离：this.x - this.startX
滚动速度：滚动距离/滚动时间
惯性滚动距离：this.x + (速度/减速度*1)
```js
/**
 * deceleration: 动画减速度
 * swipeTime: 动画时长
 */
function momentum(current, start, time, lowerMargin, wrapperSize, options) {  
  ...
  let distance = current - start
  let speed = Math.abs(distance) / time
  ...
  let duration = swipeTime
  let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)
  ...
}
```

#
#### 2.2 边缘回弹


处理事件：

1. touchemove：触点离开触控平面
2. mousemove：鼠标抬起

**BScroll.prototype._move**

> 1. 滚动到超过边界时速度要变慢

```
/*因为 maxScrollY 是负值，所以 maxScrollY < 滚动范围 < 0*/
if (newY > 0 || newY < this.maxScrollY) {
    if (this.options.bounce) {
        newY = this.y + deltaY / 3/*速度变慢*/
    } else {
        newY = newY > 0 ? 0 : this.maxScrollY
    }
}
```

**BScroll.prototype.resetPosition**

> 2. 回弹到边界

```
BScroll.prototype.resetPosition = function (time = 0, easeing = ease.bounce) {
    ...
    let y = this.y
    if (!this.hasVerticalScroll || y > 0) {
      y = 0
    } else if (y < this.maxScrollY) {
      /*让 y 等于边界距离*/
      y = this.maxScrollY
    }
    ...
    this.scrollTo(x, y, time, easeing)/*回弹*/
    ...
  }
```



#
#### 3.1 商品组件

一开始 _initScroll() 并不能滚动原因：在vue里面我们更改数据，dom会随着数据做映射「数据绑定」

但实际上vue在更新dom的时候是一个异步的，也就是说vue里面有一个叫$nextTick的，实际上在nextTick的回调里面才会更新 
```js
import BScroll from 'better-scroll'

created () {
  /*请求商品数据*/
  this.$http.get('/api/goods').then((response) => {
    response = response.body
    if (response.errno === ERR_OK) {
      this.goods = response.data
      this.$nextTick(() => {
        this._initScroll()
        this._caculateHeight()
      })
    }
  })
},

data () {
  return {
    goods: [],
    listHeight: [],/*每个食物分类列表区间高度*/
    scrollY: 0, // 滚动距离
    selectedFood: {}
  }
},
```


#
#### 3.2 初始化 better-scroll 

> 在document视图或者一个element在滚动的时候，会触发元素的scroll事件。

#### _initScroll 初始滚动时已经监听滚动事件，暴露自己的位置

BetterScroll 默认会阻止浏览器的原生 click 事件「e.preventDefault」

**配置项**

> 和浏览器原生点击事件区分

click：true，BetterScroll 会派发一个 click 事件，我们会给派发「dispatchEvent(click)」加一个私有属性 _constructed，值为 true


```
this.foodsWrapper = new BScroll(this.$refs.foodsWrapper, {
  probeType: 3,/*滑动与惯性滚动都触发 scroll 事件*/
  click: true/*派发 click 事件*/
})

/*滚动钩子 => 暴露自己的位置*/
/*this 指向better-scroll对象「箭头函数的this指向」*/
this.foodsWrapper.on('scroll', (position) => { 
  this.scrollY = Math.abs(Math.round(position.y))
})
```

最外层 `<ul>` 下 `<li v-for="item in goods" :key="item.id" class="food-list food-list-hook">` 是食物列表容器

食物列表容器 `<ul>` 下 `<li>` 是每一项食物

```
<li class="food-item border-1px"
    v-for="food in item.foods"
    @click="selectFood(food, $event)"
    :key="food.id"
> 
```


#
#### 3.3 better-scroll 左右联动

建立所在区间高度与数组索引「所在 <li>DOMList 中的位置」的对应关系：
    
```js
  _caculateHeight () {
    /*获取食物分类列表*/
    let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
    let height = 0
    this.listHeight.push(height)
    /*将不同食物列表容器的高度添加 listHeight 数组中*/
    for (let i = 0; i < foodList.length; i++) {
      let item = foodList[i]
      height += item.clientHeight
      this.listHeight.push(height)
    }
  },
```

**联动关键**

通过滚动钩子实时暴露的位置获取元素位置，与不同食品列表所在区间高度比较 => 确定所在区间
```js
computed: {
  // 筛选出符合条件的区间索引
  currentIndex () {
    for (let i = 0; i < this.listHeight.length; i++) {
      let heightLow = this.listHeight[i]
      let heightTop = this.listHeight[i + 1]
      if (!heightTop || (this.scrollY >= heightLow && this.scrollY < heightTop)) {
        return i
      }
    }
    return 0
  },
...
},

selectMenu (index, e) {
if (!e._constructed) { /*BScroll派发点击事件才执行「防止原生点击重复执行」*/
  return
}
let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
let el = foodList[index]/*获取所在dom元素*/

/*滚动到指定元素*/
this.foodsWrapper.scrollToElement(el, 300)
},
```



