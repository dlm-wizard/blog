#
#### 1. 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效 -- hashMap + 栈

如果只有一种类型括号，我们可以使用更简洁省内存的方式 --> 计数器
```js
/**
 * 1. 通过 hashMap 建立了对应关系
 * 2. for...in 的使用
 * 3. 栈：后进先出
 *     栈空：@return false
 *
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  let valid = true;
  const stack = [];
  const mapper = {
    '{': "}",
    "[": "]",
    "(": ")"
  }

  for (let i in s) {
    const v = s[i];
    if (['(', '[', '{'].indexOf(v) > -1) {
      stack.push(v);
    } else {
      const peak = stack.pop();
      if (v !== mapper[peak]) {
        valid = false
      }
    }
  }
  if (stack.length > 0) return false;

  return valid;
};
```

#
#### 2. 原地移除重复的数组元素 -- 双指针

```js

 /**
  * 双指针：快慢指针(开始时这两个指针都指向第一个数字)
  * 
  * 两个指针数字相同 -> 快指针向前走一步
  * 如果不同 -> 则两个指针都向前走一步，用快指针所指向元素替换慢指针元素
  * 
  *   思路：
  *     快指针指向最后一个重复元素
  *     慢指针指向不重复数组的最后一个位置
  * 
  */
var removeDuplicates = function(nums) {
  const size = nums.length;
  let slowP = 0;
  for (let fastP = 0; fastP < size; fastP++) {
      if (nums[fastP] !== nums[slowP]) {
          slowP++;
          /*替换重复元素*/
          nums[slowP] = nums[fastP]
      }   
  }
  return slowP + 1;
};
```

#
#### 3. 原地合并两个排序数组 -- 指针

```js
/**
 * 原地：从后往前比较，并从后往前插入
 * 
 * @param {更新位置} current
 * @param {num1末尾} m
 * @param {num2末尾} n
 * 
 * 
 *  nums1 = [1,2,3,0,0,0], m = 3
 *  nums2 = [2,5,6],       n = 3
 *
 *  Output: [1,2,2,3,5,6]
 */
var merge = function(nums1, m, nums2, n) {
  // 设置一个指针，指针初始化指向nums1的末尾
  // 然后不断左移指针更新元素
  let current = nums1.length - 1;

  while (current >= 0) {
  
    if (n === 0) return; /*nums2[head] < num1[tail]，nums2 直接整块移动到新数组*/

    if (m < 0) {
      nums1[current--] = nums2[--n];
      continue;
    }
    
    // 取大的填充 nums1的末尾
    // 然后更新 m 或者 n
    if (nums1[m - 1] > nums2[n - 1]) {
      nums1[current--] = nums1[--m];
    } else {
      nums1[current--] = nums2[--n];
    }
  }
};
```

#
#### 4. 买卖股票的最佳时机 -- 动态规划

```js
/**
 * dp[i]: 第i天交易股票的最大利润 
 * 
 * 临界条件：dp[i] = 0
 * 状态转移方程：dp[i] = Math.max(dp[i], i-min)
 * 
 * @param {第i天股票的价格} i
 * @param {记录股票买入最低价格} min
 * @return {number}
 * 
 * Input: [7,1,5,3,6,4]
 * Output: 5
 */
var maxProfit = function (prices) {
  let dp[0] = 0,
      min = prices[0]
  for (let i = 1; i < prices.length; i++) {
    // 如果第二天价格更高，在下一天交易利润更高呐!只用更新买入最低价格。
    if (prices[i] > prices[i+1]) {
      dp[i] = Math.max(dp[i], i-min)
    } else {
      min = Math.min(min, i)
    }
  }
}
```

#
#### 5. 两数相加 --- 双指针
```js
/**
 * 两数相加, 如果数组无序，先排序(排序的重要性)
 * 
 *  1. 双指针比较简单
 *  2. hashMap：满足条件的差值与idx对应关系
 *       只要找到满足条件差值 diff，就返回 [diff, i]
 */
var twoSum = function(arr, target) {
  var hash = {};
  
  for(var i = 0; i < arr.length; i++) {
      var num = arr[i];
      if(hash[num] !== undefined) {
          return [hash[num], i]
      } else {
          hash[target - num] = i;
      }
  }
  return [];
}
```


