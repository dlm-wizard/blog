#### 1. 反转字符串

```js
/**
 * 先反转每个单词，再反转整体
 * 
 * Input: 'hello world'
 * Output: 'world hello'
 */
var reverseString = function(s) {
    s.split(' ')..map(item => {
      return item.split('').reverse.join('')
    }).reverse()
};
var reverse = function (arr) {
  let tmp
  for (let i = 0, j = arr.length-1; i < j;) {
    tmp = arr[i++]
    arr[i] = arr[j]
    arr[j++] = tmp
  }
}
```

#
#### 2. 最长的回文字符串 -- 双指针

```js
// 中心扩散法 [区分 aba 与 abba 两种情况]
var longestPalindrome = function(s) {
  if(s === null || s.length === 0) return "" /*字符串为空*/
  
  var result = "";

  var len = 2 * s.length - 1;
  var l, r;
  
  for(let i = 0; i < len; i++) { /*区分有中心有一个字符与两个字符的情况*/
      l = r = parseInt(i / 2);
      if(i % 2 === 1) l++;
      
      var str = expandFromCenter(s,l,r);
      
      if(str.length > result.length){ /*保留最长回文子串*/
          result = str;
      }
  }
  return result;
};
var expandFromCenter = function(s, l, r){

  while(l >= 0 && r < s.length && s[l] === s[r]){
      l--;
      l++;
  }
  return s.substring(l+1, r);
}
```
