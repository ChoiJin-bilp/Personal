module.exports = function(msg, page) { // page -> index page
  var app = getApp(), appUserInfo = app.globalData.userInfo;
  var Utils = require('../utils/util.js'),isShowLog=true;
  msg = JSON.parse(msg);
  try{
    wx.hideLoading()
  }catch(e){}
  
  if(isShowLog){
    console.log("设备指令返回结果：" + Utils.myTrim("      --      "));
    console.log(msg);
  }
  
  let that = app.data.webSocketMasterPage, msgContent = null, socketMsgQueue = that.data.socketMsgQueue;
  
  try{
    msgContent = Utils.isNotNull(msg.content) ? JSON.parse(msg.content):null;
  }catch(e){}
  if (Utils.isNotNull(socketMsgQueue) && socketMsgQueue.length>0){
    for (let i = 0; i < socketMsgQueue.length;i++){
      if (socketMsgQueue[i].cmdObj.num == msg.num){
        socketMsgQueue.splice(i,1);
      }
    }
    that.data.socketMsgQueue = socketMsgQueue;
  }
  if (Utils.isNotNull(msgContent)){
    //{\"version\":\"02\",\"signal\":\"15\",\"isUsed\":\"0000\",\"userStatus\":\"00\",\"mode\":\"01\",\"magnitude\":\"01\",\"shajun\":\"01\"}
    var isUsed = Utils.isNull(msgContent.isUsed) ? "" : msgContent.isUsed; //剩余时间 大余0用户在使用
    var signal = msgContent.signal//信号强度

    var mode = Utils.isNull(msgContent.mode) ? "01" : msgContent.mode;
    var magnitude = Utils.isNull(msgContent.magnitude) ? "01" : msgContent.magnitude;
    var shajun = Utils.isNull(msgContent.shajun) ? "0" : msgContent.shajun; //是否杀菌 0：杀菌停止 ； 1：杀菌开启'
    var softVersionStr=Utils.isNull(msgContent.softVersion) ? "0" : msgContent.softVersion;

    var userId = 0;
    try{
      userId=parseInt(msg.to);
      userId=isNaN(userId)?0:userId;
    }catch(e){}
    
    var userStatus = Utils.isNull(msgContent.userStatus) ? "01" : Utils.myTrim(msgContent.userStatus);

    var time = that.data.remainTime, signalNum = that.data.signalPower, workStat = that.data.workStat,softVersion=0;
    //倒计时 时间
    if (Utils.myTrim(isUsed) != "") {
      time = parseInt(isUsed, 16); //16进制转10进制
    }
    if (Utils.myTrim(softVersionStr) != "") {
      softVersion = parseInt(softVersionStr, 16); //16进制转10进制
    }
    that.setData({
      ["softVersion"]: softVersion
    })
    app.data.agentDeviceSoftVersion=softVersion;
    try {
      let signalResult = "", signalFloatResult = 0.00;

      signalNum = parseInt(signal, 16);
      signalNum = isNaN(signalNum) ? 0 : signalNum;
      signalResult = signalNum + "";
      //满格为31，按百分比来换算
      signalFloatResult = signalNum / 31 * 100;
      signalNum = Math.round(signalFloatResult);

      console.log("信号强度：" + signal + "," + signalResult + "," + signalNum + "%")
    } catch (e) { }
    let isHot = that.data.isHot, curFunction = that.data.curFunction, curPower = that.data.curPower;
    //是否杀菌 0：杀菌停止 ； 1：杀菌开启'
    try {
      shajun = parseInt(shajun,16);
      shajun = isNaN(shajun) ? 0 : shajun;
    } catch (e) { }
    isHot=shajun>0?1:0;
    //模式 01：正传 ， 02 : 反转 ；  03： 马达停止
    switch (mode) {
      case "01":
        curFunction = 1;
        break;
      case "02":
        curFunction = 2;
        break;
      case "03":
        curFunction = 3;
        break;
      case "04":
        curFunction = 4;
        break;
      case "05":
        curFunction = 5;
        break;
      case "06":
        curFunction = 6;
        break;
      case "07":
        curFunction = 7;
        break;
      case "08":
        curFunction = 8;
        break;
      case "09":
        curFunction = 9;
        break;
    }
    //强度
    try {
      curPower = parseInt(magnitude, 16);
      curPower = isNaN(curPower) ? 1 : curPower;
    } catch (e) { }

    //判断是否在用
    let isUseStat = false, finishTag = 0;
    if (time > 0 && userId != appUserInfo.userId) {
      if (userId == appUserInfo.userId) {
        //如果上一指令发送者为自己
        isUseStat = false;
      } else {
        //设备已经在用
        isUseStat = true;
      }
    }
    try {
      if(Utils.isNotNull(that.data.isSCmdOperating)){
        if(!(Utils.myTrim(msg.cmd)=="CB51" && that.data.cb51StartTag==1)){
          that.setData({
            ["isSCmdOperating"]: false
          })
        }
      }
    } catch (e) {}
    finishTag = time == 0 ? 1 : 0;
    switch (Utils.myTrim(msg.cmd)) {
      case "CB60":
        that.setData({
          ["curFunction"]: curFunction,
          ["curPower"]: curPower,
          ["isHot"]: isHot,
          
          ["remainTime"]: time,
        })
        that.transformRemainTime(time);
        
        if (time > 0) {
          switch (userStatus){
            //暂停
            case "00":
              console.log("暂停设备成功！")
              //闪烁效果
              that.twinklet();
              that.finishCheirapsisWork(0);
              break;
            //运行
            case "01":
              console.log("启动设备成功！")
              app.data.isDeviceMyUsing=true;
              //如果设备尚未启动则更新记录状态
              if (workStat == 0 && that.data.awardRecordId > 0) {
                //更改相应抽奖记录的已使用状态
                that.setAwardAboutRecordUsed(that.data.awardRecordId);
              }
              that.setData({
                ["workStat"]: 1,
                ["isStartQuickly"]:0,
              })
              //闪烁效果
              that.data.allSecnds = time;
              if (app.data.isCurCheirapsisWorkPage) {
                try {
                  that.setIfSyncTimeStat(true);
                  if (isHot==1) that.setHotDegreeStart(msg.cmd, isHot,shajun, 1);
                } catch (e) { }
              } 
              that.twinklet();
              break;
          }
        } else {
          console.log("关闭设备成功！")
          that.setData({
            ["workStat"]: 3,
            ["remainTime"]: 0,
            ["curSelIndex"]: -1,
          })
          that.data.allSecnds = 0;
          that.transformRemainTime(0);
          that.finishCheirapsisWork(0);
        }
        break;
      //强度设置
      case "CB63":
        that.setData({
          ["curFunction"]: curFunction,
          ["curPower"]: curPower,
          ["isHot"]: isHot,
          ["remainTime"]: time,
        })
        that.data.allSecnds = that.data.lastSyncRemainTime != time && time >= 0 ? time : that.data.allSecnds;
        that.data.lastSyncRemainTime = time;
        if (time <= 0) {
          that.finishCheirapsisWork(0);
        }
        break;
      //模式设置
      case "CB61":
        that.setData({
          ["curFunction"]: curFunction,
          ["curPower"]: curPower,
          ["isHot"]: isHot,
          ["remainTime"]: time,
        })
        that.data.allSecnds = that.data.lastSyncRemainTime != time && time >= 0 ? time : that.data.allSecnds;
        that.data.lastSyncRemainTime = time;
        if (time <= 0) {
          that.finishCheirapsisWork(0);
        }
        break;
      //加热/不加热设置
      case "CB62":
        that.setData({
          ["curFunction"]: curFunction,
          ["curPower"]: curPower,
          ["isHot"]: isHot,
          ["remainTime"]: time,
        })
        that.data.allSecnds = that.data.lastSyncRemainTime != time && time >= 0 ? time : that.data.allSecnds;
        that.data.lastSyncRemainTime = time;

        if (time <= 0) {
          that.finishCheirapsisWork(0);
        }else{
          if (app.data.isCurCheirapsisWorkPage) {
            try {
              that.setHotDegreeStart(msg.cmd, isHot,shajun, that.data.cb62StartTag);
            } catch (e) { }
          }
        }
        break;
      //查询是否在用
      case "CB51":
        console.log("设备在用状态：" + isUseStat);
        that.setData({
          ["isUseStat"]: isUseStat,
          ["signalPower"]: signalNum,  //信号强度设置
          ["isShowRemainTime"]:true,

          ["cb51RemainTime"]:time,

          ["isFControlSucced"]:true,
        })
        switch (that.data.cb51StartTag) {
          //【1】如果为正常启动
          case 1:
            that.data.cb51StartTag = 0;
            if(that.data.softVersion<9 && app.data.isDeviceMyUsing){
              wx.showModal({
                title: '提示',
                content: '设备正在使用,请结束后再从“我的按摩劵”里选择重试！',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    //返回上一页
                    wx.navigateBack({
                      delta: 1
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            }
            if (signalNum <= 0) {
              wx.showModal({
                title: '提示',
                content: '该设备目前不在线，无法启动！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            }
            if (isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，是否切换设备？',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    that.exchangeDeviceEvent(null);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            } 
            
            // //如果设备尚未启动则更新记录状态
            // if (workStat == 0 && that.data.awardRecordId > 0) {
            //   //更改相应抽奖记录的已使用状态
            //   that.setAwardAboutRecordUsed(that.data.awardRecordId);
            // }
            //调用黄夏迪启动机器方法
            that.startHXDDeviceWork();
            break;
          //【2】如果为停止
          case 2:
            that.data.cb51StartTag = 0;
            if (isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，无法停止！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              if (time > 0) {
                that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "00", null);
              }
            }
            break;
          //【3】如果为支付
          case 3:
            that.data.cb51StartTag = 0;
            if (signalNum<=0){
              wx.showModal({
                title: '提示',
                content: '该设备目前不在线，无法支付！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            }
            if (isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，无法支付！',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            }
            
            let curSelRechargeItem = that.data.curSelRechargeItem;
            if (Utils.isNotNull(curSelRechargeItem)) {
              let min = 0, amount = 0.00;
              try {
                min = parseInt(curSelRechargeItem.duration);
                min = isNaN(min) ? 0 : min;
              } catch (e) { }
              try {
                amount = parseFloat(curSelRechargeItem.price);
                amount = isNaN(amount) ? 0.00 : amount;
              } catch (e) { }
              amount = parseFloat(amount.toFixed(app.data.limitQPDecCnt));
              that.showReChargePop(curSelRechargeItem.id, 1, amount, min, "充值" + amount + "元，享受" + min + "分钟足疗按摩");
            } else {
              wx.showToast({
                title: "请选择按摩时间选项！",
                icon: 'none',
                duration: 2000
              })
            }
            break;

          //【1】如果为时间查询
          case 4:
            that.data.cb51StartTag = 0;
            if (time > 0) {
              workStat = userStatus == "00" ? 2 : 1;
            }
            that.setData({
              ["remainTime"]: time,
              ["isHot"]: isHot,
              ["curFunction"]: curFunction,
              ["curPower"]: curPower,
              ["workStat"]: workStat,
            })

            if (Math.abs(that.data.allSecnds - time) < 80) {
              that.data.allSecnds = that.data.lastSyncRemainTime != time && time >= 0 ? time : that.data.allSecnds;
              that.data.lastSyncRemainTime = time;
            } else {
              console.log("【出错：本地时间-设备时间】：" + that.data.allSecnds + "-" + time);
              that.data.allSecnds = time;
              that.data.lastSyncRemainTime = time;
            }
            if (that.data.isReStart) {
              //如果为暂停重新启动
              that.data.isReStart = false;
              if (time <= 0) {
                //暂停定时同步时间操作
                that.finishCheirapsisWork(0);
              } else {
                that.sendDeviceCommand(app.data.agentDeviceAddress, "CB60", "02", null);
              }
            } else {
              if (time <= 0) {
                //暂停定时同步时间操作
                that.finishCheirapsisWork(0);
              }
            }
            break;
          //【4】在用查询
          default:
            if (isUseStat) {
              wx.showModal({
                title: '提示',
                content: '该设备目前为在用状态，是否切换设备？',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    that.exchangeDeviceEvent(null);
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              //【2】设备空闲——上次发送指令者为自己，且有剩余时间则同步时间并更新设备工作状态
              if (userId == appUserInfo.userId) {
                if (time > 0) {
                  that.setData({
                    ["isHot"]: isHot,
                    ["curFunction"]: curFunction,
                    ["curPower"]: curPower,

                    ["signalPower"]: signalNum,  //信号强度设置
                    ["remainTime"]: time,
                    ["workStat"]: Utils.myTrim(userStatus) == "01" ? 1 : 2,
                  })
                  that.data.allSecnds = time;

                  if (app.data.isCurCheirapsisWorkPage){
                    try {
                      that.setIfSyncTimeStat(true);
                      that.setHotDegreeStart(msg.cmd, isHot,shajun,1);
                    } catch (e) { }
                  } 
                }
              }
              if (that.data.finishShowAlert == 1) {
                that.finishCheirapsisWork(0);
              }
            }
            break;
        }
        break;

      default:
        that.setData({
          ["curFunction"]: curFunction,
          ["curPower"]: curPower,
          ["isHot"]: isHot,
          ["signalPower"]: signalNum,  //信号强度设置
          ["remainTime"]: time
        })
        that.data.allSecnds = that.data.lastSyncRemainTime != time && time >= 0 ? time : that.data.allSecnds;
        that.data.lastSyncRemainTime = time;
        if (time <= 0) {
          console.log("设备运作结束停止成功！")
          that.setData({
            ["workStat"]: 3,
            ["remainTime"]: 0,
          })
          that.data.allSecnds = 0;
          that.transformRemainTime(0);
          that.finishCheirapsisWork(0);
        } else{
          switch (userStatus) {
            //暂停
            case "00":
              console.log("暂停设备成功！")
              //闪烁效果
              that.twinklet();
              that.finishCheirapsisWork(0);
              break;
            //运行
            case "01":
              console.log("启动设备成功！")
              that.setData({
                ["workStat"]: 1,
              })
              //闪烁效果
              that.data.allSecnds = time;
              that.twinklet();
              break;
          }
        }
        break;
    }



  }
}