#
#### 6. 出现次数超过一半的元素 --- 消去

```js
// 消去算法: 不断消除不同元素直到没有不同元素，剩下的元素就是我们要找的元素
var majorityElement = function (nums) {
  let count = 1;
  let majority = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      majority = nums[i];
    }
    if (nums[i] === majority) {
      count++;
    } else {
      count--;
    }
  }
  return majority;
};
```

#
#### 7. house robber 相邻的房子有警铃，请问你可以得到的最大金币数是？ --- 动态规划

```js
/**
 * 思路还是和其他简单的动态规划问题一样，我们本质上在解决对于第[i] 个房子，我们抢还是不抢
 * 
 * 寻常: dp[0]、dp[1]
 * 状态转移方程: dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1])
 *
 * Input: [1,2,3,1]
 * Output: 4
 * Input: [2,7,9,3,1]
 * Output: 12
 */
var rob = function (nums) {
  const dp = [];
  dp[0] = 0;
  dp[1] = 0;

  for (let i = 2; i < nums.length + 2; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }

  return dp[nums.length + 1];
};
```

#
#### 8. 给定一个整数数组和一个整数k，找出数组中是否存在两个不同的索引i和j，使得nums [i] = nums [j]并且i和j之间的间距最多为k
####  -- hashMap

```js
/**
 * 对应关系：{value: idx}
 * 每次遍历后更新保证间距最小
 */
var containsNearbyDuplicate = function(nums, k) {
  const visited = {};
  for(let i = 0; i < nums.length; i++) {
      const num = nums[i];
      if (visited[num] !== undefined && i - visited[num] <= k) {
          return true;
      }
      visited[num] = i;
  }
  return false
};
```

```js
// 错误解法：无法保证可以将 k 平分 --> 当数组长度为偶数时，没有数组元素可以作为基准平分数组 --> 回文字符中心扩展法
function containsNearbyDuplicate(num, k) {
  for (let i = 0; i < num.length; i++)   {
    let mid = parseInt(k/2)
    if (i-mid > 0) {
      return num.slice(i-mid, i+mid).indexOf(num[i]) !== -1
    } else {
      return num.slice(i, i+k).indexOf(num[i]) !== -1
    }
  }
}
```

#
#### 9. 将数组中0都移动到数组末尾，且保持其他数组元素的顺序 -- 游标指针

> 原地算法

```js
// 游标替换所有0元素，最后补零即可
var moveZeroes = function(nums) {
  let cur = 0;
  for(let i = 0; i < nums.length; i++) {
      const num = nums[i]

      if (num !== 0) 
        nums[cur++] = num
  }
  for(let i = cur; i < nums.length; i++) {
      nums[cur++] = 0;
  }
};
```

#
#### 10. 两个数组中重复的元素，只添加一次 -- hashMap

```js
var intersection = function (nums1, nums2) {
  const visited = {};
  const ret = [];
  for (let i = 0; i < nums1.length; i++) {
    const num = nums1[i];

    visited[num] = num;
  }

  for (let i = 0; i < nums2.length; i++) {
    const num = nums2[i];

    if (visited[num] !== undefined) {
      ret.push(num);
      visited[num] = undefined;/*push 后去除 visited 中元素*/
    }
  }
  return ret;
};
```

#
#### 11. 两个存储反序数字的链表之和 -- 大数相加

```js
/**
 * Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
 * Output: 7 -> 0 -> 8
 * Explanation: 342 + 465 = 807.
 *
 * 思想：noop 链表结构 keep 加法一致性 [抹平链表长度差异]
 *
 */
var addTwoNumbers = function(l1, l2) {
  var carried = 0; // 用于进位
  const head = new ListNode();
  const noop = {
    val: 0,
    next: null
  };
  let currentNode = head; // 返回的链表的当前node
  let newNode; // 声明在外面节省内存
  let preNode; // 记录前一个节点，便于删除最后一个节点

  while (l1 || l2) {
    newNode = new ListNode(0);
    
    currentNode.val =
      ((l1 || noop).val + (l2 || noop).val + carried) % 10;

    currentNode.next = newNode;
    preNode = currentNode;
    currentNode = newNode;

    if ((l1 || noop).val + (l2 || noop).val + carried >= 10) {
      carried = 1;
    } else {
      carried = 0;
    }

    l1 = (l1 || noop).next;
    l2 = (l2 || noop).next;
  }

  if (carried) {
    // 还有位没进呢
    preNode.next = new ListNode(carried)
  } else {
    preNode.next = null;
  }

  return head;
};
```

