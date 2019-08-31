
## 什么是作用域

1. 某个代码块可见的所有标识符，更精确一点，叫做 `上下文（context）`
2. 当前的`执行上下文（The current context of execution）`

综合一下，作用域即上下文，包含当前所有可见变量。

对于每个执行上下文的三个重要属性：

* 变量对象(Variable object，VO)
* 作用域链(Scope chain)
* this

## Global context

在全局上下文（任何函数以外），this 指向全局对象（全局上下文中变量对象就是全局对象呐）。

1. 全局函数、属性的占位符，可以访问其他所有预定义的对象和属性。

2. 全局对象时作用域链的头，在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。

3. 全局对象不会被垃圾回收。「当程序结束的时候，执行上下文栈（Execution context stack） 才会被清空，`ECS` 最底部永远有个 globalContext」


```js
console.log(this === window); // true
```

## Function context

[有关函数作用域、IIFE 立即执行函数与块级作用域的知识点](https://github.com/dlm-wizard/blog/issues/23)

## 变量对象 (Variable object，VO)

变量对象：执行上下文相关的数据作用域，存储当前作用域中的变量和函数声明。

变量对象是规范上或者说引擎上（词法分析）实现的。函数上下文代码执行时，上下文中变量对象才会被激活为 `活动对象（Activation Object）` ，通过函数 `arguments` 属性初始化。

1. 词法分析：

1.1 函数的所有形参

* 由名称和对应值组成的一个变量对象的属性被创建

1.2 函数声明

* 由名称和对应值 `（函数对象(function-object)）` 组成一个变量对象的属性被创建
* 如果变量对象已经存在相同名称的属性，则 `完全替换` 这个属性


1.3 变量声明

* 由名称和对应值（undefined）组成一个变量对象的属性被创建；
* 如果变量对象已经存在相同名称的属性，则变量声明 `不会干扰` 已经存在的这类属性

举个栗子：

```js
function foo(a) { // { a: 1 }
function b() {} //{ b: reference to function b }
var c = function() {}; //{ c: undefined } 
}

foo(1);
在进入执行上下文后，这时候的 AO 是：

AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: reference to function b(){},
    c: undefined
}
```

2. 代码执行

顺序执行代码，对变量对象的进行赋值

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: reference to function b(){},
    c: reference to FunctionExpression "c" // 修改变量对象的值
}
```

总结一下：

1. 在词法分析时会给变量对象添加形参、函数声明、变量声明等初始属性值

2. 在代码执行时引擎会在作用域链中查找变量并对变量进行赋值操作



## 作用域（scope）链

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从 `词法分析层面上` 的父级执行上下文的变量对象中查找，一直找到全局对象。

这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

## 内部属性 [[scope]]

1. 因为采用词法作用域，在函数定义的时候我们就已经定义好了作用域。

```js
function foo() {
    function bar() {
        ...
    }
}
```

注：`[[scope]]` 并不是完整的作用域链，可以理解为其保存了所有父变量对象的链表。

```js
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

2. 代码执行时，变量对象（AO）被添加到作用域链的前端。
这时候执行上下文的作用域链，我们命名为
`ScopeChain。`

```js
Scope = [AO].concat([[Scope]]);
```

## 执行上下文

我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```js
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```

执行过程如下：

1. checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2. 执行 checkscope 函数，创建 checkscope 函数执行上下文并压入 `ECS`

```js
ECStack = [
    checkscopeContext,
    globalContext
];
```

3. checkscope 函数并不立刻执行，开始词法分析，第一步：复制函数`[[scope]]`属性创建作用域链

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明
```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5. 第三步：将活动对象压入 checkscope 作用域链顶端
```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```

6. 词法分析完毕，开始执行函数，随着函数的执行，修改 AO 的属性值
```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```

7. 查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [
    globalContext
];
```


#
## 参考

[深入理解JS中声明提升、作用域（链）和`this`关键字](https://github.com/creeperyang/blog/issues/16)

[JavaScript深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6)
