//方法：防抖——首次执行
//采用原理：第一操作触发，连续操作时，最后一次操作打开任务开关（并非执行任务），任务将在下一次操作时触发）
function debounceStart(fn, delay, ctx) {
  let immediate = true
  let movement = null
  return function () {
    let args = arguments

    // 开关打开时，执行任务
    if (immediate) {
      fn.apply(ctx, args)
      immediate = false
    }
    // 清空上一次操作
    clearTimeout(movement)

    // 任务开关打开
    movement = setTimeout(function () {
      immediate = true
    }, delay)
  }
}
//方法：防抖——尾部执行
//采用原理：连续操作时，上次设置的setTimeout被clear掉
function debounceTail(fn, delay, ctx) {
  let movement = null
  return function () {
    let args = arguments

    // 清空上一次操作
    clearTimeout(movement)

    // delay时间之后，任务执行
    movement = setTimeout(function () {
      fn.apply(ctx, args)
    }, delay)
  }
}
//方法：限频，每delay的时间执行一次 
function throttle(fn, delay, ctx) {
  let isAvail = true
  return function () {
    let args = arguments

    // 开关打开时，执行任务
    if (isAvail) {
      fn.apply(ctx, args)
      isAvail = false

      // delay时间之后，任务开关打开
      setTimeout(function () {
        isAvail = true
      }, delay)
    }
  }
}

export default {
  debounceStart: debounceStart,
  debounceTail: debounceTail,
  throttle: throttle,
};