#
#### 12. 子序列最小长度, 其总和 sum >= s

```js
/**
 * Input: s = 7, nums = [2,3,1,2,4,3]
 * Output: 2
 * 
 * 如何更新滑动窗口: 每当滑动窗口中的 sum 超过 s， 就去更新最小值，直至 sum 刚好小于 s
 */
var minSubArrayLen = function(s, nums) {
  if (nums.length === 0) return 0;
  const slideWindow = [];/*用滑动窗口记录序列*/
  let acc = 0;
  let min = null;

  for (let i = 0; i < nums.length + 1; i++) {
    const num = nums[i];
    
    /*第一次循环，窗口是不会进行更新的*/
    /*一般思路都是想着先计算acc再去更新滑动窗口，没有想到在acc前可以通过while更新上一循环的最小窗口*/
    while (acc >= s) {
      if (min === null || slideWindow.length < min) {
        min = slideWindow.length;
      }
      acc = acc - slideWindow.shift();
    }

    slideWindow.push(num);

    acc = slideWindow.reduce((a, b) => a + b, 0);
  }

  return min || 0;
};
```


#
#### 13. three sum -- 双指针

在这里之所以要排序解决是因为， 我们算法的瓶颈在这里不在于排序，而在于O(N^2)，如果我们瓶颈是排序，就可以考虑别的方式了

```js
// 不添加重复组合
var threeSum = function(nums) {
  let len = nums.length

  const ret = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < len; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;/*重复元素*/
    let left = i;
    let right = len - 1;
    while (left < right) {
      if (left === i) {
        left++;
      } else if (right === i) {
        right--;
      } else if (nums[left] + nums[right] + nums[i] === 0) {

        ret.push([nums[left], nums[right], nums[i]]);

        while(nums[left] === nums[left + 1]) {/*重复元素*/
            left++;
        }
        left++;
        while(nums[right] === nums[right - 1]) {
            right--;
        }
        right--;
        continue;
      } else if (nums[left] + nums[right] + nums[i] > 0) {
        right--;
      } else {
        left++;
      }
    }
  }
  return ret;
};
```

#
#### 14. 盛水最多的容器 -- 双指针

```js
/**
 * 木板原理，如果l小于r，左移r没有意义
 *  1. 如果双层循环遍历的话，o(n)
 *  2. 双指针 [实际也是双重循环，木板原理减少时间复杂度]
 *  3. 相等的可以随便移动指针
 * 
 * 
 * Input: [1,8,6,2,5,4,8,3,7]
 * Output: 49
 */
var maxArea = function(height) {
  let maxArea = 0
  let l = 0, r = height.length-1

  while(l < r) {
    let currentArea = Math.min(height[l], height[r]) * (r-l)
    if (currentArea > maxArea) {
      maxArea = currentArea
    }
    if (height[l] < height[r]) {
      l++
    }
    else { // 如果相等就随便啦
      r--
    }
  }
  return maxArea
}
```

#
#### 15. 链表交换相邻结点 -- dummy 结点新建链表

```js

/**
 * 1. 只用移动 current [交换结点的前驱]
 * 2. 链表数据结构特点与使用
 */
function swapPairs(head) {
  let dummy = new ListNode(0)
  let current = dummy,
  f, s
  dummy.next = head
  
  while(current.next && current.next.next) {
    f = current.next
    s = f.next

    f.next = s.next
    s.next = f
    current.next = s

    current = current.next.next
  }
  return dummy.next
}
```

#
#### 15. 回溯法

> 难点就是如何避免出现重复组合

