``` css部分
	/* pages/main/index.wxss */
	.container-box{background-color: #efeff4;height: 100vh}
	.img-box{padding: 32rpx;background-color: #fff;border-bottom: 1rpx solid #e5e5e5;position: relative}
	.img-box image{width: 686rpx;height: 686rpx;background-color: #f9f9f9}
	.input-row{
	    margin: 30rpx auto;
	    border-bottom: 1rpx solid #e5e5e5;
	    border-top: 1rpx solid #e5e5e5;
	    display: flex;
	    align-items: center;
	    height: 88rpx;
	    padding: 0 32rpx; 
	    background-color: #fff;
	    font-size: 34rpx;
	    color: #000
	}
	
	.input-row input{margin-left: 100rpx;width: 300rpx}
	.mybtn{width:686rpx;margin: 60rpx auto }
	.mask{position: fixed;top: 0;left: 0;z-index: 3; width: 100%;height: 100%;opacity: 0;}
	.canvas-box{position: fixed;top: 999999rpx;left: 0}

```

```html部分
<view class="container-box">
    <view class="img-box">
        <image bindtap="previewImg" mode="scaleToFill" src="{{imagePath}}"></image>
    </view>
    <form bindsubmit="formSubmit">
        <view class="input-row">
            <label>姓名</label>
            <input name='name' type="text" maxlength="20" placeholder="王 思聪"/>
        </view>
        <view class="input-row">
            <label>金额</label>
            <input name="money" type="number" maxlength="7"  placeholder="1000000"/>
        </view>
        <button formType="submit" class="mybtn" type="primary">生成图片</button>
    </form>
</view>
<view hidden="{{maskHidden}}" class="mask"></view>
<view class="canvas-box">
    <canvas id="canvas" style="width: 686px;height: 686px;" canvas-id="mycanvas"/>
</view>

```

```js部分
// pages/main/index.js
// var util = require("../../utils/util.js");
// var toPinyin = require("../../utils/toPinyin.js");
const context = wx.createCanvasContext('mycanvas');
Page({
  data:{
    imagePath:"",
    name:"WANG SICONG",
    money:"1000000",
    maskHidden:true,
  },
  onLoad:function(options){
    // var that =this
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
    //   sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
    //   success: res => {
    //       console.log(res.tempFilePaths[0])
    //       that.setData({
    //         imagePath:res.tempFilePaths[0]
    //       })
    //   }
    // })
    // 页面初始化 options为页面跳转所带来的参数
    this.createNewImg();
    //创建初始化图片
  },
  onReady:function(){
    // 页面渲染完成
    
    
  },
  onShow:function(){
    
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },

  onUnload:function(){
    // 页面关闭

  },
 //将金额绘制到canvas的固定
  setMoney:function(context){
    // var money=util.toThousands(this.data.money);
    var money=this.data.money;
    var path = "car.png";
    console.log(money);
    context.drawImage(path, 100, 100,100,100);

    context.setFontSize(24);
    // context.setFillStyle("#484a3d");
    context.setFillStyle("#FF3333");
    context.fillText(money, 340, 190);
    context.stroke();
  },
  //将姓名绘制到canvas的固定
  setName:function(context){
    // var name = toPinyin.Pinyin.getFullChars(this.data.name);
    var name = this.data.name;
    context.setFontSize(40);
    // context.setFillStyle("#67695b");
    context.setFillStyle("#FF3333");
    context.save();
    context.translate(80, 20);//必须先将旋转原点平移到文字位置
    // context.rotate(-15 * Math.PI / 180);
    context.fillText(name, 0, 0);//必须为（0,0）原点
    context.restore();
    context.stroke();
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg:function(){
    var that = this;
    const context = wx.createCanvasContext('mycanvas');
    // var path = "car.png";
    var path = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3302399998,3216746631&fm=26&gp=0.jpg";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0,686,686);
    // context.drawImage(path, 0, 0,200,200);

    //金钱显示
    this.setMoney(context);
    //名字显示
    this.setName(context);
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function(){
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(res);
          console.log(tempFilePath);
          //将图片上传服务器
          // wx.uploadFile({
          //   url: "https://e.amjhome.com/baojiayou/webAPI.jsp?cls=main_UploadImg&action=uploadPicture&companyId=5&appId=1&timestamp=1612250069&xcxAppId=wx668d4e3065e5483d&userId=6764&sign=90e9da906edb0046dcbccfd3d91d4408",
          //   filePath: tempFilePath,
          //   name: 'file',
          //   formData: {
          //     'user': 'test'
          //   },
          //   success: function (res) {
          //     console.log("图片上传服务器结果。。。")
          //     wx.hideLoading();
          //     var data = null;
          //     console.log(res)
          //     if (data != null && data.rspCode != null && data.rspCode != undefined && data.rspCode == 0) {
          //       console.log("成功")
          //     } else {
          //       // wx.showToast({
          //       //   title: res.data.rspMsg,
          //       //   icon: 'none',
          //       //   duration: 2000
          //       // })
          //     }
          //   },
          //   fail: function (e) {
          //   }
          // })
          that.setData({
            imagePath: tempFilePath,
            // canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      }, that);
    },2000);
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function(e) {
    var that = this;
    var name = e.detail.value.name;
    var money = e.detail.value.money;
    this.setData({
      name:name,
      money:money,
      maskHidden:false
    });
    wx.showToast({
      title: '形成中...',
      icon: 'loading',
      duration:1000
    });
    setTimeout(function(){
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden:true
      });
    },1000)
  }
})
```