const app = getApp();
var Utils = require('../../../utils/util.js');
var timeOutGoBack = null;
const weeks = ['日', '一', '二', '三', '四', '五', '六']
function getWeelDay(year, month, day) {
  return new Date(year)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    datePick: false,
    curTime: [0, 0],
    curSelTIndex:0,

    choseStartDate:"",
    choseStartHours:"",
    choseStartMin:"",
    choseEndDate:"",
    choseEndHours:"",
    choseEndMin:"",

    isHaveStartSel:false,
    isHaveEndSel:false,

    alertDateName:"结束日期",       //结束时间名称
    isAlert:false,                  //结束时间选择提示
  },
  start_(e) {
    this.setData({
      Start: e.touches[0].pageX,
      animation: false
    })
    console.log('start', this.data.Start)
  },
  move_(e) {
    let x = e.touches[0].pageX - this.data.Start
    if (x > -100 && x < 0) {
      this.setData({
        movex: x
      })
    }

    this.setData({
      show: e.touches[0].pageX - this.data.Start > 0 ? 'hide' : 'show'
    })
    console.log('move', x)
  },
  end_(e) {
    if (this.data.show == 'show') {
      this.setData({
        movex: -100,
        animation: true
      })
    } else {
      this.setData({
        movex: 0,
        animation: true
      })
    }
    // this.setData({
    //    ListTouchDirection: null
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this, pagetitle = "", alertDateName = that.data.alertDateName,sdt="",edt="",tag="",seldt="";
    try {
      if (options.sdt != null && options.sdt != undefined) {
        sdt = Utils.myTrim(decodeURIComponent(options.sdt));
      }
    } catch (e) { }
    try {
      if (options.edt != null && options.edt != undefined) {
        edt = Utils.myTrim(decodeURIComponent(options.edt));
      }
    } catch (e) { }
    try {
      if (options.tag != null && options.tag != undefined) {
        tag = Utils.myTrim(decodeURIComponent(options.tag));
      }
    } catch (e) { }
    try {
      if (options.edtname != null && options.edtname != undefined) {
        alertDateName = Utils.myTrim(decodeURIComponent(options.edtname));
      }
    } catch (e) { }
    try {
      if (options.pagetitle != null && options.pagetitle != undefined) {
        pagetitle = Utils.myTrim(decodeURIComponent(options.pagetitle));
        if (Utils.myTrim(pagetitle)!=""){
          wx.setNavigationBarTitle({
            title: pagetitle
          })
        }
      }
    } catch (e) { }
    seldt=tag=="s"?sdt:(tag=="e"?edt:"");
    if (Utils.myTrim(sdt) != "") that.setSelDefaultDateTime(sdt,0);
    if (Utils.myTrim(edt) != "") that.setSelDefaultDateTime(edt, 1);
    if (Utils.myTrim(tag) != ""){
      switch(tag){
        case "s":
          that.setData({
            ["curSelTIndex"]: 0,
            ["isHaveStartSel"]: false,
            ["isHaveEndSel"]: false,

            alertDateName: alertDateName,
          })
          break;
        case "e":
          that.setData({
            ["curSelTIndex"]: 1,
            ["isHaveStartSel"]: false,
            ["isHaveEndSel"]: false,

            alertDateName: alertDateName,
          })
          break;
      }
    }
    that.initDay(seldt)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    try {
      if (timeOutGoBack != null && timeOutGoBack != undefined) clearTimeout(timeOutGoBack);
    } catch (err) { }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    try {
      if (timeOutGoBack != null && timeOutGoBack != undefined) clearTimeout(timeOutGoBack);
    } catch (err) { }
  },
  initDay(dtStr) {
    //获取当前选择的年月日
    let that = this, date = new Date(), curTime = that.data.curTime;
    if (dtStr != null && dtStr!=undefined && Utils.myTrim(dtStr) != "") {
      try {
        date = Utils.getDateByTimeStr(dtStr, true);
        date = isNaN(date) ? new Date() : date;
      } catch (e) {
        date = new Date();
        console.log(e)
      }
    }

    let currentYear = date.getFullYear(),
      currentMonth = date.getMonth(),
      currentDay = date.getDate(), currentMonthFact = 0, currentHour = date.getHours(), currentMinute = date.getMinutes(), hourIndex = 0, minuteIndex = 0;

    //获取当年，当月的天数 getDate()，此时month+1
    let monthNum = new Date(currentYear, currentMonth + 1, 0).getDate()
    //获取该月1号是周几，注意此时month不加1
    let week = new Date(currentYear, currentMonth, 1).getDay()

    currentMonthFact = currentMonth + 1;
    let choseDate = currentYear + '-' + (currentMonthFact < 10 ? '0' + currentMonthFact : currentMonthFact) + '-' + (currentDay < 10 ? '0' + currentDay : currentDay);

    curTime = [currentHour, currentMinute];
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth,
      currentDay: currentDay,
      monthNum: monthNum,
      week: week,
      nowYear: currentYear,  //这里的now代表今天对应的日期，存在data中，点击回到今天时再从data中取出
      nowMonth: currentMonth,
      nowDay: currentDay,

      choseDate: choseDate,
      choseHours: currentHour < 10 ? "0" + currentHour : currentHour,
      choseMin: currentMinute < 10 ? "0" + currentMinute : currentMinute,

      curTime: curTime,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindChange(e) {
    let that = this, choseHours = "", choseMin = "", choseHourInt = 0, choseMinInt = 0, curTime = that.data.curTime;
    try {
      choseHourInt = parseInt(e.detail.value[0]);
      choseHourInt = isNaN(choseHourInt) ? 0 : choseHourInt;
    } catch (e) { }
    try {
      choseMinInt = parseInt(e.detail.value[1]);
      choseMinInt = isNaN(choseMinInt) ? 0 : choseMinInt;
    } catch (e) { }
    console.log(e.detail.value[0], e.detail.value[1])
    choseHours = choseHourInt < 10 ? "0" + choseHourInt : choseHourInt;
    choseMin = choseMinInt < 10 ? "0" + choseMinInt : choseMinInt;
    curTime = [choseHourInt, choseMinInt]
    that.setData({
      choseHours: choseHours,
      choseMin: choseMin,

      curTime: curTime,
      // hourIndex:choseHourInt,
      // minuteIndex:choseMinInt,
    })
    that.setSelDateTime(false);
  },
  choseDay(e) {
    let that=this, index_ = e.currentTarget.dataset.day
    if (index_ > 0) {
      if (that.data.choseMonth == that.data.currentMonth && that.data.choseDay == index_) {
        that.setData({
          choseDay: '',
          choseYear: '',
          choseMonth: '',
          choseDay: '',
          datePick: false
        })
      } else {
        console.log(that.data.currentYear, that.data.currentMonth, index_)
        let currentMonthFact = that.data.currentMonth + 1;
        let choseDate = that.data.currentYear + '-' + (currentMonthFact < 10 ? '0' + currentMonthFact : currentMonthFact) + '-' + (index_ < 10 ? '0' + index_ : index_)
        that.setData({
          choseDate: choseDate,
          choseYear: that.data.currentYear,
          choseMonth: that.data.currentMonth,
          choseDay: index_,
          datePick: false
        })
        that.setSelDateTime(true);
      }
    }
  },
  lastMonth() {
    this.setData({
      anmation: true
    })
    //计算余数，除以12之后的余数便是要减的月份数
    let Remainder = this.data.currentMonth % 12;
    if (this.data.currentMonth < 1) {
      //parseInt(this.data.currentMonth / 12) 计算整数，得到的值就是要减的年
      //如果当前选择的月份是负数，需要减整数后再-1
      var currentYear = this.data.currentYear - 1 - parseInt(this.data.currentMonth / 12)
      var currentMonth = 12 - Math.abs(Remainder) - 1
    } else {
      var currentYear = this.data.currentYear + parseInt(this.data.currentMonth / 12)
      var currentMonth = Remainder - 1
    }
    let monthInt = parseInt(this.data.currentMonth / 12)

    // let currentDay = this.data.currentDay;
    let monthNum = new Date(currentYear, currentMonth + 1, 0).getDate()
    let week = new Date(currentYear, currentMonth, 1).getDay()
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth,
      monthNum: monthNum,
      week: week
    })
    setTimeout(() => {
      this.setData({
        anmation: false
      })
    }, 1000)
    console.log(currentYear, currentMonth, week, monthNum)
  },
  nextMonth() {
    this.setData({
      anmation: true
    })
    let Remainder = (this.data.currentMonth + 1) % 12;
    if (Remainder < 0) {
      var currentYear = this.data.currentYear - 1 - parseInt(Remainder / 12)
      var currentMonth = 12 - Math.abs(Remainder)
    } else {
      console.log(Remainder)
      var currentYear = Remainder == 0 ? this.data.currentYear + 1 : this.data.currentYear + parseInt(Remainder / 12)
      var currentMonth = Remainder
    }
    let monthInt = parseInt(this.data.currentMonth / 12)

    // let currentDay = this.data.currentDay;
    let monthNum = new Date(currentYear, currentMonth + 1, 0).getDate()
    let week = new Date(currentYear, currentMonth, 1).getDay()
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth,

      monthNum: monthNum,
      week: week

    })
    setTimeout(() => {
      this.setData({
        anmation: false
      })
    }, 1000)
    console.log(currentYear, currentMonth, week, monthNum)
  },
  //方法：设置默认所选时间
  setSelDefaultDateTime: function (defaultDtValue, curSelTIndex) {
    let that = this, choseDate = "", choseHours = "", choseMin = "";
    let choseDateKey = "", choseHoursKey = "", choseMinKey = "";
    if (defaultDtValue == null || defaultDtValue==undefined || Utils.myTrim(defaultDtValue)=="") return;
    let timeArr = defaultDtValue.split(" ");
    choseDate = timeArr[0].replace(/\//g, "-");
    let t = timeArr[1].split(":");
    if(t.length>=2){
      choseHours = t[0]; choseMin = t[1];
    }
    
    switch (curSelTIndex) {
      case 0:
        choseDateKey = "choseStartDate"; choseHoursKey = "choseStartHours"; choseMinKey = "choseStartMin";
        break;
      default:
        choseDateKey = "choseEndDate"; choseHoursKey = "choseEndHours"; choseMinKey = "choseEndMin"; 
        break;
    }
    that.setData({
      [choseDateKey]: choseDate,
      [choseHoursKey]: choseHours,
      [choseMinKey]: choseMin,
    })
  },
  //方法：设置所选时间
  setSelDateTime:function(isFinallySure){
    let that = this, curSelTIndex = that.data.curSelTIndex, choseDate = that.data.choseDate, choseHours = that.data.choseHours, choseMin = that.data.choseMin, isAlert = that.data.isAlert;
    let choseDayKey = "", choseMonthKey="", choseDateKey = "", choseHoursKey = "", choseMinKey = "", isHaveSelKey = "", isHaveSelValue = isFinallySure ? true : false, isOtherHaveSelKey = "", isOtherHaveSelValue=false;
    switch(curSelTIndex){
      case 0:
        choseDayKey = "choseStartDay"; choseMonthKey = "choseStartMonth";choseDateKey = "choseStartDate"; choseHoursKey = "choseStartHours"; choseMinKey = "choseStartMin"; isHaveSelKey = "isHaveStartSel"; curSelTIndex =isFinallySure?1:curSelTIndex;
        isOtherHaveSelKey = "isHaveEndSel"; isOtherHaveSelValue = that.data.choseEndDate == null || that.data.choseEndDate == undefined || Utils.myTrim(that.data.choseEndDate) == "" ? false : that.data.isHaveEndSel;
        isAlert=true;
        break;
      default:
        choseDayKey = "choseEndDay"; choseMonthKey = "choseEndMonth";choseDateKey = "choseEndDate"; choseHoursKey = "choseEndHours"; choseMinKey = "choseEndMin"; isHaveSelKey = "isHaveEndSel"; curSelTIndex =isFinallySure?0:curSelTIndex;
        isOtherHaveSelKey = "isHaveStartSel"; isOtherHaveSelValue = that.data.choseStartDate == null || that.data.choseStartDate == undefined || Utils.myTrim(that.data.choseStartDate) == "" ? false : that.data.isHaveStartSel;
        isAlert=false;
        break;
    }
    that.setData({
      [choseDateKey]: choseDate,
      [choseHoursKey]: choseHours,
      [choseMinKey]: choseMin,
      [isHaveSelKey]: isHaveSelValue,
      [isOtherHaveSelKey]: isOtherHaveSelValue,
      [choseDayKey]: that.data.choseDay,
      [choseMonthKey]: that.data.choseMonth,
      curSelTIndex: curSelTIndex,
      isAlert: isAlert,
    })

    //如果都选了日期就直接返回
    if (Utils.myTrim(that.data.choseStartDate) != "" && Utils.myTrim(that.data.choseEndDate) != ""){
      timeOutGoBack = setTimeout(that.gotoBackPage, 1500);
    }
  },
  //事件：确定/重选所选时间
  sureSelTime:function(e){
    let that = this, tag = 0, curSelTIndex = that.data.curSelTIndex, isHaveSelKey="";
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }

    let currentStartDateTime = "", currentEndDateTime = "", choseStartDate = that.data.choseStartDate, choseStartHours = that.data.choseStartHours, choseStartMin = that.data.choseStartMin, choseEndDate = that.data.choseEndDate, choseEndHours = that.data.choseEndHours, choseEndMin = that.data.choseEndMin, currentDtValue = null;
    currentStartDateTime = choseStartDate + " " + choseStartHours + ":" + choseStartMin;
    currentEndDateTime = choseEndDate + " " + choseEndHours + ":" + choseEndMin;
    
    that.data.curSelTIndex=tag;
    switch(tag){
      case 0:
        if (that.data.isHaveStartSel){
          //重选
          that.setData({
            ["curSelTIndex"]: 0,
            ["isHaveStartSel"]: false,
            ["isHaveEndSel"]: true,
          })
          that.initDay(currentStartDateTime);
        }else{
          that.setSelDateTime(true);
        }
        break;
      default:
        if (that.data.isHaveEndSel) {
          //重选
          that.setData({
            ["curSelTIndex"]: 1,
            ["isHaveStartSel"]: true,
            ["isHaveEndSel"]: false,
          })
          that.initDay(currentEndDateTime);
        } else {
          that.setSelDateTime(true);
        }
        break;
    }
  },
  //方法：返回
  gotoBackPage: function () {
    let that = this, tag = 0;
    let currentStartDateTime = "", currentEndDateTime = "", choseStartDate = that.data.choseStartDate, choseEndDate = that.data.choseEndDate;
    currentStartDateTime = choseStartDate;
    currentEndDateTime = choseEndDate;
    
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上个页面
    // 直接给上一个页面赋值
    prevPage.setData({
      paramstart: currentStartDateTime,
      paramend: currentEndDateTime,
    });
    wx.navigateBack({
      delta: 1
    })
  },
  //事件：返回
  gotoBack: function (e) {
    let that = this, tag = 0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }

    if (tag == 1) {
      let currentStartDateTime = "", currentEndDateTime = "", choseStartDate = that.data.choseStartDate, choseStartHours = that.data.choseStartHours, choseStartMin = that.data.choseStartMin, choseEndDate = that.data.choseEndDate, choseEndHours = that.data.choseEndHours, choseEndMin = that.data.choseEndMin, currentDtValue = null;
      currentStartDateTime = choseStartDate + " " + choseStartHours + ":" + choseStartMin;
      currentEndDateTime = choseEndDate + " " + choseEndHours + ":" + choseEndMin;
      try {
        currentDtValue = Date.parse(currentStartDateTime.replace(/\-/g, "/"));
      } catch (e) { }
      if (currentDtValue == null || currentDtValue == undefined || isNaN(currentDtValue)) {
        wx.showToast({
          title: "请选择开始时间！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      try {
        currentDtValue = Date.parse(currentEndDateTime.replace(/\-/g, "/"));
      } catch (e) { }
      if (currentDtValue == null || currentDtValue == undefined || isNaN(currentDtValue)) {
        wx.showToast({
          title: "请选择结束时间！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let pages = getCurrentPages();   //当前页面
      let prevPage = pages[pages.length - 2];   //上个页面
      // 直接给上一个页面赋值
      prevPage.setData({
        paramstart: currentStartDateTime,
        paramend: currentEndDateTime,
      });
    }
    wx.navigateBack({
      delta: 1
    })
  }
})