```js
// backtrack()
backtrack 结果就是一个组合

之前想了特别久没有想通的是，如何从 for 限制不选取重复的组合与如何控制回溯可以选取重复的元素
其实很简单，就是
1. 固定位置重复字符选取
2. 后序排列重复字符选取的问题

/**
 * 组合总数1: 1. 没有重复 candidates 2. 每个元素可以选取多次
 * 
 * Input: candidates = [2,3,6,7], target = 7, 
 * Output: [ 
 *           [7],
 *           [2,2,3]
 *         ]
 * 
 * 1. 重复的组合：[3,2,3] 
 *    只要 for 遍历之后下次循环从下一个元素开始遍历，就不会出现重复的组合 
 * 
 * 剪枝算法: 限定元素的选取范围 
 *  1. for(start): 限制 for 元素选取
 *  2. i: 限制回溯元素选取
 *
 * 难点：2. i 代表数字可以重复使用， i + 1 代表不可以重复利用
 */
var combinationSum = function(nums, target) {
  let ret = []
  nums.sort((a, b) => a-b)
  backtrack(ret, [], nums, target, 0)
  return ret
};
function backtrack(ret, tmp, nums, target, start) {
  if(target < 0) return
  if (target === 0) {
    return ret.push([...tmp])
  }
  for(let i = start; i < nums.length; i++) {
    tmp.push(nums[i])
    backtrack(ret, tmp, nums, target - nums[i], i)
    tmp.pop()
  }
}
```

```js
/**
 * 组合总数2: 1. 有重复 candidates 2. 每个元素只能选取一次
 * 
 * Input: candidates = [2,5,2,1,2], target = 5,
 * Output: [ 
 *           [5],
 *           [1,2,2]
 *         ]
 * 
 * 1. 排序
 *     1. 排序后重复元素相邻
 *        i > start: 避免选取重复组合元素，但重复元素可以作为初始固定字符
 *
 * 2. i + 1 代表数字不可以重复利用
 */
var combinationSum = function(nums, target) {
  let ret = []
  nums.sort((a, b) => a-b)
  backtrack(ret, [], nums, target, 0)
  return ret
};
function backtrack(ret, tmp, nums, target, start) {
  if(target < 0) return
  if (target === 0) {
    ret.push([...tmp])
  }
  for(let i = start; i < nums.length; i++) {
    if (i > start && nums[i] === nums[i-1]) continue
    tmp.push(nums[i])
    backtrack(ret, tmp, nums, target - nums[i], i+1)
    tmp.pop()
  }
}
```

```js
// backtrack()
backtrack 结果就是固定字符的全排列

/**
 * 全排列
 * 想象下数组固定一个元素就失去一个元素
 *
 * 1. 固定字符与后边字符全排列
 * 2. 固定的字符可以是数组中任意元素
 *
 * 递归出口: tmp.length === nums.length
 */
var combinationSum = function(nums) {
  let ret = []
  nums.sort((a, b) => a-b)
  backtrack(ret, [], nums)
  return ret
}
function backtrack(ret, tmp, nums) {
  if (tmp.length == nums.length) {
    return ret.push([...tmp])
  }
  for (let i = 0; i < nums.length; i++) {
    /*后边字符的排列不能选取已经固定的字符*/
    if (tmp.includes(nums[i]) || nums[i] === nums[i-1]) continue
    tmp.push(nums[i])
    backtrack(ret, tmp, nums)
    tmp.pop()
  }
}
```

```js
/**
 * 全排列II 
 * 
 * 辅助数组 visited[]
 *  includes 无法筛选重复元素
 * 
 * 1. 后序字符的排列不能选取已经固定的字符
 *
 * 2. nums[i] === nums[i - 1] 的基础上访问 visited[i - 1] 判断
 *
 * 递归出口: tmp.length === nums.length
 */
var permuteUnique = function(nums) {
  let ret = []
  let visited = new Array(nums.length).fill(false)
  nums.sort((a, b) => a-b)
  backtrack(ret, [], nums, visited)
  return ret
}
function backtrack(ret, tmp, nums, visited) {
  if (tmp.length == nums.length) {
    return ret.push([...tmp])
  }
  for (let i = 0; i < nums.length; i++) {
    if (visited[i]) continue
    if (i > 0 && nums[i] === nums[i - 1] && visited[i - 1]) continue

    tmp.push(nums[i])
    visited[i] = true
    backtrack(ret, tmp, nums, visited)
    tmp.pop()
  }
}
```

