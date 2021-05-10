// components/protocol/protocol.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    sysName:app.data.sysName,
    plyu:'使用协议',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModalserve(){
      const myEventDetail = { myNum: false };
      //主动触发事件
      this.triggerEvent('myevent', myEventDetail);
    },
    initData(){
      this.setData({
        plyu:'会员协议'
      })
    },
    inloyData(){
      this.setData({
        plyu:'积分规则'
      })
    }
  }
})
