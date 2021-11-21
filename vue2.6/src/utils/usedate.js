import moment from 'moment';
// import _ from "lodash";
import { Message } from 'element-ui'
// 年月日起止日期  // 查询区间 1上月 2本月 3下月
function queryMonthDate (type) {
  let methodFun;
  switch (type) {
    case 1:
      methodFun = moment().month() - 1;
      break;
    case 2:
      methodFun = moment().month();
      break;
    case 3:
      methodFun = moment().month() + 1;
      break;
    case 4:
      methodFun = moment().month() - 3;
      break;
    default:
      break;
  }

  let startDay = moment()
    .month(methodFun)
    .startOf('month')
    .format('YYYY-MM-DD');
  let endDay = moment()
    .month(methodFun)
    .endOf('month')
    .format('YYYY-MM-DD');
  return [startDay, endDay];
}
function lastm () {
  let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth()) : (new Date().getMonth())
  let methodFun = new Date().getFullYear() + '-' + month
  return methodFun
}
// 年月起止日期  // 查询区间 1上月 2本月 3下月
function queryMonth (type) {
  let methodFun;
  switch (type) {
    case 1:
      methodFun = moment().month() - 1;
      break;
    case 2:
      methodFun = moment().month();
      break;
    case 3:
      methodFun = moment().month() + 1;
      break;
    default:
      break;
  }

  let str = moment()
    .month(methodFun)
    .format('MM');
  return str;
}

function number_format (number, decimals, dec_point, thousands_sep) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function nowTime () {
  let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
  let date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  let nowDate = new Date().getFullYear() + "-" + month + "-" + date
  return nowDate
}
function nowMonth () {
  let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
  let nowDate = new Date().getFullYear() + "-" + month
  return nowDate
}
function lastTime () {
  let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
  let date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  let lastDate = new Date().getFullYear() - 1 + "-" + month + "-" + date
  return lastDate
}

function number_format2 (number, decimals, dec_point) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function chiocebox (tag) {
  var boxtype = {}
  switch (tag) {
    case 'error':
      //错误
      boxtype.class = 'cq-a-zu3320'
      boxtype.fontcol = 'errcolor'
      break
    case 'success':
      //成功
      boxtype.class = 'cq-a-zu3317'
      boxtype.fontcol = 'succolor'
      break
    case 'inof':
      //消息
      boxtype.class = 'cq-a-zu3318'
      boxtype.fontcol = 'inofcolor'
      break
    case 'warning':
      //警告
      boxtype.class = 'cq-a-zu3319'
      boxtype.fontcol = 'warncolor'
      break
    default:
      //消息
      boxtype.class = 'cq-a-zu3318'
      boxtype.fontcol = 'inofcolor'
      break
  }
  return boxtype
}


//base对象 type 类型 context 具体内容 title 标题 showCancelButton 是否显示取消按钮 confirmButtonText 确认按钮显示的文字 cancelButtonText 取消按钮显示的文字 
//that 指向
//beforeClose 回调函数 done（）为直接运行
function msgbox (that, base, beforeClose) {
  var type = chiocebox(base.type)
  let p = new Promise(function (resolve, reject) {
    that.$msgbox({
      title: '',
      message: `<span class="all_dio fs14"><a class='icon_dio iconfont ${type.class} ${type.fontcol}'></a>${base.title}</span><div class="all_dio_text">${base.context}</div>`,
      dangerouslyUseHTMLString: true,
      showCancelButton: base.showCancelButton ? base.showCancelButton : true,
      confirmButtonText: base.confirmButtonText ? base.confirmButtonText : '确定',
      cancelButtonText: base.cancelButtonText ? base.cancelButtonText : '取消',
      customClass: base.customClass,
      //离开前判断
      beforeClose: async (action, instance, done) => {
        if (beforeClose) {
          await beforeClose(action, instance, done);
        } else {
          done()
        }
        // resolve(action);
      }
    }).then((res) => {
      if (res == 'confirm') {
        resolve(res);  //确认
      } else {
        reject()       //取消
      }
    }).catch((error) => {
      reject(error)
    })
  });
  return p;
}
//转换
function Convert (tableList, obj) {
  var arr = []
  tableList.forEach((item, index) => {
    let list = []
    for (let k in obj) {
      if (k == 'ko') item.ko = `K${index}`
      if (k == 'index') item.index = index + 1
      list.push(item[k])
    }
    arr.push(list)
  })
  return JSON.stringify(arr)
}

//校验
function chechIsPropertyFree (tableList, tablepropo) {
  if (tableList.length > 0) {
    for (var k = 0; k < tableList.length; k++) {
      for (var i = 0; i < tablepropo.length; i++) {
        var prop = tablepropo[i].prop
        if (!tablepropo[i].viltetype) {
          if (tableList[k][prop] == undefined || tableList[k][prop] == null) {
            Message.warning(tablepropo[i].label + '必填', '请选择' + tablepropo[i].label + '。')
            return true
          }
        }
      }
    }
  }
  return false
}

export default {
  lastMonthStart: queryMonthDate(1)[0],
  lastMonthEnd: queryMonthDate(1)[1],
  currentMonthStart: queryMonthDate(2)[0],
  currentMonthEnd: queryMonthDate(2)[1],
  nextMonthStart: queryMonthDate(3)[0],
  nextMonthEnd: queryMonthDate(3)[1],
  lastMonth: queryMonth(1),
  currentMonth: queryMonth(2),
  nextMonth: queryMonth(3),
  lastYear: moment().year() - 1 + '',
  currentYear: moment().format('YYYY'),
  currentDay: moment().format('YYYY-MM-DD'),
  // 返回moment对象 可直接使用format业务需要的格式
  currentTime: moment(),
  nowDate: nowTime(),
  lastDate: lastTime(),
  lastM: lastm(),
  nowMonth: nowMonth(),
  number_format,
  number_format2,
  msgbox,
  Convert,
  chechIsPropertyFree,
  queryMonthDate
};
