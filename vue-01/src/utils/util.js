const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const DEBUG = false;
var debug = DEBUG ? console.log.bind(console) : function () {};

//方法：防抖——首次执行
//采用原理：第一操作触发，连续操作时，最后一次操作打开任务开关（并非执行任务），任务将在下一次操作时触发）
function debounceStart(fn, delay, ctx) {
  let immediate = true
  let movement = null
  return function () {
    let args = arguments

    // 开关打开时，执行任务
    if (immediate) {
      fn.apply(this, args)
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
      fn.apply(this, args)
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
      fn.apply(this, args)
      isAvail = false

      // delay时间之后，任务开关打开
      setTimeout(function () {
        isAvail = true
      }, delay)
    }
  }
}

//方法：获取两点之间的距离（单位：米）
function getLocationDistance(lat1, lng1, lat2, lng2) {
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;

  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));

  return distance;
}

function removeDOCTYPE(html) {
  return html
    .replace(/<\?xml.*\?>\n/, '')
    .replace(/<!doctype.*>\n/, '')
    .replace(/<!DOCTYPE.*>\n/, '');
}

function transformClassAttr(results) {
  if (results && results.length) {
    results.map((item = {}) => {
      const {
        attrs = {}, children
      } = item;
      if (
        attrs.class &&
        Object.prototype.toString.call(attrs.class) === '[object Array]'
      ) {
        item.attrs.class = item.attrs.class.join(' ');
      }
      if (
        children &&
        Object.prototype.toString.call(children) === '[object Array]'
      ) {
        transformClassAttr(children);
      }
    });
  }
  return results;
}
//方法：将html文本转换成“rich-text”的nodes所需json格式方法
function html2json(html) {
  html = removeDOCTYPE(html);
  var bufArray = [];
  var results = {
    node: 'root',
    children: []
  };
  let htmlParse = {};
  if (typeof module === 'object' && typeof module.exports === 'object') {
    htmlParse = require('./htmlParse');
  }
  htmlParse.HTMLParser(html, {
    start: function (tag, attrs, unary) {
      debug(tag, attrs, unary);
      // node for this element
      var node = {
        // node: 'element',
        name: tag
      };
      if (attrs.length !== 0) {
        node.attrs = attrs.reduce(function (pre, attr) {
          var name = attr.name;
          var value = attr.value;

          // has multi attibutes
          // make it array of attribute
          if (value.match(/ /) && name !== 'style') {
            value = value.split(' ');
          }

          // if attr already exists
          // merge it
          if (pre[name]) {
            if (Array.isArray(pre[name])) {
              // already array, push to last
              pre[name].push(value);
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
            // not exist, put it
            pre[name] = value;
          }

          return pre;
        }, {});
      }
      if (unary) {
        // if this tag dosen't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var parent = bufArray[0] || results;
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function (tag) {
      debug(tag);
      // merge into parent tag
      var node = bufArray.shift();
      if (node.name !== tag) console.error('invalid state: mismatch end tag');

      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    chars: function (text) {
      debug(text);
      var node = {
        type: 'text',
        text: text
      };
      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    comment: function (text) {
      debug(text);
      var node = {
        node: 'comment',
        text: text
      };
      var parent = bufArray[0];
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    }
  });
  const rst = transformClassAttr(results.children);
  return rst;
}

//方法：解码html格式文本
function replaceHtmlChar(str) {
  str = str.replace(/&amp;quot;/g, '"');
  str = str.replace(/&amp;amp;/g, '&');
  str = str.replace(/&amp;lt;/g, '<');
  str = str.replace(/&amp;gt;/g, '>');

  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  //str = str.replace(/&nbsp;/g, ' ');
  return str;
}

function isDBNotNull(obj) {
  if (obj != null && obj != undefined && myTrim(obj) != "null" && myTrim(obj) != "") {
    return true;
  } else {
    return false;
  }
}

function html2Escape(sHtml) {
  return sHtml.replace(/[<>&"]/g, function (c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    } [c];
  });
}
//方法：判断是否为数组
function isArray(value) {
  if (value != null && value != undefined)
    return (typeof value == 'object') && value.constructor == Array;
  else
    return false;
}
//方法：金额数值字符串转换（限定只能带2位小数）
function restrictAmountValue(value, isRound) {
  if (myTrim(value) != "" && value.indexOf('.') >= 0) {
    var array = value.split('.');
    if (array.length > 1 && array[1].length > 2) {
      if (isRound) {
        var temp = 0.00;
        try {
          temp = parseFloat(value);
          temp = isNaN(temp) ? 0.00 : temp;
        } catch (err) {}
        value = temp.toFixed(2);
      } else {
        value = array[0] + "." + array[1].substr(0, 2);
      }
    }
  }
  return value;
}
//方法：标题过滤处理
function filterTitle(str) {
  if (myTrim(str) != "") {
    str = str.replace(/\r?\n|\r/gm, "");

    var myreg = /&/ig;
    if (myreg.test(str)) {
      // wx.showToast({
      //   title: "不允许包含“&”！",
      //   icon: 'none',
      //   duration: 2000
      // })
      str = str.replace(myreg, "");
    }
  }
  return str;
}
//方法：内容过滤
function filterContent(str) {
  if (myTrim(str) != "") {
    str = filterEmoj(str);
  }
  return str;
}
//方法：字符截取——从左边截取n个字符，如果包含汉字，则汉字按两个字符计算
function strLeft(s, n) {
  var s2 = s.slice(0, n),
    i = s2.replace(/[^\x00-\xff]/g, "**").length;

  if (i <= n) return s2;

  i -= s2.length;

  switch (i) {
    case 0:
      return s2;
    case n:
      return s.slice(0, n >> 1);
    default:
      var k = n - i,
        s3 = s.slice(k, n),
        j = s3.replace(/[\x00-\xff]/g, "").length;

      return j ? s.slice(0, k) + strLeft(s3, j) : s.slice(0, k);
  }

}
//获取字符串长度：汉字做两个算
function getStrlengthB(str) {
  return str.replace(/[^\x00-\xff]/g, "**").length;
}

function getStrLen(s, n) {
  var s2 = strLeft(s, n);

  if (myTrim(s) != myTrim(s2)) {
    s2 = strLeft(s, n - 2) + "...";
  }

  return s2;
}

function myTrim(x) {
  if (x != null && x != undefined) {
    try {
      x = x.replace(/^\s+|\s+$/gm, '');
    } catch (err) {}
  } else
    return "";

  return x;
}
//数字转中文数字
function numToChinese(section) {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
  var chnUnitChar = ["", "十", "百", "千"];

  var strIns = '',
    chnStr = '';
  var unitPos = 0;
  var zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

function showModal(content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  return url
}

function StringBuilder() {
  this._stringArray = new Array();
}
StringBuilder.prototype.append = function (str) {
  this._stringArray.push(str);
}
StringBuilder.prototype.toString = function (joinGap) {
  return this._stringArray.join(joinGap);
}

//半角转全角
function toDBC(txtstring) {
  var tmp = "";
  for (var i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) == 32) {
      tmp = tmp + String.fromCharCode(12288);
    }
    if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
    }
  }
  return tmp;
}
//全角转半角
function toCDB(str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) == 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
      continue;
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp
}
//除标点符号外特殊字符判断
function checkStr(str) {
  var pattern = new RegExp("[`~#$^&=|{}''\\[\\]<>/?~#……&——|{}'？]");
  if (pattern.test(str)) {
    return true;
  }
  return false;
}

//包括标点符号外特殊字符判断
function checkStrNoPunc(str) {
  //var pattern = new RegExp("[`~!@#$^&()=|{}':;',\\[\\]<>《》/?~！@#￥……&（）——|{}【】‘；：”“'。，、？]");
  var pattern = /[`~!@#$%^&_+<>?:"{},.\/;'[\]]/im;
  if (pattern.test(str)) {
    return true;
  }
  return false;
}
//特殊字符替换
function replaceStr(str) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  return str.replace(pattern, "");
}
//手机号码校验
function isMobilePhone(str) {
  var myreg = /^1[34578]\d{9}$/;
  if (myTrim(str) == "" || myreg.test(str)) {
    return true;
  } else {
    return false;
  }
}
//身份证号码校验
function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (myTrim(card) == "" || reg.test(card)) {
    return true;
  }
  return false;
}
//手机号/固定电话号码校验
function isTel(str) {
  //var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  var isPhone = /^([0-9]{3,4}[-——])?[0-9]{7,8}$/;
  var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|17[0123456789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
  if (myTrim(str) == "" || (isMob.test(str) || isPhone.test(str))) {
    return true;
  } else {
    return false;
  }
}
//邮箱验证
function isEMail(str) {
  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
  if (myTrim(str) == "" || reg.test(str)) { //正则验证不通过，格式不对

    return true;
  }
  return false;
}

function sortGrade(a, b) {
  return a.grade - b.grade;
}
//方法：字符串转日期变量
function getDateByTimeStr(timeStr, isGetTime) {
  var timeArr = timeStr.split(" ");
  if (timeArr.length >= 2) {
    var d = timeArr[0].split("-");
    var t = timeArr[1].split(":");
    if (t != null && t != undefined && t.length <= 2) t.push(0);
    if (isGetTime)
      return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
    else
      return new Date(d[0], (d[1] - 1), d[2]);
  } else {
    var d = timeArr[0].split("-");
    if (isGetTime)
      return new Date(d[0], (d[1] - 1), d[2], 0, 0, 0);
    else
      return new Date(d[0], (d[1] - 1), d[2]);
  }

}
//方法：根据日期字符串获取只带月日的日期字符串
function getMDStrDateByTimeStr(timeStr, isGetTime) {
  var timeArr = timeStr.split(" ");
  if (timeArr.length >= 2) {
    var d = timeArr[0].split("-");
    var t = timeArr[1].split(":");
    if (t != null && t != undefined && t.length <= 2) t.push(0);
    if (isGetTime)
      return d[1] + "月" + d[2] + "日 " + t[0] + ":" + t[1] + ":" + t[2];
    else
      return d[1] + "月" + d[2] + "日";
  } else {
    var d = timeArr[0].split("-");
    if (isGetTime)
      return d[1] + "月" + d[2] + "日 00:00:00";
    else
      return d[1] + "月" + d[2] + "日";
  }

}
//方法：获取增减天数后的日期
function getDateTimeAddDays(dateTime, addDays) {
  var endDate = dateTime;
  try {
    var value = dateTime.getTime(); //将开始时间转为毫秒            
    value += addDays * (24 * 3600 * 1000); //将天数转换成毫秒后与开始时间相加得到结束时间的毫秒数         
    endDate = new Date(value);
  } catch (err) {}

  return endDate;
}
//方法：获取两个日期之间的天数
function getDaysByDateTime(sDateBegin, sDateEnd) { //sDate1和sDate2是2006-12-18格式  
  var dateSpan, iDays;
  dateSpan = sDateEnd - sDateBegin;
  //dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
}
//方法：获取两个日期之间的时间数
//tag:0天，1小时，2分钟，3秒，4毫秒
function getTimesByDateTime(sDateBegin, sDateEnd, tag) { //sDate1和sDate2是2006-12-18格式  
  var dateSpan;
  dateSpan = sDateEnd - sDateBegin;
  //dateSpan = Math.abs(dateSpan);
  switch (tag) {
    case 0:
      dateSpan = Math.floor(dateSpan / (24 * 3600 * 1000));
      break;
    case 1:
      dateSpan = Math.floor(dateSpan / (3600 * 1000));
      break;
    case 2:
      dateSpan = Math.floor(dateSpan / (60 * 1000));
      break;
    case 3:
      dateSpan = Math.floor(dateSpan / (1000));
      break;
  }

  return dateSpan
}
//方法：获取时间字符串：日期变量，日期连接符，是否包含时间，判断是否改变内容数值
function getDateTimeStr(dateTime, dayConStr, isShowTime) {
  var month = 0,
    day = 0,
    year = 0,
    hour = 0,
    minute = 0,
    second = 0;
  var dateStr = "",
    yearStr = "",
    monthStr = "",
    dayStr = "",
    hourStr = "",
    minuteStr = "",
    secondStr = "";
  try {
    year = dateTime.getFullYear();
    month = dateTime.getMonth() + 1;
    day = dateTime.getDate();
    hour = dateTime.getHours(); //时
	minute = dateTime.getMinutes(); //分
    second = dateTime.getSeconds();

    yearStr = year + "";
    monthStr = month + "";
    dayStr = day + "";
    hourStr = hour + "";
    minuteStr = minute + "";
    secondStr = second + "";
    if (monthStr.length < 2) monthStr = "0" + monthStr;
    if (dayStr.length < 2) dayStr = "0" + dayStr;
    if (hourStr.length < 2) hourStr = "0" + hourStr;
    if (minuteStr.length < 2) minuteStr = "0" + minuteStr;
    if (secondStr.length < 2) secondStr = "0" + secondStr;

    dateStr = isShowTime ? yearStr + dayConStr + monthStr + dayConStr + dayStr + " " + hourStr + ":" + minuteStr + ":" + secondStr : yearStr + dayConStr + monthStr + dayConStr + dayStr;

  } catch (e) {}

  return dateStr;
}
//方法：获取时间字符串2：日期变量，日期连接符，是否包含时间
function getDateTimeStr2(dateTime, dayConStr, isShowTime) {
  var month = 0,
    day = 0,
    year = 0,
    hour = 0,
    minute = 0,
    second = 0;
  var dateStr = "",
    yearStr = "",
    monthStr = "",
    dayStr = "",
    hourStr = "",
    minuteStr = "",
    secondStr = "";
  try {
    year = dateTime.getFullYear();
    month = dateTime.getMonth() + 1;
    day = dateTime.getDate();
    hour = dateTime.getHours(); //时
    minute = dateTime.getMinutes(); //分
    second = dateTime.getSeconds();

    yearStr = year + "";
    monthStr = month + "";
    dayStr = day + "";
    hourStr = hour + "";
    minuteStr = minute + "";
    secondStr = second + "";
    if (monthStr.length < 2) monthStr = "0" + monthStr;
    if (dayStr.length < 2) dayStr = "0" + dayStr;
    if (hourStr.length < 2) hourStr = "0" + hourStr;
    if (minuteStr.length < 2) minuteStr = "0" + minuteStr;
    if (secondStr.length < 2) secondStr = "0" + secondStr;

    dateStr = isShowTime ? yearStr + dayConStr + monthStr + dayConStr + dayStr + " " + hourStr + dayConStr + minuteStr + dayConStr + secondStr : yearStr + dayConStr + monthStr + dayConStr + dayStr;

  } catch (e) {}

  return dateStr;
}
//方法：获取时间字符串3：日期变量，日期连接符，tag:0时间日期、1日期、2时间,10中文时间日期，11中文日期，12中文时间，13中文年，14中文月，15中文日，100短时间日期,101短年无秒日期,102长年无秒日期
function getDateTimeStr3(dateTime, dayConStr, tag) {
  var month = 0,
    day = 0,
    year = 0,
    hour = 0,
    minute = 0,
    second = 0;
  var dateStr = "",
    yearStr = "",
    monthStr = "",
    dayStr = "",
    hourStr = "",
    minuteStr = "",
    secondStr = "";
  try {
    year = dateTime.getFullYear();
    month = dateTime.getMonth() + 1;
    day = dateTime.getDate();
    hour = dateTime.getHours(); //时
    minute = dateTime.getMinutes(); //分
    second = dateTime.getSeconds();

    yearStr = year + "";
    monthStr = month + "";
    dayStr = day + "";
    hourStr = hour + "";
    minuteStr = minute + "";
    secondStr = second + "";
    if (monthStr.length < 2) monthStr = "0" + monthStr;
    if (dayStr.length < 2) dayStr = "0" + dayStr;
    if (hourStr.length < 2) hourStr = "0" + hourStr;
    if (minuteStr.length < 2) minuteStr = "0" + minuteStr;
    if (secondStr.length < 2) secondStr = "0" + secondStr;

    //0时间日期、1日期、2时间,10中文时间日期，11中文日期，12中文时间，13中文年，14中文月，15中文日
    switch (tag) {
      case 0:
        dateStr = yearStr + dayConStr + monthStr + dayConStr + dayStr + " " + hourStr + ":" + minuteStr + ":" + secondStr;
        break;
      case 100:
        dateStr = monthStr + dayConStr + dayStr + " " + hourStr + ":" + minuteStr + ":" + secondStr;
        break;
      case 101:
        dateStr = yearStr.substr(2, 2) + dayConStr + monthStr + dayConStr + dayStr + " " + hourStr + ":" + minuteStr;
        break;
      case 102:
        dateStr = yearStr + dayConStr + monthStr + dayConStr + dayStr + " " + hourStr + ":" + minuteStr;
        break;
      case 1:
        dateStr = yearStr + dayConStr + monthStr + dayConStr + dayStr;
        break;
      case 2:
        dateStr = hourStr + dayConStr + minuteStr + dayConStr + secondStr;
        break;

      case 10:
        dateStr = yearStr + "年" + monthStr + "月" + dayStr + "日" + hourStr + "时" + minuteStr + "分" + secondStr + "秒";
        break;
      case 11:
        dateStr = yearStr + "年" + monthStr + "月" + dayStr + "日";
        break;
      case 12:
        dateStr = hourStr + "时" + minuteStr + "分" + secondStr + "秒";
        break;
      case 13:
        dateStr = yearStr + "年";
        break;
      case 14:
        dateStr = monthStr + "月";
        break;
      case 15:
        dateStr = dayStr + "日";
        break;
    }
  } catch (e) {}

  return dateStr;
}
//获取时间间隔：开始时间，结束时间，标志：0毫秒，1小时，2天
function getTimeInterval(startTime, endTime, tag) {
  var result = 0;
  var stime = Date.parse(new Date(startTime));
  var etime = Date.parse(new Date(endTime));
  var usedTime = etime - stime; //两个时间戳相差的毫秒数

  switch (tag) {
    case 1:
      result = Math.floor(leave1 / (3600 * 1000));
      break;
    case 2:
      result = Math.floor(usedTime / (24 * 3600 * 1000));
      break;
    default:
      result = usedTime;
      break;
  }
  // var days = Math.floor(usedTime / (24 * 3600 * 1000));
  // //计算出小时数
  // var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  // var hours = Math.floor(leave1 / (3600 * 1000));
  // //计算相差分钟数
  // var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  // var minutes = Math.floor(leave2 / (60 * 1000));
  // var time = days + "天" + hours + "时" + minutes + "分";
  return result;
}

function getToJson(url) {
  //1.将？替换为空
  url = url.replace(/^\?/, "");
  //2.以&符号拆分
  url = url.split("&");
  //3.创建一个json变量
  var json = {};
  //4.遍历这个拆分后的数组
  for (var i = 0; i < url.length; i++) {
    //5.url[i]是当前数据，把当前数据再以=拆分的到一个数组，数组的第一个元素就是属性名，第二个就是属性值
    var cur = url[i].split("=");
    //6.将数组中的第一个元素作为json的属性名，，第二个作为属性值
    json[cur[0]] = cur[1];
  }
  return json;
}

function isNotNull(obj) {
  if (obj != null && obj != undefined) {
    return true;
  } else {
    return false;
  }
}

function isNull(source) {
  if (source == null || source == undefined || myTrim(source) === "" || myTrim(source) === "undefined" || source.length == 0) {
    return true;
  } else {
    return false;
  }
}
/* 过滤Emoji */
function filterEmoj(str) {
  var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  if (regStr.test(str)) {
    str = str.replace(regStr, "");
  }
  return str;
}
/** 手机号验证 */
function mobileVer(mobile) {
  var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
  if (myreg.test(mobile)) {
    return true;
  }
  return false;
}
/** 邮箱验证 */
function emailVer(email) {
  email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
  if (email != null && email != "" && email.test(email)) {
    return true;
  }
  return false;
}
/** 电话验证 */
function phoneVer(phone) {
  phone: /^0\d{2,3}-?\d{7,8}$/
  if (phone != null && phone != "" && phone.test(mobile)) {
    return true;
  }
  return false;
}
//返回指定小数位数
function roundFixed(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
  return accAdd(arg, this);
};
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
  return accMul(arg, this);
};

/**
 * 计算日期加几天后的日期时间
 * @param {开始日期} startDate 
 * @param {日期后几天} days 
 */
function dateAddDay(startDate, days) {
  startDate = new Date(startDate);
  startDate = +startDate + days * 1000 * 60 * 60 * 24;
  startDate = new Date(startDate);
  var nextStartDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds();
  console.log(nextStartDate)
  return nextStartDate;
};

/**
 * num:表示距离当前日期的天数，0表示当天，1明天，-1昨天
 */
function formatDate(num) {
  var now = new Date();
  var nowTime = now.getTime();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var ShowTime = nowTime + num * oneDayTime;
  var myDate = new Date(ShowTime);
  var y = myDate.getFullYear(); //年
  var m = myDate.getMonth() + 1; //月
  var d = myDate.getDate(); //日
  return [y, m, d].map(padStartConvert).join('-')
};

function padStartConvert(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取最大的月份日期
 * @param {*} year 
 * @param {*} month 
 */
function getMaxDate(year, month) {
  // 这里的月份不用加减1，就是按通常月份的数字就好
  var myDate = new Date(year, month, 0);
  var y = myDate.getFullYear(); //年
  var m = myDate.getMonth() + 1; //月
  var d = myDate.getDate(); //日
  return [y, m, d].map(padStartConvert).join('-')
}

/**
 * 获取当前月最大日期
 * @param {*} year 
 * @param {*} month 
 */
function getCurMaxDate() {
  var now = new Date();
  return getMaxDate(now.getFullYear(), now.getMonth() + 1)
}

/**
 * 获取当前月初日期
 */
function getCurMinDate() {
  var myDate = new Date();
  var y = myDate.getFullYear(); //年
  var m = myDate.getMonth() + 1; //月
  var d = 1; //日
  return [y, m, d].map(padStartConvert).join('-')
}

module.exports = {
  getToJson: getToJson,
  formatTime: formatTime,
  getTimeInterval: getTimeInterval,
  showModal: showModal,
  StringBuilder: StringBuilder,
  getCurrentPageUrl: getCurrentPageUrl,
  numToChinese: numToChinese,
  getStrLen: getStrLen,
  getStrlengthB: getStrlengthB,
  myTrim: myTrim,
  checkStr: checkStr,
  checkStrNoPunc: checkStrNoPunc,
  replaceStr: replaceStr,

  isMobilePhone: isMobilePhone,
  isCardNo: isCardNo,
  isTel: isTel,
  isEMail: isEMail,
  toDBC: toDBC,
  toCDB: toCDB,
  sortGrade: sortGrade,
  getDateTimeStr: getDateTimeStr,
  getDateTimeStr2: getDateTimeStr2,
  getDateTimeStr3: getDateTimeStr3,
  getDateTimeAddDays: getDateTimeAddDays,
  getDaysByDateTime: getDaysByDateTime,
  getTimesByDateTime: getTimesByDateTime,
  getDateByTimeStr: getDateByTimeStr,
  getMDStrDateByTimeStr: getMDStrDateByTimeStr,

  isNotNull: isNotNull,
  isNull: isNull,
  mobileVer: mobileVer,
  emailVer: emailVer,
  phoneVer: phoneVer,
  roundFixed: roundFixed,

  accAdd: accAdd,
  accSub: accSub,
  filterTitle: filterTitle,
  filterContent: filterContent,
  filterEmoj: filterEmoj,
  restrictAmountValue: restrictAmountValue,
  isArray: isArray,
  replaceHtmlChar: replaceHtmlChar,
  html2json: html2json,
  dateAddDay: dateAddDay,

  getLocationDistance: getLocationDistance,
  debounceStart: debounceStart,
  debounceTail: debounceTail,
  throttle: throttle,

  formatDate: formatDate,
  getCurMaxDate: getCurMaxDate,
  getMaxDate: getMaxDate,
  getCurMinDate: getCurMinDate,
  isDBNotNull:isDBNotNull}