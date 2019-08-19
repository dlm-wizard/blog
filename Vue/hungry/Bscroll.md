#
### 核心滚动

在 BetterScroll 2.0 的设计当中，我们抽象了核心滚动部分，它作为 BetterScroll 的最小使用单元，压缩体积比 1.0 小了将近三分之一，往往你可能只需要完成一个纯粹的滚动需求，那么你只需要引入这一个库，方式如下：

```
npm install @better-scroll/core@next --save
import BScroll from '@better-scroll/core'
const bs = new BScroll('.div')
```
### 上手

#### 水平滚动
BetterScroll 实时派发 scroll 事件，是需要设置 probeType 为 3。

#### 垂直滚动
BetterScroll 实现横向滚动，对 CSS 是比较苛刻的。首先你要保证 wrapper 不换行，并且 content 的 display 是 inline-block。

```
.scroll-wrapper
  // ...
  white-space nowrap
.scroll-content
  // ...
  display inline-block
```
  
freeScroll（水平与垂直同时滚动）

#### 温馨提示
任何时候如果出现无法滚动的情况，都应该首先查看 content 元素高度/宽度是否大于 wrapper 的高度/宽度。这是内容能够滚动的前提条件。

如果内容存在图片的情况，可能会出现 DOM 元素渲染时图片还未下载，因此内容元素的高度小于预期，出现滚动不正常的情况。此时你应该在图片加载完成后，比如 onload 事件回调中，调用 bs.refresh 方法，它会重新计算最新的滚动距离。

#
### 配置项

BetterScroll 支持很多参数配置，可以在初始化的时候传入第二个参数，比如：

```
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper',{
    scrollY: true,
    click: true
})
```
这样就实现了一个具有纵向可点击的滚动效果的列表。BetterScroll 支持的参数非常多，接下来我们来列举 BetterScroll 支持的参数。


#### startX
```
类型：Number
默认值：0
作用：横轴方向初始化位置。

```
#### startY
```
类型：Number
默认值：0
作用：纵轴方向初始化位置。
```

#### scrollX
```
类型：Boolean
默认值: false
作用：当设置为 true 的时候，可以开启横向滚动。
备注：当设置 eventPassthrough 为 'horizontal' 的时候，该配置无效。
```

#### scrollY
```
类型：Boolean
默认值：true
作用：当设置为 true 的时候，可以开启纵向滚动。
备注：当设置 eventPassthrough 为 'vertical' 的时候，该配置无效。
```

#### freeScroll
```
类型：Boolean
默认值：false
作用：有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 freeScroll 为 true 即可。
备注：当设置 eventPassthrough 不为空的时候，该配置无效。
```

#### directionLockThreshold
```
类型：Number
默认值：5（不建议修改）
作用：当我们需要锁定只滚动一个方向的时候，我们在初始滚动的时候根据横轴和纵轴滚动的绝对值做差，当差值大于 directionLockThreshold 的时候来决定滚动锁定的方向。
备注：当设置 eventPassthrough 的时候，directionLockThreshold 设置无效，始终为 0。
```

#### eventPassthrough
```
类型： String
默认值：''
可选值：'vertical'、'horizontal'
作用：有时候我们使用 BetterScroll 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，我们可以设置 eventPassthrough 为 vertical；相应的，如果我们希望保留横向的原生滚动，可以设置eventPassthrough为 horizontal）。
备注：eventPassthrough 的设置会导致其它一些选项配置无效，需要小心使用它。
```

#### click
```
类型：Boolean
默认值：false
作用：BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
```

#### dblclick
```
类型：Boolean | Object
默认值：false
作用：派发双击点击事件。当配置成 true 的时候，默认 2 次点击的延时为 300 ms，如果配置成对象可以修改 delay。
  dblclick: {
    delay: 300
  }
```

#### tap
```
类型：String
默认值：''
作用：因为 BetterScroll 会阻止原生的 click 事件，我们可以设置 tap 为 'tap'，它会在区域被点击的时候派发一个 tap 事件，你可以像监听原生事件那样去监听它。
```

#### bounce
```
类型：Boolean | Object
默认值：true
作用：当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画。
  bounce: {
    top: true,
    bottom: true,
    left: true,
    right: true
  }
bounce 可以支持关闭某些边的回弹效果，可以设置对应边的 key 为 false 即可。
```

#### bounceTime
```
类型：Number
默认值：800（单位ms，不建议修改）
作用：设置回弹动画的动画时长。
```

#### momentum
```
类型：Boolean
默认值：true
作用：当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画。
```

```
#### momentumLimitTime
类型：Number
默认值：300（单位ms，不建议修改）
作用：只有在屏幕上快速滑动的时间小于 momentumLimitTime，才能开启 momentum 动画。
```

#### momentumLimitDistance
```
类型：Number
默认值：15（单位px，不建议修改）
作用：只有在屏幕上快速滑动的距离大于 momentumLimitDistance，才能开启 momentum 动画。
```

