#
#### 1. 数据准备工作

单向数据流
```js
props: {
  size: { /*匹配分辨率不同图片 @2x、@3x*/
    type: Number
  },
  score: { /*分数*/
    type: Number
  }
},
```

定义常量
```js
const LENGTH = 5
const CLS_ON = 'on' /*对应满星样式*/
const CLS_HALF = 'half' /*对应半星样式*/ 
const CLS_OFF = 'off' /*对应零星样式*/

 &.star-48
  .star-item
    width 20px
    height 20px
    margin-right 22px
    background-size 20px 20px
    &:last-child
      margin-right 0
    &.on
      bg-img('star48_on')
    &.half
      bg-img('star48_half')
    &.off
      bg-img('star48_off')
&.star-36
  .star-item
    // 同上
    &.on
      bg-img('star36_on')
    // 同上
&.star-24
  .star-item
    // 同上
    &.on
      bg-img('star24_on')
    // 同上
```

#
#### 2. computed 计算属性

单向数据流
```js
  starType () {
    /*拼接响应式图片类名*/
    return 'star-' + this.size
  },
```

定义常量
```js
itemClasses () {
  let result = []
  let score = Math.floor(this.score * 2) / 2
  let hasDecimal = score % 1 !== 0 /*是否有小数*/
  let integer = Math.floor(score)
  for (let i = 0; i < integer; i++) {
    result.push(CLS_ON)
  }
  if (hasDecimal) {
    /*小数计算规则为半颗星*/
    result.push(CLS_HALF)
  }
  while (result.length < LENGTH) {
    result.push(CLS_OFF)
  }
  return result
}
```

#

```
<div class="star" :class="starType">
  <span v-for="itemClass in itemClasses" class="star-item" 
        :class="itemClass" /*CLS_HALF、CLS_ON、CLS_OFF 对应不同星级图片*/
        :key="itemClass.id"
  >
</div>
```






