#

### 

### v-bind

`v-bind="参数"`

> 告诉 Vue 这是一个`表达式`而不是一个`字符串` [修饰符 prop：properties 与 attributes 之间的关系](https://github.com/dlm-wizard/Interview/edit/master/notes/DOM.md)

> class 和 style 时增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

```bash
修饰符：
# .prop
# .sync

参数：
# 动态绑定
1. 数组语法（flexible）
:class = "[item.prop ? 'dynamic': 'another']"

2. 对象语法（simple） -- dynamic 取决于是否存在 prop
:class = "{dynamic: item.prop}"


# 静态类名
1. :class = [.., 'static'] / {.., 'static'} [数组 / 对象语法]
2. class='static' 

```

```js
<div :class="classObject"></div>

data: {
  isActive: true,
  error: null
},
computed: {
  // 复杂类名
  classObject () {
    return {
      active: this.isActive && !this.error,
      'error': this.error && this.error.type === 'fatal'
    }
  }
}
```

