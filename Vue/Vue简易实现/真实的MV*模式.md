#
### GUI程序所面临的问题

![GUI程序所面临的问题](https://camo.githubusercontent.com/1f3484dd4f02f0f99de460e2f1a4ff487bbee1b4/687474703a2f2f6c69766f7261732e6769746875622e696f2f626c6f672f6d76632f6775692e706e67)

#### 图形化用户界面
```bash
# 图形界面的应用程序提供给用户可视化的操作界面，这个界面提供数据和信息

1. 用户输入行为（键盘，鼠标等）会执行一些应用逻辑
2. 应用逻辑（application logic）可能会触发一定的业务逻辑（business logic）对应用程序数据的变更
   => 数据的变更自然需要用户界面的同步变更以提供最准确的信息。

# 栗子：
例如用户对一个电子表格重新排序的操作，应用程序需要响应用户操作，对数据进行排序，然后需要同步到界面上
```

> 开发应用程序的时候，以求更好的管理应用程序的复杂性，都会对应用程序进行分层

#### 基于**职责分离（Speration of Duties）**的思想
```bash
# Model、View
View：用户界面

Model：应用程序的数据 [注意区分viewModel，Model不包含应用的状态，可以简单理解为对象]
=> 提供数据操作的接口，执行相应的业务逻辑

```

有了View和Model的分层，那么问题就来了：View如何同步Model的变更，View和Model之间如何粘合在一起？带着这个问题开始探索MV模式，会发现这些模式之间的差异可以归纳为对这个问题处理的方式的不同。

#
### MVC

> MVC [View+Model+Controller层]

#### 1. 依赖关系
```bash
# Controller
为进行Model和View之间的协作（路由、输入预处理等）的应用逻辑（application logic）

# Model
进行处理业务逻辑。
```

![MVC模式](https://camo.githubusercontent.com/b89ac314c2fd554e7bf33ba1553e10dd91be44fc/687474703a2f2f6c69766f7261732e6769746875622e696f2f626c6f672f6d76632f6d76632d63616c6c2e706e67)

#### 2. 调用关系

```bash
1. 用户操作View以后，View捕获到这个事件，会把处理的权利交移给Controller（Pass calls）

2. Controller会对View数据进行预处理、决定调用哪个Model的接口 [Model执行相关的业务逻辑]

3. Model变更了以后，会通过观察者模式（Observer Pattern）通知View；

4. View通过观察者模式收到Model变更的消息以后，会用Model更新的数据，后重新更新界面。
```

> 有几个需要特别关注的关键点

```bash
1. View是把控制权交移给Controller
   => Controller执行应用程序相关的应用逻辑（对来自View数据进行预处理、决定调用哪个Model的接口等等）


2. Controller操作Model[Model执行相关的业务逻辑]，但不会直接操作View [!它是对View无知的]

# 真正的精髓
# Model的更新是通过观察者模式告知View的
a. Pub/Sub
b. 触发Events

=> View和Model的同步消息是通过观察者模式进行，而同步操作是由View自己获取更新数据然后更新视图

不同的MVC三角关系可能会有共同的Model，一个MVC三角中的Controller操作了Model以后，两个MVC三角的View都会接受到通知，然后更新自己,
保持了依赖同一块Model的不同View显示数据的实时性和准确性。
```

#### MVC的优缺点

```bash
# 优点：
1. 分离业务逻辑和展示逻辑，模块化程度高
2. 应用逻辑需要变更的时候，不用变更业务逻辑和展示逻辑，只需要Controller换成另外一个Controller就行了
3. 观察者模式可以做到多视图同时更新

# 缺点：
1. 视图同步操作是由View自己执行，而View只能在有UI的环境下运行
2. View无法组件化，View是强依赖特定的Model的，如果需要把这个View抽出来作为一个另外一个应用程序可复用的组件就困难了
   因为不同程序的的Domain Model是不一样的
Controller测试困难。因为。在没有UI环境下对Controller进行单元测试的时候，应用逻辑正确性是无法验证的：Model更新的时候，无法对View的更新操作进行断言。

```

#
#### MVC Model 2

> 经典的MVC模式只是解决客户端图形界面应用程序的问题，而对服务端无效。服务端的MVC模式又自己特定的名字

> MVC Model 2，或者叫JSP Model 2

```bash

1. 服务端接收到请求通过路由规则交由给特定的Controller进行处理，Controller执行相应的应用逻辑，对Model进行操作
2. Model执行业务逻辑以后；然后用数据去渲染特定的模版，返回给客户端。

3. HTTP协议是单工协议并且是无状态的
服务器无法直接给客户端推送数据。除非客户端再次发起请求，否则服务器端的Model的变更就无法告知客户端。

# MVC中Model通过观察者模式告知View更新这一环被无情地打破，不能称为严格的MVC
```

> 如何数据渲染？
```bash
# Servlet
在没有jsp前，逐句复制html静态界面丢到Servlet中，按这种方式，要想 "拼接数据" 并完整输出一个html页面，没个几百
上千行out.println()是不可能的...
```

> 浅谈一点jsp的知识概念 [希望在渲染模板时可以动态写入数据]

> 实际上实现的都是同一个需求，在一个Servlet中输出，jsp自动完成了ctrl+cv的工作

```bash
# JSP：Java Server Page “运行在服务器端的页面”
本质是一个Java类 -> 可以动态写入java数据

JSP中直接写HTML代码和Java代码，后期JSP编译成一个Servlet
=> 通过Java代码获取后台数据后拼接到HTML片段中，最终通过out.println()输出

# 服务器会自动通过更新的Model渲染特定的模版

# 与 ajax 请求的区别
1. 请求 Model
2. 请求 View
```

#
#### MVP [view 非常的被动]

> MVP模式是MVC模式的改良

> MVP模式把MVC模式中的Controller换成了Presenter。MVP层次之间的依赖关系如下：

![MVP](https://camo.githubusercontent.com/9b97a7927aad77433d8d965101db17e8515e91d3/687474703a2f2f6c69766f7261732e6769746875622e696f2f626c6f672f6d76632f6d76702d6465702e706e67)

```bash
# MVP打破了View原来对于Model的依赖

1. 用户对View的操作都会从View交移给Presenter
2. Presenter会执行相应的应用程序逻辑，并且对Model进行相应的操作
3. 而这时候Model执行完业务逻辑以后，通过观察者模式把自己的消息传递出去，但是是传给Presenter而不是View
4. Presenter获取到Model变更的消息以后，通过View提供的接口更新界面

# Model仍然通过事件广播自己的变更，但由Presenter监听而不是View
```

> 关键点

```bash
1. View不再负责同步的逻辑，而是由Presenter负责。Presenter中既有应用程序逻辑也有同步逻辑。
2. View需要提供操作界面的接口给Presenter进行调用。
```

> MVP的优缺点
```bash
# 优点：
1. 便于测试
Presenter对View是通过接口进行，对Presenter进行不依赖UI环境的单元测试的时候。可以通过Mock一个View对象

Mock view 对象：
* 实现了View的接口即可
* 依赖注入到Presenter中

2. View可以进行组件化 [View可以做到对业务完全无知]
(1) View不依赖Model。这样就可以让View从特定的业务场景中脱离出来
(1) 它只需要提供一系列接口提供给上层操作。这样就可以做到高度可复用的View组件。


# 缺点：
Presenter中有..., 造成Presenter比较笨重，维护起来会比较困难
1. 应用逻辑以外
2. 大量的View->Model，Model->View的手动同步逻辑
```
#
#### MVVM

> 对MVP模式的一种改良

#### ViewModel

```bash
# ViewModel的含义
视图的模型, 包含了

1. Model
2. 视图的状态

在图形界面应用程序当中，界面所提供的信息可能不仅仅包含应用程序的Model, 还可能包含一些Model不包含的视图状态

例如电子表格上需要显示当前排序的状态是顺序的还是逆序的，这是Model所不包含的，但也是需要显示的信息
```

> 调用关系

```bash
# MVVM的调用关系和MVP一样 [但在ViewModel当中会有 data-binding]

MVP | MVVM
------------ | -------------
Presenter负责的View和Model之间数据同步操作 | 交给数据绑定处理
```

> 双向数据绑定

```bash
# 只需要在View的模版语法中，指令式地声明View的内容是和Model的哪一块数据绑定的
1. ViewModel对进行Model更新的时候，data-binding会自动把数据更新到View上去
2. 用户对View进行操作，data-binding也会把数据更新到Model上去

# 可以简单而不恰当地理解为一个模版引擎，但是会根据数据变更实时渲染
```

> MVVM的优缺点

```bash
# 优点：
1. 解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制。提高了代码的可维护性。
2. 简化测试。因为同步逻辑是交由data-binding做的，View跟着Model同时变更
   => 所以只需要保证Model的正确性，View就正确。大大减少了对View同步更新的测试

# 缺点：

1. 过于简单的图形界面不适用，或说牛刀杀鸡
2. 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高。
```

























