// components/zhuanpan/zhuanpan.js
//创建并返回内部 audio 上下文 innerAudioContext 对象
const start = wx.createInnerAudioContext();
const mid = wx.createInnerAudioContext();
const stop = wx.createInnerAudioContext();

var app = getApp(), timer = null,rTimer=null;
var DataURL = app.getUrlAndKey.dataUrl;

var allWidth = 0, posTop = 0, factH = 0, centerX = 0, centerY = 0, radiusM = 0;
var startX = 0, startY = 0, endX = 0, endY = 0, rotateDire = 0,lastRotateDire=9,lastRDire=0;
var aStartX = 0, aStartY = 0;
var lastPDateTime=null,nowPDateTime,isNoAward=true;
Component({
   options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
   },

   /**
    * 组件的属性列表
    * 用于组件自定义设置   组件的对外属性
    */
   properties: {
      myProperty: {    // 属性名        myProperty2: String, 简化的定义方式
         type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
         value: '',    // 属性默认 初始值（可选），如果未指定则会根据类型选择一个
         observer: function (newVal, oldVal, changedPath) {
            // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
            // 通常 newVal 就是新设置的数据， oldVal 是旧数据
         }
      },
     imgurl: {
       type: String, // 概率开关，默认随机 false
       value: DataURL +"/prize"
     },
      probability: {
         type: Boolean, // 概率开关，默认随机 false
         value: false
      },

      musicflg: {
         type: Boolean, // 转盘声音开关，默认true
         value: true
      },

      fastJuedin: {
         type: Boolean, // 快速转动转盘的开关，默认false
         value: false
      },

      repeat: {
         type: Boolean, // 重复抽取开关，默认false
         value: false
      },

      size: {
         type: Object, // 转盘大小，宽高单位rpx
         value: {
            w: 659, // 注意宽要比高小1rpx
            h: 660
         }
      },

      zhuanpanArr: { // 可以切换的转盘选项, 支持多个
         type: Array,
         value: [
            {
               id: 0,
               option: '转盘的标题名称',
               awards: [
                  {
                     id: 0,
                     name: "最多17个选项", // 选项名
                     color: 'white',        // 选项的前景颜色
                     bgcolor: 'red',    // 选项的背景颜色
                     probability: 0       // 概率
                  },
                  {
                     id: 1,
                     name: "选项最多填13字", // 超过9个字时字体会变小点
                     color: 'white',
                     bgcolor: 'green',      
                     probability: 0
                  }
               ],
            }
         ]
      },

      // 限制：最多17个选项， 单个选项最多填10-13个字, 选项名称最多21个字
      awardsConfig: { // 默认的当前转盘选项 
         type: Object,
         value: {
            option: '我的小决定？',
            awards: [
               {
                  id: 0,
                  name: "最多17个选项",
                  color: 'white',
                  bgcolor: 'green', 
                  probability: 0
               },
               {
                  id: 1,
                  name: "选项最多填13字",
                  color: 'white',
                  bgcolor: 'green', 
                  probability: 0
               }
            ],
         }
      }

   },

   /**
    * 私有数据,组件的初始数据
    * 可用于模版渲染   
    */
   data: {
      animationData: {}, // 转盘动画
      zhuanflg: false,   // 转盘是否可以点击切换的标志位
      fastTime: 7600,    // 转盘快速转动的时间
      slowTime: 3900,    // 转盘慢速转动的时间
      block1: 'block',   // 转盘中心的图片标志位，用来显示隐藏
      block2: 'none',
      block3: 'none',
      block4: 'none',
      tpshow:'',
      getGrade:0,
   },

   //组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
   created: function () {
      console.log('==========created==========');
   },

   // 组件生命周期函数，在组件实例进入页面节点树时执行
   attached: function () {
      console.log('==========attached==========');
     start.src = DataURL+'/music/start.mp3'; // 转盘开始转动的音乐
     mid.src = DataURL +'/music/mid.mp3';     // 快速决定时，转盘开始转动的音乐
     stop.src = DataURL +'/music/stop.mp3';   // 转盘停止转动的音乐

      this.setData({
         awardsConfig: this.data.zhuanpanArr[0]
      })
      this.initAdards();
   },

   /**
    * 组件的方法列表
    * 更新属性和数据的方法与更新页面数据的方法类似
    */
   methods: {
      /*
       * 公有方法
       */
      //判断值是否为空
      isNull(str) {
         if (str == null || str == undefined || str == '') {
            return true;
         } else {
            return false;
         }
      },
      //计算两点之间的距离
      getTwoPointerDistance(x0, y0, x1, y1) {
        var dis = 0;
        var xdiff = x1 - x0;            // 计算两个点的横坐标之差
        var ydiff = y1 - y0;            // 计算两个点的纵坐标之差
        dis = Math.round(Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5));
        return dis;
      },
      //根据两点和中心位置判断旋转方向：0顺时针，1逆时针
      judgeRotateDirection(x0, y0, x1, y1, cx, cy) {
        var p0 = "", p1 = "";
        var direct = 0;
        p0 = (x0 <= cx) ? "L" : "R";
        p0 += (y0 <= cy) ? "T" : "B";

        p1 = (x1 <= cx) ? "L" : "R";
        p1 += (y1 <= cy) ? "T" : "B";
        switch (p0) {
          case "LT":
            switch (p1) {
              case "LT":
                direct = (x0 < x1) ? 0 : 1;
                direct = (y0 < y1) ? 1 : 0;
                if(lastRotateDire!=9)direct=lastRotateDire;
                break;
              case "RT":
                direct = 0;
                break;
              case "LB":
                direct = 1;
                break;
              case "RB":
                direct = lastRotateDire;
                break;
            }
            break;
          case "RT":
            switch (p1) {
              case "LT":
                direct = 1;
                break;
              case "RT":
                direct = (x0 < x1) ? 0 : 1;
                direct = (y0 < y1) ? 0 : 1;
                if (lastRotateDire != 9) direct = lastRotateDire;
                break;
              case "LB":
                direct = lastRotateDire;
                break;
              case "RB":
                direct = 0;
                break;
            }
            break;
          case "LB":
            switch (p1) {
              case "LT":
                direct = 0;
                break;
              case "RT":
                direct = lastRotateDire;
                break;
              case "LB":
                direct = (x0 < x1) ? 1 : 0;
                direct = (y0 < y1) ? 1 : 0;
                if (lastRotateDire != 9) direct = lastRotateDire;
                break;
              case "RB":
                direct = 1;
                break;
            }
            break;
          case "RB":
            switch (p1) {
              case "LT":
                direct = lastRotateDire;
                break;
              case "RT":
                direct = 1;
                break;
              case "LB":
                direct = 0;
                break;
              case "RB":
                direct = (x0 < x1) ? 1 : 0;
                direct = (y0 > y1) ? 1 : 0;
                if (lastRotateDire != 9) direct = lastRotateDire;
                break;
            }
            break;
        }
        console.log(x0 + "," + y0 + " | " + x1 + "," + y1 + "|" + cx + "," + cy)
        console.log(p0 + "," + p1)
        lastRotateDire=direct;
        return direct;
      },
      //根据两点和中心位置计算夹角
      calculateRotateAngle(x0, y0, x1, y1, cx, cy) {
        var pcx0 = Math.sqrt(Math.pow(x0 - cx, 2) +
          Math.pow(y0 - cy, 2));
        var pcx1 = Math.sqrt(Math.pow(x1 - cx, 2) +
          Math.pow(y1 - cy, 2));
        var px01 = Math.sqrt(Math.pow(x1 - x0, 2) +
          Math.pow(y1 - y0, 2));

        var cosC = (Math.pow(pcx0, 2) + Math.pow(pcx1, 2) - Math.pow(px01, 2)) /
          (2 * pcx0 * pcx1);
        var angleA = Math.round(Math.acos(cosC) * 180 / Math.PI);

        return angleA;
      },

      //初始化数据
      initAdards() {
        var that = this;
        if (that.data.awardsConfig==null)return;
         var awardsConfig = that.data.awardsConfig;
         var t = awardsConfig.awards.length,isHaveNAWard=false;  // 选项长度
         var e = 1 / t, i = 360 / t, r = i - 90;
         //初始化奖项扇形的旋转角度
         for (var g = 0; g < t; g++) {
            awardsConfig.awards[g].item2Deg = g * i + 90 - i / 2 + "deg";//当前下标 * 360/长度 + 90 - 360/长度/2
            awardsConfig.awards[g].afterDeg = r + "deg";
           if (awardsConfig.awards[g].index == 0) isHaveNAWard=true;
         }
        isNoAward = isHaveNAWard?true:false;
         that.setData({
            turnNum: e, // 页面的单位是turn
            awardsConfig: awardsConfig,
         })

         that._change();//向父组件传出当前转盘的初始数据
      },

      //重置转盘
      reset(e) {
         var that = this, awardsConfig = that.data.awardsConfig;
         console.log(awardsConfig);
         var animation = wx.createAnimation({
            duration: 1,
            timingFunction: "linear"
         });
         that.animation = animation;
         animation.rotate(0).step(), app.runDegs = 0;

         that.setData({
            animationData: animation.export(),
            block4: 'block'
         })

         for (let x in awardsConfig.awards) {
            awardsConfig.awards[x].opacity = '1';
         }

         setTimeout(function () {
            that.setData({
               block1: 'block',
               block2: 'none',
               block3: 'none',
               block4: 'none',
               awardsConfig: awardsConfig,
            })

            that._myAwards(true);
         }, 300)

        this.triggerEvent('resetZhuan', e);
      },

      //父组件需要切换当前转盘的选项
      //如果有需要切换不同转盘的选项时，可以调用这方法
      //obj: 转盘的数据
      //flag: 当转盘在转动过程中的标志位，默认可不传
      switchZhuanpan(data, flag) {
        if(data==null)return;
        allWidth = wx.getSystemInfoSync().windowWidth;
        centerX = Math.round(allWidth / 2);
        var query = wx.createSelectorQuery().in(this)
        var container = query.select('.canvas-container');
        var containerContent = query.select('.gb-wheel-content');
        container.boundingClientRect(function (res) {
          posTop = res.top // 这个组件内 #the-id 节点的上边界坐标
          containerContent.boundingClientRect(function (res) {
            factH = res.height;
            radiusM = Math.round(factH / 2);
            centerY = posTop + radiusM;
          }).exec()
        }).exec()

         this.setData({
            awardsConfig: data,
            block1: 'block',
            block3: 'none',
            zhuanflg: false,
         })
         this.initAdards();

         if (flag) {
            this.reset();
            clearTimeout(timer);
            start.stop();
            mid.stop();
            stop.stop();
            wx.removeStorageSync('repeatArr');
         }
      },



      /*
      * 内部私有方法建议以下划线开头
      * triggerEvent 用于触发事件,过triggerEvent来给父组件传递信息的
      * 写法： this.triggerEvent('cancelEvent', { num: 1 })  // 可以将num通过参数的形式传递给父组件
      */

      // GO转盘开始转动
      _zhuan() {
        var _this=this;
        _this.data.getGrade=0;
        this.triggerEvent('startToZhuan', this.data.awardsConfig);// 向父组件传出当前决定的数组数据
      },
      //------------------------------------------
      // 事件：转盘开始点触加速
      _startFaster(e) {
        if (this.data.block2 != "block")return;
        var _this = this;

        var ppDistance = 0;
        var curX = Math.round(e.touches[0].pageX), curY = Math.round(e.touches[0].pageY), curDis = 0;
        curDis = this.getTwoPointerDistance(centerX, centerY, curX, curY);
        console.log("Touch Start:" + curX + "," + curY +
          "[" + allWidth + "," + posTop + "]")
        console.log("Touch Start Size:" + this.data.size.w + "," + this.data.size.h)

        if (curDis > radiusM) {
          console.log("Now Out......")
        }
        startX = curX; startY = curY;
        aStartX = curX; aStartY = curY;
        lastPDateTime = new Date();
        lastRotateDire = 9;
      },
      // 事件：转盘触摸移动加速
      _fasterMove(e) {
        var that = this;
        if (that.data.block2 == "block"){
          var curX = Math.round(e.touches[0].pageX), curY = Math.round(e.touches[0].pageY), curDis = 0;
          rotateDire = that.judgeRotateDirection(startX, startY, curX, curY, centerX, centerY);
          //console.log(aStartX + "," + aStartY + " - " +startX + "," + startY + " - " + curX + "," + curY)
          startX = curX; startY = curY;
          var rotateDireText = rotateDire == 0 ? "顺时针" : "逆时针";
          

          nowPDateTime = new Date();
          var ppms = 1,sPPms=0,setTurns=1;
          try{
            ppms = nowPDateTime.getTime() - lastPDateTime.getTime();
          }catch(e){ppms=1;}
          var angle = that.calculateRotateAngle(aStartX, aStartY, curX, curY, centerX, centerY);
          setTurns = Math.round(1000 / ppms);
          setTurns = setTurns==0?1:setTurns;
          if (angle >= 45) {
            lastPDateTime = nowPDateTime;
            aStartX = curX; aStartY = curY;
            
            //要转多少度deg
            //app.runDegs = app.runDegs || 0;
            //if (rotateDire == 0) {
            //  app.runDegs = app.runDegs + angle;
            //} else {
            //  if (lastRotateDire == 1)
            //    app.runDegs = app.runDegs + (-1) * angle;
            //  else
            //    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (-1) * angle;
            //}
          }
        }
      },
      _faster(e){
        var that = this;
        //console.log("faster click")
        if (that.data.block2=="block"){
          console.log("faster...")
          try {
            if (e.touches != null && e.touches.length > 0) {
              endX = Math.round(e.touches[0].pageX); endY = Math.round(e.touches[0].pageY);
              rotateDire = that.judgeRotateDirection(startX, startY, endX, endY, centerX, centerY);
            }
          } catch (err) { }

          var rotateDireText = rotateDire == 0 ? "顺时针" : "逆时针";
          console.log(rotateDireText)

          
          var awardsConfig = that.data.awardsConfig;
          var r = that.data.getGrade;
          //>>> 是无符号移位运算符
          var runNum = 8, setRTimes = that.data.fastJuedin ? that.data.slowTime : that.data.fastTime;

          try{
            if (rTimer!=null) clearTimeout(rTimer);
            rTimer = null;
          }catch(e){}

          rTimer=setTimeout(function () {
            //mid.pause(); start.pause();
            //转盘开始转动音乐
            //that.data.musicflg ? that.data.fastJuedin ? mid.play() : start.play() : '';

            //要转多少度deg
            app.runDegs = app.runDegs || 0;
            console.log("faster before:" + app.runDegs);
            if (rotateDire == 0) {
              app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (2160 - r * (360 / awardsConfig.awards.length));
            } else {
              if (lastRDire==0)
                app.runDegs = app.runDegs + (360 - app.runDegs % 360) + 2160 * (-1) + (-1) * r * (360 / awardsConfig.awards.length);
              else{
                if (app.runDegs<0)
                  app.runDegs = app.runDegs + (-1)*(360 - Math.abs(app.runDegs) % 360) + 2160 * (-1) + (-1) * r * (360 / awardsConfig.awards.length);
                else
                  app.runDegs = app.runDegs + (360 - app.runDegs % 360) + 2160 * (-1) + (-1) * r * (360 / awardsConfig.awards.length);
              }
            }

            var animation = wx.createAnimation({
              duration: setRTimes,
              timingFunction: "ease-out"
            });
            that.animation = animation;

            //这动画执行的是差值 
            //如果第一次写rotate（360） 那么第二次再写rotate（360）将不起效果
            //animation.rotate(app.runDegs).step(), 0 == r && (app.runDegs = 0);
            animation.rotate(app.runDegs).step();
            that.setData({
              animationData: animation.export(),
            })
            console.log("faster:" + r+":"+app.runDegs);
            lastRDire = rotateDire;
            that._setatZhuan(true);
          }, 100);

          clearTimeout(timer);
          timer = null;
          timer = setTimeout(function () {
            for (let x in awardsConfig.awards) {
              if (x != r) {
                awardsConfig.awards[x].opacity = '0.3';
              } else {
                awardsConfig.awards[x].opacity = '1';
              }
            }

            //转盘停止后的音乐
            !that.data.musicflg ? '' : stop.play();

            that.setData({
              animationData: {},
              s_awards: awardsConfig.awards[r].name,//最终选中的结果
              awardsConfig: awardsConfig,
              block1: 'none',
              block2: 'none',
              block3: 'block',
              tpshow: '',
              zhuanflg: false,
            })
            console.log("faster end:"+r);
            that._myAwards(false);
            that._setatZhuan(false);
          }, (setRTimes+100));
        }
        console.log("faster set timeout")
      },
     // GO转盘开始转动
     setZhuan(r) {
       var that = this;
       var awardsConfig = that.data.awardsConfig;
       if (awardsConfig == null || awardsConfig.awards.length<=0)return;
       that.data.getGrade = r;
       //>>> 是无符号移位运算符
       var runNum = 8;
       
       console.log('当前答案选项的下标==', r);
       try {
         if (rTimer != null) clearTimeout(rTimer);
         rTimer = null;
       } catch (e) { }

       rTimer =setTimeout(function () {

         //转盘开始转动音乐
         //that.data.musicflg ? that.data.fastJuedin ? mid.play() : start.play() : '';

         //要转多少度deg
         app.runDegs = app.runDegs || 0, app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (2160 - r * (360 / awardsConfig.awards.length));

         var animation = wx.createAnimation({
           duration: that.data.fastJuedin ? that.data.slowTime : that.data.fastTime,
           timingFunction: "ease"
         });
         that.animation = animation;

         //这动画执行的是差值 
         //如果第一次写rotate（360） 那么第二次再写rotate（360）将不起效果
         animation.rotate(app.runDegs).step(), 0 == r && (app.runDegs = 0);

         that.setData({
           animationData: animation.export(),
           block1: 'none',
           block2: 'block',
           block3: 'none',
           tpshow: 'shide',
           zhuanflg: true,
         })
         
         that._setatZhuan(true);
       }, 100);


       timer = setTimeout(function () {
         for (let x in awardsConfig.awards) {
           if (x != r) {
             awardsConfig.awards[x].opacity = '0.3';
           } else {
             awardsConfig.awards[x].opacity = '1';
           }
         }

         //转盘停止后的音乐
         !that.data.musicflg ? '' : stop.play();

         that.setData({
           animationData: {},
           s_awards: awardsConfig.awards[r].name,//最终选中的结果
           awardsConfig: awardsConfig,
           block1: 'none',
           block2: 'none',
           block3: 'block',
           tpshow: '',
           zhuanflg: false,
         })

         that._myAwards(false);
         that._setatZhuan(false);
       }, that.data.fastJuedin ? that.data.slowTime : that.data.fastTime);
     },
     setTopLayerShow(tag) {
       var that = this;
       var tbshowvalue ='shide';
       if (tag == 1) tbshowvalue='';
       that.setData({
         tpshow: tbshowvalue,
       })
     },

      // 开启概率 
      // 传 1-100 的数 来设置选项的权重  
      // 传入0的话就永远摇不到这个选项
      _openProbability() {
         var that = this, awards = that.data.awardsConfig.awards, arr = [];
         //5, 5, 20, 10 ,30 ,30, 0
         for (let i in awards) {
            if (awards[i].probability != 0) {
               for (var x = 0; x < awards[i].probability; x++) {
                  //把当前的概率数字 以当前选项下标的形式 都添加都空数组中，然后随机这个数组
                  arr.push(i);
               }
            }
         }
         var s = Math.floor(Math.random() * arr.length);
         return arr[s];
      },

      //不重复抽取
      //r:随机数 当前选项进行随机
      _queryRepeat(r) {
         var that = this, flag = true, repeatArr = wx.getStorageSync('repeatArr'), repeatArr2 = [], awardsConfig = that.data.awardsConfig;
         if (that.isNull(repeatArr)) {
            repeatArr2.push(r), wx.setStorageSync('repeatArr', repeatArr2);
            return r;
         } else {
            var len = awardsConfig.awards.length, r = Math.random() * len >>> 0;
            for (let i in repeatArr) {
               if (r == repeatArr[i]) {
                  flag = false;
                  if (repeatArr.length == len) {
                     wx.removeStorageSync('repeatArr');
                     repeatArr2.push(r), wx.setStorageSync('repeatArr', repeatArr2);
                     return r;
                  } else {
                     return that._queryRepeat();//递归调用
                  }
               }
            }
            if (flag) {
               repeatArr.push(r), wx.setStorageSync('repeatArr', repeatArr);
               return r;
            }
         }
      },

      //初始化数据时向外传的参
      _change() {
         this.triggerEvent('myData', this.data.awardsConfig);// 向父组件传出当前决定的数组数据
      },

      //当前转盘的结果:end——false转盘结束停止，true没结束   e:转盘什么时候能点击的标志位
      _myAwards(e) {
         this.triggerEvent('myAwards',
            {
               s_awards: this.data.s_awards, end: e
            });
      },

      //转盘开始转动或者结速转动后的要传的值
      _setatZhuan(e) {
         this.triggerEvent('startZhuan', e); // 向父组件传出当前决定的数组数据
      },

   }
})