#
## 动态规划

#
### Fibonacci 问题

* 不要忘记寻常的出口

#### 1. 爬楼梯问题
* [leeocode 70. 爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/submissions/)

```js
/**
 * 1. dp[1]: 一级楼梯  1种走法
 * 2. dp[2]: 二级楼梯  2种走法
 * 
 * dp[i] = dp[i-1] + dp[i-2] -- 每级楼梯可以由前两级楼梯达到
 */
var climbStairs = function(n) {
    var a = 1
    var b = 2
    var ret

    for (let i = 2; i < n; i++) {
        ret = a + b
        a = b
        b = ret
    }
    return ret
};
```

#

#### 2. 强盗抢劫
* [leeocode 198. 打家劫舍](https://leetcode-cn.com/problems/house-robber/)

```js
/**
 * 第 i 个房子抢到的最大money数不是只与前两个房子有关
 * 核心: 第 i 个房子，抢 or not
 */
var rob = function(nums) {
    var prev = 0
    var tmp = 0

    for (var i = 0; i < nums.length; i++) {
        var maxM = Math.max(prev + nums[i], tmp); // 第 i 个房子可以抢到最多的钱
        prev = tmp; // i-1 个房子
        tmp = maxM; // 缓存 maxM 作为 i-1 个房子
    }
    return tmp;
}
```



#

#### 3. 环形打劫
* [leeocode 213. 打家劫舍 II（状态转移方程里包括了寻常）](https://leetcode-cn.com/problems/house-robber-ii/submissions/)

```js
/**
 * 无法维护的代码，因为动归从 i=2 开始
 * 
 * 1. l、r 和 dp寻常无法统一
 * 2. 需要大量的代码维护 dp[i <= 2] 之前的情况
 */
var rob = function (nums) {
    if (!nums.length) return 0
    if (nums.length === 1) return nums[0]

    var len = nums.length

    return Math.max(robbing(0, len-1, nums), robbing(1, len, nums))
}
// 难点: 如何统一 l 与 dp 寻常
var robbing = function (l, r, nums) {
    
    var dp = []
    if (l === 0) dp[l++] = nums[0];
    if (l === 1) dp[l++] = Math.max(nums[1], nums[0]);

    for (let i = l; i < r; i++) {
        dp[i] = Math.max(((dp[i-2] || 0) + nums[i]), dp[i-1])
    }

    return dp[r - 1]
}
```

```js
/**
 * 寻常: 状态转移方程从寻常开始 [dp[i] 更好理解]
 * 
 * 但是环形抢劫无法维护兼容maxM
 */

var robbing = function(l, r, nums) {
    var prev = 0 // i-1 个房子
    var tmp = 0 // i 个房子

    for (var i = l; i < r; i++) {

        var maxM = Math.max(prev + nums[i], tmp); // 第 i 个房子可以抢到最多的钱
        prev = tmp; 
        tmp = maxM; // 缓存
    }
    return tmp;
}
var rob = function (nums) {
    if (!nums.length) return 0

    var len = nums.length
    if (len === 1) return nums[0]

    return Math.max(robbing(0, len-1, nums), robbing(1, len, nums))
}
```


#

#### 4. 

```js
```













