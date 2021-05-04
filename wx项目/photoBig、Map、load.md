## 1.图片放大
```
  /**
   * 预览大图传具体参数
   */
  viewImage: function (imgSrc) {
    var urls = [];
    urls.push(imgSrc);
    wx.previewImage({
      current: imgSrc, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 预览大图传e值
   */
    //事件：图片查看事件
    viewImg: function (e) {
      var src = e.currentTarget.dataset.src;
      var urls = []
      if (Utils.myTrim(src) != "") {
        urls.push(src);
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
        })
      } else {
        wx.showToast({
          title: "无效图片",
          icon: 'none',
          duration: 2000
        })
      }
      console.log(e);
    },
```

##2.'加载中..' 调用
```
  /**
   * 加载调用
   */
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
```

##3.'MapTo' 调用:"云客茶语"
```
 一、 app.josn里面添加
 
  "plugins": {
    "buildPoster": {
      "version": "1.0.4",
      "provider": "wxd5b89223740224d6"
    }
  }
二、 在页面的js里面
// 地图选地址
const chooseLocation = requirePlugin('chooseLocation');
Page{
//跳到 腾讯地图API
  goToMap() {
    var that = this
    var curlocation = that.data.curlocation
    const key = app.data.qqMapSDKKey; //使用在腾讯位置服务申请的key
    const referer = app.data.sysName; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: curlocation.latitude,
      longitude: curlocation.longitude
    });
    const category = '';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
    onUnload() {
      // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
      chooseLocation.setLocation(null);
    },
  //从地图API回调函数
    onShow: function () {
      const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
      console.log(location)
      if (!Utils.isNull(location)) {
        var addAddressData = this.data.addAddressData
        addAddressData.area = location.address
        this.setData({
          addAddressData: addAddressData,
        })
      }
    },
	}
```


##4.'MapTo' 调用:"个人项目"
```
一、 app.josn里面添加
  "plugins": {
    "chooseLocation": {
      "version": "1.0.5",
      "provider": "wx76a9a06e5b4e693e"
    }
  },
  
  
二、 在页面的js里面 
//腾讯API调用地址选择功能
  butonWeb(){
    var that = this
    wx.getLocation({
      altitude: false,
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;
        const key = 'LHKBZ-NRBRD-DW74L-PIQGZ-TNWZS-POBAM'; //使用在腾讯位置服务申请的key
        const referer = 'wx76a9a06e5b4e693e'; //调用插件的app的名称
        const location = JSON.stringify({
          latitude: latitude,
          longitude: longitude
        });
        const category = '';
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
        });
      },
      fail: function (error) {
        console.error(error);
        wx.showToast({
          title: "请设置允许获取你的地址,可以更加方便对于您的定位",
          icon: 'none',
          duration: 1500
        })
      }
    });
  },
  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location);
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },
```
```
json里面 防触发滑动
  // "disableScroll": true
```