#### swipeTime
```
类型：Number
默认值：2500（单位ms，不建议修改）
作用：设置 momentum 动画的动画时长。
```

#### swipeBounceTime
```
类型：Number
默认值：500（单位ms，不建议修改）
作用：设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间。
```

#### deceleration
```
类型：Number
默认值：0.0015（不建议修改）
作用：表示 momentum 动画的减速度。
```

#### flickLimitTime
```
类型：Number
默认值：200（单位ms，不建议修改）
作用：有的时候我们要捕获用户的轻拂动作（短时间滑动一个较短的距离）。只有用户在屏幕上滑动的时间小于 flickLimitTime ，才算一次轻拂。
```

#### flickLimitDistance
```
类型：Number
默认值：100（单位px，不建议修改）
作用：只有用户在屏幕上滑动的距离小于 flickLimitDistance ，才算一次轻拂。
```

#### resizePolling
```
类型：Number
默认值：60（单位ms，不建议修改)
作用：当窗口的尺寸改变的时候，需要对 BetterScroll 做重新计算，为了优化性能，我们对重新计算做了延时。60ms 是一个比较合理的值。
```

#### probeType
```
类型：Number
默认值：0
可选值：1、2、3
作用：有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
```

#### preventDefault
```
类型：Boolean
默认值：true
作用：当事件派发后是否阻止浏览器默认行为。这个值应该设为 true，除非你真的知道你在做什么，通常你可能用到的是 preventDefaultException。
```

#### preventDefaultException
```
类型：Object
默认值：{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}
作用：BetterScroll 会阻止原生的滚动，这样也同时阻止了一些原生组件的默认行为。这个时候我们不能对这些元素做 preventDefault，所以我们可以配置 preventDefaultException。默认值 {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/}表示标签名为 input、textarea、button、select、audio 这些元素的默认行为都不会被阻止。
备注：这是一个非常有用的配置，它的 key 是 DOM 元素的属性值，value 可以是一个正则表达式。比如我们想配一个 class 名称为 test 的元素，那么配置规则为 {className:/(^|\s)test(\s|$)/}。
```

#### HWCompositing
```
类型：Boolean
默认值：true（不建议修改）
作用：是否开启硬件加速，开启它会在 scroller 上添加 translateZ(0) 来开启硬件加速从而提升动画性能，有很好的滚动效果。
备注：只有支持硬件加速的浏览器开启才有效果。
```

#### useTransition
```
类型：Boolean
默认值：true（不建议修改）
作用：是否使用 CSS3 transition 动画。如果设置为 false，则使用 requestAnimationFrame 做动画。
备注：只有支持 CSS3 的浏览器开启才有效果。
```

#### bindToWrapper
```
类型：Boolean
默认值：false
作用：move 事件通常会绑定到 document 上而不是滚动的容器上，当移动的过程中光标或手指离开滚动的容器滚动仍然会继续，这通常是期望的。当然你也可以把 move 事件绑定到滚动的容器上，bindToWrapper 设置为 true 即可，这样一旦移动的过程中光标或手指离开滚动的容器，滚动会立刻停止。
```

#### disableMouse
```
类型：Boolean
默认值：根据当前浏览器环境计算而来（不建议修改）
作用：当在移动端环境（支持 touch 事件），disableMouse 会计算为 true，这样就不会监听鼠标相关的事件，而在 PC 环境，disableMouse 会计算为 false，就会监听鼠标相关事件。
```

#### autoBlur
```
类型：Boolean
默认值：true
作用：在滚动之前会让当前激活的元素（input、textarea）自动失去焦点。
```

#### stopPropagation
```
类型：Boolean
默认值：false
作用：是否阻止事件冒泡。多用在嵌套 scroll 的场景。
```

#
## API

API
如果想要彻底了解 BetterScroll，就需要了解其实例的常用属性、灵活的方法以及提供的钩子。

### 属性
有时候我们想基于 BetterScroll 做一些扩展，需要对 BetterScroll 的一些属性有所了解，下面介绍几个常用属性。

#### x
```
类型：Number
作用：bs 横轴坐标。
```

#### y
```
类型：Number
作用：bs 纵轴坐标。
```

#### maxScrollX
```
类型：Number
作用：bs 最大横向滚动位置。
备注：bs 横向滚动的位置区间是 minScrollX - maxScrollX，并且 maxScrollX 是负值。
```

#### maxScrollY
```
类型：Number
作用：bs 最大纵向滚动位置。
备注：bs 纵向滚动的位置区间是 minScrollY - maxScrollY，并且 maxScrollY 是负值。
```

#### movingDirectionX
```
类型：Number
作用：判断 bs 滑动过程中的方向（左右）。
备注：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。
```

#### movingDirectionY
```
类型：Number
作用：判断 bs 滑动过程中的方向（上下）。
备注：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。
```

#### directionX
```
类型：Number
作用：判断 bs 滑动结束后相对于开始滑动位置的方向（左右）。
备注：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。
```

