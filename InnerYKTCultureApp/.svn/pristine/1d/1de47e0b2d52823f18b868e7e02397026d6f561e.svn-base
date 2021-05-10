module.exports = (function() {
  var app = getApp();
  var Utils = require('../utils/util.js');
  var webSocketUrl = 'wss://massager.amjhome.com/wss/',isShowLog=true,
  // var webSocketUrl = 'ws://47.106.98.19:21000/wss/',

        socketMsgQueue = [],
        connCallback = null,
        msgReceived = {};

  function connect(callback) { // 发起链接
    wx.connectSocket({
      url: webSocketUrl,
      timeout:80000,
      success: res => {
        console.log('小程序连接成功：', res);
      },
      fail: err => {
        console.log('出现错误啦！！');
        console.log(err)
        app.setErrorMsg2(null, "Web-Socket connectSocket：失败！错误信息：" + JSON.stringify(err), "", false);
        wx.showToast({
          title: '网络异常！',
        })
      }
    });
    connCallback = callback;
  }
  function close() { 
    wx.closeSocket({
      success: res => {
        console.log('webSocket 关闭成功：', res);
      },
      fail: err => {
        console.log('webSocket 关闭错误啦！！');
        console.log(err)
      }
    })
  }

  function initEvent() { // 初始化一些webSocket事件
    wx.onSocketOpen(function(res){ // webSocket打开事件处理
      app.data.socketOpened = true;
      console.log('websocket opened.');
      console.log("WebSocket开始时间：" + Utils.getDateTimeStr3(new Date(),"-",0))
      // 处理一下没发出去的消息
      while(socketMsgQueue.length > 0) {
          var msg = socketMsgQueue.pop();
          sendSocketMessage(msg);
      }
      // sendSocketMessage('after');
      
      // connection callback
      connCallback && connCallback.call(null);
    });
    wx.onSocketMessage(function(res) { // 收到服务器消息时的处理
      if(isShowLog){
        console.log('received msg: ' + res.data);
      }
      
      msgReceived.callback && msgReceived.callback.call(null, res.data, ...msgReceived.params);
    });
    wx.onSocketError(function(res){ // 链接出错时的处理
      console.log('webSocket 出错：',res);
      app.setErrorMsg2(null, "Web-Socket onSocketError：错误信息：" + JSON.stringify(res), "", false);
    });
    wx.onSocketClose(function (res){
      console.log('监听 WebSocket 连接关闭事件。', res)
      console.log("WebSocket关闭时间：" + Utils.getDateTimeStr3(new Date(), "-", 0))
      app.data.socketOpened=false;
    })
  }

  function sendSocketMessage(msg) {
    if (typeof(msg) === 'object') {
      msg = JSON.stringify(msg);
    }
    if (app.data.socketOpened) {
      if(isShowLog){
        console.log("发送指令：")
        console.log(msg);
      }
      
      wx.sendSocketMessage({
        data:msg,
        success: res => {
          if(isShowLog){
            console.log('发送指令成功：', res);
          }          
        },
        fail: err => {
          if(isShowLog){
            console.log('发送指令出现错误啦！！' + err);
          }      
        }
      });
    } else { // 发送的时候，链接还没建立 
      socketMsgQueue.push(msg);
    }
  }

  function setReceiveCallback(callback, ...params) {
    if (callback) {
      msgReceived.callback = callback;
      msgReceived.params = params;
    }
  }

  function init() {
    initEvent();
  }

  init();
  return {
    connect: connect,
    close: close,
    send: sendSocketMessage,
    setReceiveCallback: setReceiveCallback,
  };
})();
