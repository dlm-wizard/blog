
#### 发布-订阅模式（消息机制）

> 定义了一种依赖关系，解决了主体对象与观察者之间功能的耦合。

这里我将写三个方法，分别做消息发布，消息订阅以及消息的取消发布。

#### 实现
```js
// 观察者
var Observer = function () {};
// 发布消息
Observer.prototype.$on = function () {};
// 取消发布
Observer.prototype.$off = function () {};
// 消息监听触发
Observer.prototype.$emit = function () {};
// 仅发布一次消息，消息触发后就取消该消息
Observer.prototype.$once = function () {};
```

#### 效果
```js
var test = new Observer();
test.$on('event', function (data) {
  console.log(data);
});
test.$emit('event', 'i am an example');
// i am an example
test.$off();
// test._events = {}  // No Properties
test.$once('event1', function(){
	console.log(123)
})
// 123
// test._events =>Object {event1: Array(0)}
test.$emit('event1'); 
// test._events => Object {event1:Array(1)}

```

#
#### 实现

```js

// 定义观察者
var Observer = function () {
  this._events = Object.create(null);
}
/**
 * [$on 发布消息]
 * @param  {[type]}   event [事件别名]
 * @param  {Function} fn    [事件回调]
 */
Observer.prototype.$on = function (event, fn) {
  var this$1 = this;

  var self = this;
  if (Array.isArray(event)) {
    for (var i = 0, l = event.length; i < l; i++) {
      this$1.$on(event[i], fn);
    }
  }
  else {
    (self._events[event] || (self._events[event] = [])).push(fn);
  }
  return self;
}

Observer.prototype.$once = function (event, fn) { /*仅发布一次消息*/
  var self = this;
  function on() {
    self.$off(event, on);
    fn.apply(self, arguments);
  }
  // on.fn = fn;
  self.$on(event, on);
  return self;
}

Observer.prototype.$off = function (event, fn) {
  var this$1 = this;

  var self = this;
  
  if (!arguments.length) { /*取消订阅所有消息*/
    this._events = Object.create(null);
    return self;
  }

  if (Array.isArray(event)) { /*取消消息列表订阅*/
    for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
      this$1.$off(event[i$1], fn);
    }
    return self;
  }
  

  var cbs = self._events[event]; /*取消单一消息订阅*/
  if (!cbs) {
    return self;
  }
  if (arguments.length === 1) {
    this._events[event] = null;
    return self;
  }

  var cb; /*取消消息订阅处理函数*/
  var i = cbs.length;
  while (i--) {
    cb = cbs[i];
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1);
      break;
    }
  }
  return self;
}

Observer.prototype.$emit = function (event) { // [$emit 订阅触发]
  var self = this;
  var cbs = this._events[event];

  if (cbs) {
    var args = [...[].slice.call(arguments, 1)]
    
    for (var i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(self, args);/*this指向window*/
    }
  }
  return self;
};

```






