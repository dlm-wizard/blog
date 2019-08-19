#

#### 1. 获取商家信息

vue-resource：
```js
created () {
  /*请求商家数据*/
  this.$http.get('./api/seller?id=' + this.seller.id).then((response) => {
    response = response.body
    if (response.errno === ERR_OK) {
      /*
        this.seller = response.data「对象赋值会覆盖seller.id」
        assign 相当于 extend() 扩展了this.seller属性「深copy」
      */
      this.seller = Object.assign({}, this.seller, response.data)
  
    }
  })
},
```

```js
import {urlParse} from './common/js/utils'

data () {
  return {
    seller: {
      id: (() => {
        let queryParam = urlParse()
        return queryParam.id
      })()
    }
  }
},

/*父子组件间通信*/
<v-header :seller="seller">
```

#
#### 2. 解析 url 参数

我们看一下 urlParse() 做了什么, 其实就是将 url 参数部分解析为对象 {key: id, value: value}
```js
/* 
 * window.location.search
 *
 * @example ?id=123&a=b
 * @return Object{id: 123, a: b}
 */

export function urlParse () {
  let url = window.location.search
  /**
   * [?&]:    匹配 '?&'
   * [^?&]:   匹配 1个或多个除[?&]之外的字符
   * [=]:     匹配 '='
   * [^?/&]:  匹配 1个或多个除[?/&]之外的字符
   * g: 全局匹配
   * 
   */
  let reg = /[?&][^?&]+=[^?/&]+/g
  let arr = url.match(reg)

  let obj = {}

  // ['?id=123', '&a=b']
  if (arr) {
    arr.map((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])

      obj[key] = val
    })
  }
  return obj
}
```

#
#### 3. header 组件

(1) 生命周期

将数据中的字符建立映射关系，方便我们书写不同css样式
```js
<span class="icon" :class="classMap[seller.supports[0].type]">

created () {
  this.classMap = [
    'decrease',
    'discount',
    'special',
    'invoice',
    'guarantee'
  ]
},
```

#
#### 4. star 组件的使用

```js
/*seller.score分数决定最终显示效果*/
<star :size="48" :score="seller.score">
```