```js
  /**
   * 全组合
   *
   *  1. arr[i ~ arr.length] 的全排列的组合，i的取值范围: 0 ~ arr.length-1 
   *  2. i+1 写为 start+1 组合会重复
   */
  var subSet = function (nums) {
    let ret = []
    backtrack(ret, [], nums, 0)
    return ret
  }
  function backtrack(ret, tmp, nums, start) {
    ret.push([...tmp])
  
    for (let i = start; i < nums.length; i++) {
      tmp.push(nums[i])
      backtrack(ret, tmp, nums, i+1)
      tmp.pop()
    }
  }
  ```
  
  ```js
  /**
   * 全组合II
   *
   * 需要过滤 nums 有重复的情况
   * i > start: 避免选取重复排列元素，但重复元素可以作为初始固定字符
   */
  var subsetsWithDup = function (nums) {
    const ret = [];
    backtrack(ret, [], nums.sort((a, b) => a - b), 0, [])
    return ret;
  };
  function backtrack(ret, tmp, nums, start) {
    ret.push([...tmp])

    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;/*过滤重复元素*/
      
      tmp.push(nums[i]);
      backtrack(ret, tmp, nums, i + 1)
      tmp.pop();
    }
  }
```

#
#### 16. 能够跳到的数组末尾吗？-- 回溯

```js
/**
 * 回溯法
 *  1. 不需要通用题解框架，回溯的结果是数组元素 [不需要回溯每个数组元素进行累加判断]
 *  2. 只需要遍历数组元素维护当前可以到达的最大长度即可
 *
 * 
 */
var canJump = function(nums) {
  let max = 0; // 能够走到的数组下标

  for(let i = 0; i < nums.length; i++) {
      if (max < i) return false; // 当前这一步都走不到，后面更走不到了
      max = Math.max(nums[i] + i, max);
  }
  return max >= nums.length - 1
};
```


#
#### 17. 二维数组 Start 到 Finish 的不同路径，每次只能向右或向下走 -- 回溯法

```js
/**
 * dp[i-1][j-1]: 到达 [i, j] 一共有几条不重复的路径
 * 
 *  1. dp[i][j] 和 dp[i-1][j-1] 无法建立对应关系
 * 
 *  2. 寻常: start 所在 row 与 col 所有网格都只有一种走法, 因为只能向右或向下走
 *      row: dp[0][i] = 1（i >= 1）
 *      col: dp[j][0] = 1（j >= 1）
 * 
 *  3. 状态转移方程: dp[i][j] = j === 1 ? 1 : dp[i - 1][j] + dp[i][j - 1]
 */
var uniquePaths = function (m, n) {
  // m: row, n: col
  if (m === 0 || n === 0) return 0

  var dp = [[1]]; // 构建二维数组..学习一下
  for (var i = 1; i < n; i++) {
    dp[0][i] = 1;
  }
  for (var j = 1; j < m; j++) {
    dp.push([]);
    dp[j][0] = 1;
  }
  for (i = 1; i < m; i++) {
    for (j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
```

```js
/**
 * 可以优化空间复杂度
 *  1. 第一行第i列与第二行第i列的总可能数
 *  2. dp[j]: 左边的元素, dp[j - 1]: 上边的元素
 */
var uniquePaths = function (m, n) {
  const dp = Array(n).fill(1);

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
};
```

#
#### 18. 解码方法 --- 动态规划

```js
/**
 * 转换类型不同的数据后再计算
 * 
 * dp[i] = 以自身去编码（一位） + 以前面的元素和自身去编码（两位）
 * 寻常: 
 *  1. dp[0] = 1
 *  2. dp[1] = +s[0] === "0" ? 0 : 1
 */
var numDecodings = function(s) {
  if (s == null || s.length == 0) return 0;

  const dp = Array(s.length + 1).fill(0);
  dp[0] = 1;
  dp[1] = +s[0] === "0" ? 0 : 1;
  for (let i = 2; i < s.length + 1; i++) {
     const one = +s.slice(i - 1, i);
     const two = +s.slice(i - 2, i);
    
    // 很容易想到: dp[i] = dp[i-1] + dp[i-2]
    // 不能以前面元素和自身去编码, 难点: dp[i] 暂存 dp[i-2], 默认 dp[i] = 0
    if (two >= 10 && two <= 26) {
      dp[i] = dp[i - 2];
    }
    if (one >= 1 && one <= 9) {
      dp[i] = dp[i] + dp[i - 1];
    }
  }
  return dp[dp.length - 1];
};
```