#### directionY
```
类型：Number
作用：判断 bs 滑动结束后相对于开始滑动位置的方向（上下）。
备注：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。
```

#### enabled
```
类型：Boolean,
作用：判断当前 bs 是否处于启用状态。
```

#### pending
```
类型：Boolean,
作用：判断当前 bs 是否处于滚动动画过程中。

#
### 方法
BetterScroll 提供了很多灵活的 API，当我们基于 BetterScroll 去实现一些 feature 的时候，会用到这些 API，了解它们会有助于开发更加复杂的需求。
```

#### refresh()
```
参数：无
返回值：无
作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
```

#### scrollTo(x, y, time, easing, extraTransform, isSilent)
```
参数：
{Number} x 横轴坐标（单位 px）
{Number} y 纵轴坐标（单位 px）
{Number} time 滚动动画执行的时长（单位 ms）
{Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 packages/shared-utils/src/ease.ts 里的写法
只有在你想要修改 CSS transform 的一些其他属性的时候，你才需要传入此参数，结构如下：
let extraTransform = {
  // 起点的属性
  start: {
    scale: 0
  },
  // 终点的属性
  end: {
    scale: 1.1
  }
}
{boolean} isSilent，在 time 为 0 的时候，是否要派发 scroll 和 scrollEnd 事件。isSilent 为 true，则不派发。
返回值：无
作用：滚动到指定的位置。
```

#### scrollBy(x, y, time, easing)
```
参数：
{Number} x 横轴变化量（单位 px）
{Number} y 纵轴变化量（单位 px）
{Number} time 滚动动画执行的时长（单位 ms）
{Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 packages/shared-utils/src/ease.ts 里的写法
返回值：无
作用：相对于当前位置偏移滚动 x,y 的距离。
#### scrollToElement(el, time, offsetX, offsetY, easing)
参数：
{DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
{Number} time 滚动动画执行的时长（单位 ms）
{Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
{Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
{Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 packages/shared-utils/src/ease.ts 里的写法
返回值：无
作用：滚动到指定的目标元素。
```

#### stop()
```
参数：无
返回值：无
作用：立即停止当前运行的滚动动画。
```

#### enable()
```
参数：无
返回值：无
作用：启用 BetterScroll, 默认 开启。
```

#### disable()
```
参数：无
返回值：无
作用：禁用 BetterScroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
```

#### destroy()
```
参数：无
返回值：无
作用：销毁 BetterScroll，解绑事件。
```

#### on(type, fn, context)
```
参数：
{String} type 事件名
{Function} fn 回调函数
{context} 函数执行的上下文环境，默认是 this
返回值：无
作用：监听当前实例上的钩子函数。如：scroll、scrollEnd 等。
示例：
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper', {
  probeType: 3
})
function onScroll(pos) {
    console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
}
scroll.on('scroll', onScroll)
#### once(type, fn, context)
参数：
{String} type 事件名
{Function} fn 回调函数
{context} 函数执行的上下文环境，默认是 this
返回值：无
作用：监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。
```

#### off(type, fn)
```
参数：
{String} type 事件名
{Function} fn 回调函数
返回值：无
作用：移除自定义事件监听器。只会移除这个回调的监听器。
示例：
import BScroll from '@better-scroll/core'
let scroll = new BScroll('.wrapper', {
  probeType: 3
})
function handler() {
    console.log('bs is scrolling now')
}
scroll.on('scroll', handler)

scroll.off('scroll', handler)
```

#
### 钩子

BetterScroll 除了提供了丰富的 API 调用，还提供了一些事件，方便和外部做交互。你可以利用它们实现一些更高级的 feature。

```
const bs = new BScroll('.wrapper', {
  probeType: 3
})

bs.on('beforeScrollStart', () => {
  console.log('scrolling is ready to bootstrap')
})
```

#### beforeScrollStart
```
参数：无
触发时机：滚动开始之前。
```
#### scrollStart
```
参数：无
触发时机：滚动开始时。
```
#### scroll
```
参数：{Object} {x, y} 滚动的实时坐标
触发时机：滚动过程中。
```

#### scrollCancel
```
参数：无
触发时机：滚动被取消。比如你强制让一个正在滚动的 bs 停住。
```

#### scrollEnd
```
参数：{Object} {x, y} 滚动结束的位置坐标
触发时机：滚动结束。
```

#### touchEnd
```
参数：{Object} {x, y} 位置坐标
触发时机：鼠标/手指离开。
```

#### flick
```
参数：无
触发时机：轻拂时。
```

#### refresh
```
参数: 无
触发时机：refresh 方法调用完成后。
```

#### disable
```
参数: 无
触发时机：bs 被禁用，即不再响应 DOM 事件（touchstart、touchmove、touchend...）
```

#### enable
```
参数: 无
触发时机：bs 激活，再次响应 DOM 事件（touchstart、touchmove、touchend...）
```

#### destroy
```
参数：无
触发时机：destroy 方法调用完成后
```
