var Utils = require('../../../utils/util.js');
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
    datePick: true,
    curTime:[0,0]
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
    let dtStr="";
    try{
      if (options.curdt != null && options.curdt!=undefined){
        dtStr = Utils.myTrim(decodeURIComponent(options.curdt));
      }
    }catch(e){}
    this.initDay(dtStr)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.data.pageLayerTag = "../../../";
    //按摩进行时，当界面显示立即同步时间（处理微信小程序锁屏导致定时器延时问题）
    app.data.isOnShowQueryCheirapsisTime=app.data.isDeviceMyUsing?true:false;
  },
  initDay(dtStr) {
    //获取当前选择的年月日
    let that = this, date = new Date(), curTime = that.data.curTime;
    if (Utils.myTrim(dtStr)!=""){
      try {
        date = Utils.getDateByTimeStr(dtStr,true);
        date = isNaN(date) ? new Date() : date;
      } catch (e) {
        date = new Date();
        console.log(e)
      }
    }
    
    let currentYear = date.getFullYear(),
      currentMonth = date.getMonth(),
      currentDay = date.getDate(), currentMonthFact = 0, currentHour = date.getHours(), currentMinute = date.getMinutes(), hourIndex=0, minuteIndex=0;

    //获取当年，当月的天数 getDate()，此时month+1
    let monthNum = new Date(currentYear, currentMonth + 1, 0).getDate()
    //获取该月1号是周几，注意此时month不加1
    let week = new Date(currentYear, currentMonth, 1).getDay()

    currentMonthFact = currentMonth+1;
    let choseDate = currentYear + '-' + (currentMonthFact < 10 ? '0' + currentMonthFact : currentMonthFact) + '-' + (currentDay < 10 ? '0' + currentDay : currentDay);

    curTime = [currentHour,currentMinute];
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
      choseHours: currentHour<10? "0"+currentHour:currentHour,
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
    let that=this, choseHours = "", choseMin = "", choseHourInt = 0, choseMinInt = 0, curTime = that.data.curTime;
    try{
      choseHourInt = parseInt(e.detail.value[0]);
      choseHourInt=isNaN(choseHourInt)?0:choseHourInt;
    }catch(e){}
    try {
      choseMinInt = parseInt(e.detail.value[1]);
      choseMinInt = isNaN(choseMinInt) ? 0 : choseMinInt;
    } catch (e) { }
    console.log(e.detail.value[0], e.detail.value[1])
    choseHours=choseHourInt<10?"0"+choseHourInt:choseHourInt;
    choseMin = choseMinInt < 10 ? "0" + choseMinInt : choseMinInt;
    curTime=[choseHourInt,choseMinInt]
    this.setData({
      choseHours: choseHours,
      choseMin: choseMin,

      curTime: curTime,
      // hourIndex:choseHourInt,
      // minuteIndex:choseMinInt,
    })
  },
  choseDay(e) {
    let index_ = e.currentTarget.dataset.day
    if (index_ > 0) {
      if (this.data.choseMonth == this.data.currentMonth && this.data.choseDay == index_) {
        this.setData({
          choseDay: '',
          choseYear: '',
          choseMonth: '',
          choseDay: '',
          datePick: true
        })
      } else {
        console.log(this.data.currentYear, this.data.currentMonth, index_)
        let currentMonthFact = this.data.currentMonth+1;
        let choseDate = this.data.currentYear + '-' + (currentMonthFact < 10 ? '0' + currentMonthFact : currentMonthFact) + '-' + (index_ < 10 ? '0' + index_ : index_)
        this.setData({
          choseDate: choseDate,
          choseYear: this.data.currentYear,
          choseMonth: this.data.currentMonth,
          choseDay: index_,
          datePick: true
        })
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
  //事件：返回
  gotoBack:function(e){
    let that=this,tag=0;
    try {
      tag = parseInt(e.currentTarget.dataset.tag);
      tag = isNaN(tag) ? 0 : tag;
    } catch (err) { }

    if(tag==1){
      let currentDateTime = "", choseDate = that.data.choseDate, choseHours = that.data.choseHours, choseMin = that.data.choseMin,currentDtValue=null;
      currentDateTime=choseDate+" "+choseHours+":"+choseMin;
      try{
        currentDtValue = Date.parse(currentDateTime.replace(/\-/g, "/"));
      }catch(e){}
      if(currentDtValue==null || currentDtValue==undefined || isNaN(currentDtValue)){
        wx.showToast({
          title: "请选择日期！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let pages = getCurrentPages();   //当前页面
      let prevPage = pages[pages.length - 2];   //上个页面
      // 直接给上一个页面赋值
      prevPage.setData({
        params: currentDateTime
      });
    }
    wx.navigateBack({
      delta: 1
    })
  }
})