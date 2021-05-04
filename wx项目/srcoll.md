  ```
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        let width = clientWidth * ratio;
        that.globalData.differenheight = height; //屏幕高度
        that.globalData.ballwidth = width; //屏幕宽度
      }
    });
	var Differenheight = app.globalData.differenheight;
  //demo点击页面居中 e为下标
  gotoRechargeRankTop:function(e){
    let that=this;
    let query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    query.select("#rank"+e).boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      var miss = res[0].scrollTop + res[1].top - 10;
      miss = miss - ((Differenheight/4)-(res[1].height/2))
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 300
      });
    });
  }
  //demo顶部 e为下标
  gotoRechargeRankTop:function(e){
    let that=this;
    let query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    query.select("#rank"+e).boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      var miss = res[0].scrollTop + res[1].top - 10;
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 300
      });
    });
  }
  ```