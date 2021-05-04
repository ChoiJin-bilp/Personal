  ```
  //--------------登录注册----------------------
  //方法：（注册/登录）登录用户信息获取
  //参数说明：
  //mainObj：当前页面
  getLoginUserInfo: function (mainObj) {
    var that = mainObj,
      app = this;
    console.log("app getLoginUserInfo")
    if (app.data.isLoginCheckCacheUserId) {
      console.log("LoginCheckCacheUserId")
      var userId = 0;
      try {
        userId = parseInt(wx.getStorageSync('store_userId_' + app.data.version + '_' + app.data.wxAppId));
        userId = isNaN(userId) ? 0 : userId;
        console.log("userId：" + userId)
        if (userId > 0) {
          wx.checkSession({
            success() {
              app.regionBJYSys(mainObj, "", "", "", userId, 1);
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              app.getWeChatLoginUserInfo(that, 1);
            }
          })

          return;
        }
      } catch (e) {}
    }
    app.getWeChatLoginUserInfo(that, 1);
  },
    //事件：授权用户信息
    getAuthorizeUserInfo: function (mainObj, e) {
      var that = mainObj,
        app = this,
        nickName = "",
        avatarUrl = "";
  
      if (e.detail.userInfo != null && e.detail.userInfo != undefined) {
        nickName = e.detail.userInfo.nickName;
        avatarUrl = e.detail.userInfo.avatarUrl;
  
        wx.login({
          success: res => {
            //用户登录凭证（有效期五分钟）
            if (res.code) {
              app.data.js_code = res.code;
              app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
            }
          }
        })
  
      } else {
        wx.login({
          success: res => {
            //用户登录凭证（有效期五分钟）
            if (res.code) {
              app.data.js_code = res.code;
              app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
            }
          }
        })
      }
  
      that.setData({
        isShowAuthor: false,
      })
    },
	 //方法：注册用户
	  //参数说明：
	  //mainObj：当前页面
	  //nickName：微信授权后的昵称，可为空字符串
	  //avatarUrl：微信授权后的头像，可为空字符串
	  //code：wx.login获取到的code
	  //userId：缓存的用户ID
	  //timeTag：重试次数标记
	  regionBJYSys: function (mainObj, nickName, avatarUrl, code, userId, timeTag) {
	    var that = mainObj,
	      app = this,
	      isAuthor = false,
	      paramShareUId = 0,
	      timeOutTryCnt = app.data.timeOutTryCnt == null || app.data.timeOutTryCnt == undefined ? 1 : app.data.timeOutTryCnt
	    if (that.data.paramShareUId != null && that.data.paramShareUId != undefined) {
	      paramShareUId = that.data.paramShareUId;
	    } else if (that.data.othersUserId != null && that.data.othersUserId != undefined) {
	      paramShareUId = that.data.othersUserId;
	    }
	    paramShareUId = isNaN(paramShareUId) ? 0 : paramShareUId;
	
	    var URL = app.getUrlAndKey.url,
	      KEY = app.getUrlAndKey.key;
	    avatarUrl = Utils.myTrim(avatarUrl) == "undefined" ? "" : avatarUrl;
	    if (Utils.myTrim(nickName) != "" && Utils.myTrim(avatarUrl) != "") isAuthor = true;
	    nickName = Utils.myTrim(nickName) != "" ? Utils.filterEmoj(nickName) : nickName;
	    nickName = Utils.myTrim(nickName) != "" ? nickName : "微信用户";
	    var timestamp = Date.parse(new Date());
	    timestamp = timestamp / 1000;
	    var urlParam = "cls=main_user&action=userReg&js_code=" + code + "&appId=" + app.data.appid + "&timestamp=" + timestamp,
	      userIdParam = app.data.isLoginCheckCacheUserId && userId > 0 ? "&userId=" + userId : "";
	    var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
	    console.log('sign:' + urlParam + "&key=" + KEY)
	    urlParam = urlParam + userIdParam + "&nickName=" + encodeURIComponent(nickName) + "&avatarUrl=" + avatarUrl + "&appType=1&sourceUserId=" + paramShareUId + "&xcxAppId=" + app.data.wxAppId + "&sign=" + sign;
	    console.log(URL + urlParam)
	    console.log('~~~~~~~~~~~~~~~~~~~')
	    wx.request({
	      url: URL + urlParam,
	      success: function (res) {
	        console.log(res.data)
	        if (res.data.rspCode == 0) {
	          var userName = "",
	            userRegTime = new Date(),
	            userTel = "",
	            userMobile = "",
	            avatarUrl = "",
	            userJobPosition = "",
	            companyId = 0,
	            companyName = "",
	            companyDescribe = "",
	            companyLegal = "",
	            companyTel = "",
	            companyEmail = "",
	            companyAddress = "",
	            companyLogo = "",
	            wxopenId = "",
	            companyType = 1,
	            companyStatus = 0,
	            serviceEndTime = new Date,
	            userCVersionType = 1,
	            userRole = "",
	            userIndustry = "",
	            userFollowIndustry = "",
	            isDistributor = false,
	            roleStatus = 0,member_id=0;
	          var mainData = res.data;
	          if (mainData.data == null) return;
	
	          if (Utils.isDBNotNull(mainData.data.userMap.companyId)) {
	            companyId = parseInt(mainData.data.userMap.companyId);
	            companyId = isNaN(companyId) ? 0 : companyId;
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.member_id)) {
	            member_id = parseInt(mainData.data.userMap.member_id);
	            member_id = isNaN(member_id) ? 0 : member_id;
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.roleStatus)) {
	            roleStatus = parseInt(mainData.data.userMap.roleStatus);
	            roleStatus = isNaN(roleStatus) ? 0 : roleStatus;
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.companyType)) {
	            companyType = parseInt(mainData.data.userMap.companyType);
	            companyType = isNaN(companyType) ? 1 : companyType;
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.companyStatus)) {
	            companyStatus = parseInt(mainData.data.userMap.companyStatus);
	            companyStatus = isNaN(companyStatus) ? 0 : companyStatus;
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.serviceEndTime)) {
	            try {
	              serviceEndTime = new Date(mainData.data.userMap.serviceEndTime.replace(/\-/g, "/"));
	            } catch (e) {}
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.regTime)) {
	            try {
	              userRegTime = new Date(mainData.data.userMap.regTime.replace(/\-/g, "/"));
	            } catch (e) {}
	          }
	          if (Utils.isDBNotNull(mainData.data.userMap.wxopenId)) wxopenId = mainData.data.userMap.wxopenId;
	          if (Utils.isDBNotNull(mainData.data.userMap.contact)) userName = mainData.data.userMap.contact;
	          if (Utils.isDBNotNull(mainData.data.userMap.tel)) userTel = mainData.data.userMap.tel;
	
	          if (Utils.isDBNotNull(mainData.data.userMap.job)) userJobPosition = mainData.data.userMap.job;
	          if (Utils.isDBNotNull(mainData.data.userMap.mobile)) userMobile = mainData.data.userMap.mobile;
	          if (Utils.isDBNotNull(mainData.data.userMap.headerImg) && mainData.data.userMap.headerImg.indexOf(defaultHeadImg) < 0) avatarUrl = mainData.data.userMap.headerImg;
	          if (Utils.isDBNotNull(mainData.data.userMap.personalClass)) userRole = mainData.data.userMap.personalClass;
	          if (Utils.isDBNotNull(mainData.data.userMap.personalTrade)) userIndustry = mainData.data.userMap.personalTrade;
	          if (Utils.isDBNotNull(mainData.data.userMap.productInfo)) userFollowIndustry = mainData.data.userMap.productInfo;
	          if (Utils.isDBNotNull(mainData.data.userMap.shareUser)) {
	            isDistributor = mainData.data.userMap.shareUser;
	          }
	
	          if (Utils.isNotNull(mainData.data.companyMap)) {
	            if (Utils.isDBNotNull(mainData.data.companyMap.company)) companyName = mainData.data.companyMap.company;
	            if (Utils.isDBNotNull(mainData.data.companyMap.intro)) companyDescribe = mainData.data.companyMap.intro;
	            if (Utils.isDBNotNull(mainData.data.companyMap.legal)) companyLegal = mainData.data.companyMap.legal;
	            if (Utils.isDBNotNull(mainData.data.companyMap.tel)) companyTel = mainData.data.companyMap.tel;
	            if (Utils.isDBNotNull(mainData.data.companyMap.email)) companyEmail = mainData.data.companyMap.email;
	            if (Utils.isDBNotNull(mainData.data.companyMap.addr)) companyAddress = mainData.data.companyMap.addr;
	            if (Utils.isDBNotNull(mainData.data.companyMap.logo)) companyLogo = mainData.data.companyMap.logo;
	          }
	
	          companyId = companyId <= 0 ? app.data.companyId : companyId;
	          //userCVersionType：1个人版，2企业版
	          // if (companyType == 2 && (companyStatus == 1 || companyStatus == 7))
	          //   userCVersionType = 2;
	
	          var time = Date.parse(new Date()) / 1000;
	          var userData = mainData.data.userMap;
	          var companyUserMap = mainData.data.companyUserMap;
	          var serviceEndTime = userData.serviceEndTime;
	          if (!Utils.isNull(serviceEndTime)) {
	            serviceEndTime = String(serviceEndTime.replace(/-/g, '/'));
	            serviceEndTime = Date.parse(serviceEndTime) / 1000;
	            if (userData.companyType == 2 && userData.companyStatus == 1 && serviceEndTime >= time) { //判断是否企业版
	              userCVersionType = 2;
	              userData.companyType = 2;
	            } else {
	              userCVersionType = 1;
	              userData.companyType = 1;
	            }
	          }
	          app.globalData.userTotalInfo = userData; //存入用户完整信息;
	          app.globalData.companyUserMap = companyUserMap; //存入用户完整信息;
	
	          var userinfo = {
	            userId: mainData.data.userMap.id,
	            userName: userName,
	            roleStatus: roleStatus,
	            wxopenId: wxopenId,
	            avatarUrl: app.getSysImgUrl(avatarUrl),
	            userJobPosition: userJobPosition,
	            userMobile: userMobile,
	            userPhone: userTel,
	            userRegTime: userRegTime,
	            serviceEndTime: serviceEndTime,
	            userCVersionType: userCVersionType,
	            userRole: userRole,
	            userIndustry: userIndustry,
	            userFollowIndustry: userFollowIndustry,
	
	            companyId: companyId,
	            companyName: companyName,
	            companyAddress: companyAddress,
	            companyDescribe: companyDescribe,
	            companyLegal: companyLegal,
	            companyTel: companyTel,
	            companyEmail: companyEmail,
	            companyLogo: app.getSysImgUrl(companyLogo),
	            companyType: companyType,
	            companyStatus: companyStatus,
	            isDistributor: isDistributor,member_id:member_id,member_sort:0,member_name:"",
	          }
	          wx.setStorageSync('userNickName' + app.data.currentVersion, userinfo.userName)
	          console.log("设置缓存“userNickName" + app.data.currentVersion + "”=" + userinfo.userName);
	          console.log("获取缓存“userNickName" + app.data.currentVersion + "”=" + wx.getStorageSync('userNickName' + app.data.currentVersion));
	          wx.setStorageSync('userinfo' + app.data.currentVersion, userinfo);
	          if (app.data.isLoginCheckCacheUserId) {
	            try {
	              wx.setStorageSync('store_userId_' + app.data.version + '_' + app.data.wxAppId, userinfo.userId);
	            } catch (e) {}
	          }
	          app.globalData.muserInfo = userinfo;
	          app.globalData.userInfo = userinfo;
	
	          if (mainData.data.companyUserMap != null && mainData.data.companyUserMap != undefined) {
	            var cuMainData = mainData.data.companyUserMap,
	              cuCompanyId = 0,
	              cuUserId = 0,
	              cuCompanyUserId = 0,
	              cuId = 0,
	              cuStatus = 0,
	              cuUserType = 0;
	            var cuObj = null,
	              cuObjList = [];
	            cuId = cuMainData.id;
	            if (cuMainData.companyId != null && cuMainData.companyId != undefined && Utils.myTrim(cuMainData.companyId + "") != "")
	              cuCompanyId = parseInt(cuMainData.companyId);
	            cuCompanyId = isNaN(cuCompanyId) ? 0 : cuCompanyId;
	            if (cuMainData.userId != null && cuMainData.userId != undefined && Utils.myTrim(cuMainData.userId + "") != "")
	              cuUserId = parseInt(cuMainData.userId);
	            cuUserId = isNaN(cuUserId) ? 0 : cuUserId;
	            if (cuMainData.companyUserId != null && cuMainData.companyUserId != undefined && Utils.myTrim(cuMainData.companyUserId + "") != "")
	              cuCompanyUserId = parseInt(cuMainData.companyUserId);
	            cuCompanyUserId = isNaN(cuCompanyUserId) ? 0 : cuCompanyUserId;
	            if (cuMainData.userType != null && cuMainData.userType != undefined && Utils.myTrim(cuMainData.userType + "") != "")
	              cuUserType = parseInt(cuMainData.userType);
	            cuUserType = isNaN(cuUserType) ? 0 : cuUserType;
	            if (cuMainData.status != null && cuMainData.status != undefined && Utils.myTrim(cuMainData.status + "") != "")
	              cuStatus = parseInt(cuMainData.status);
	            cuStatus = isNaN(cuStatus) ? 0 : cuStatus;
	            cuObj = {
	              id: cuId,
	              userId: cuUserId,
	              companyId: cuCompanyId,
	              companyUserId: cuCompanyUserId,
	              userType: cuUserType,
	              status: cuStatus
	            }
	
	            cuObjList.push(cuObj)
	            wx.setStorageSync('companyuserinfo' + app.data.currentVersion, cuObjList);
	            app.globalData.companyUsers = cuObjList;
	          }
	
	          console.log("登录用户信息获取：成功！")
	          console.log(userinfo);
	          //登记用户系统相关信息
	          app.getUserSysInfo(null, userinfo.userId);
	          
	          //判断是否为小程序首页，如果为小程序首页则直接跳转页面；否则先获取公司信息再跳转首页
	          if (that.data.checkPageName != null && that.data.checkPageName != undefined && Utils.myTrim(that.data.checkPageName) == "siteindex"){
	            //获取缓存的平台账户信息
	            app.getSysUserAccountInfo();
	            that.dowithAppRegLogin(1);
	          }else{
	            app.getMainCompanyDataInfo(mainObj);
	          }
	          //检查是否进行拼团抽奖操作
	          if(app.data.isOpenGWPrize){
	            let otherGWParam="&userId="+userinfo.userId +"&xcxAppId="+app.data.wxAppId;
	            app.setGWPrizeResult(that,otherGWParam);
	          }
	        } else if (res.data.rspCode == -100) {
	          console.log("regionBJYSys 用户不存在！！！")
	          app.getWeChatLoginUserInfo(that, 1);
	        } else {
	          wx.showToast({
	            title: res.data.rspMsg,
	            icon: 'none',
	            duration: 2000
	          })
	          app.setErrorMsg2(that, "登录用户信息获取：失败！错误信息：" + JSON.stringify(res), URL + urlParam, false);
	          if (timeTag <= timeOutTryCnt) {
	            timeTag = timeTag + 1;
	            app.regionBJYSys(mainObj, nickName, avatarUrl, code, userId, timeTag);
	          } else {
	            that.dowithAppRegLogin(0);
	          }
	        }
	      },
	      fail: function (err) {
	        wx.showToast({
	          title: "登录用户信息接口调用失败！",
	          icon: 'none',
	          duration: 2000
	        })
	        app.setErrorMsg2(that, "登录用户信息获取接口调用失败：出错：" + JSON.stringify(err), URL + urlParam, false);
	        if (timeTag <= timeOutTryCnt) {
	          timeTag = timeTag + 1;
	          app.regionBJYSys(mainObj, nickName, avatarUrl, code, userId, timeTag);
	        } else {
	          that.dowithAppRegLogin(0);
	        }
	      }
	    })
	  },
	    //方法：（注册/登录）登录用户信息获取
	    //参数说明：
	    //mainObj：当前页面
	    //timeTag：重试次数标记
	    getWeChatLoginUserInfo: function (mainObj, timeTag) {
	      var that = mainObj,
	        app = this,
	        timeOutTryCnt = app.data.timeOutTryCnt == null || app.data.timeOutTryCnt == undefined ? 1 : app.data.timeOutTryCnt;
	      console.log("app getWeChatLoginUserInfo")
	      console.log("通过微信登录。。。。。。")
	      try {
	        if (app.data.isSetNickName) {
	          console.log("Login without check authorization!...")
	          wx.login({
	            success: res => {
	              //用户登录凭证（有效期五分钟）
	              if (res.code) {
	                app.regionBJYSys(mainObj, "", "", res.code, 0, 1);
	              }
	            },
	            fail: function (err) {
	              console.log(err);
	              wx.showToast({
	                title: "wx.login调用失败！",
	                icon: 'none',
	                duration: 2000
	              })
	              app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
	              if (timeTag <= timeOutTryCnt) {
	                timeTag = timeTag + 1;
	                app.getWeChatLoginUserInfo(that, timeTag);
	              }
	            }
	          })
	        } else {
	          console.log("Login and check authorization!...")
	          wx.getSetting({
	            success(res0) {
	              console.log(res0.authSetting)
	              if (res0.authSetting["scope.userInfo"]) {
	                console.log("已经授权！！！")
	                wx.login({
	                  success: res => {
	                    //用户登录凭证（有效期五分钟）
	                    console.log("已经login")
	                    if (res.code) {
	                      wx.getUserInfo({
	                        success: function (res1) {
	                          console.log("getUserInfo成功！")
	                          var nickName = "",
	                            avatarUrl = "";
	                          console.log(res1);
	                          if (res1.userInfo != null && res1.userInfo != undefined) {
	                            nickName = res1.userInfo.nickName != null && res1.userInfo.nickName != undefined ? res1.userInfo.nickName : "";
	                            avatarUrl = res1.userInfo.avatarUrl != null && res1.userInfo.avatarUrl != undefined ? res1.userInfo.avatarUrl : "";
	                          }
	                          app.regionBJYSys(mainObj, nickName, avatarUrl, res.code, 0, 1);
	                        },
	                        fail: function (err) {
	                          console.log('获取用户信息失败')
	                          wx.showToast({
	                            title: "获取用户信息失败！",
	                            icon: 'none',
	                            duration: 2500
	                          })
	                          app.setErrorMsg2(that, "wx.getUserInfo失败：出错：" + JSON.stringify(err), "", false);
	                        }
	                      })
	                    }
	                  },
	                  fail: function (err) {
	                    console.log(err);
	                    wx.showToast({
	                      title: "wx.login调用失败！",
	                      icon: 'none',
	                      duration: 2000
	                    })
	                    app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
	                    if (timeTag <= timeOutTryCnt) {
	                      timeTag = timeTag + 1;
	                      app.getWeChatLoginUserInfo(that, timeTag);
	                    }
	                  }
	                })
	              } else {
	                console.log("尚未授权！！！");
	                //1、根据审核要求——登录去掉授权
	                // try {
	                //   that.dowithAppRegLogin(0);
	                // } catch (err) { }
	  
	                //2、根据审核要求——不授权也可以直接登录
	                wx.login({
	                  success: res => {
	                    //用户登录凭证（有效期五分钟）
	                    if (res.code) {
	                      app.regionBJYSys(mainObj, "", "", res.code, 0, 1);
	                    }
	                  },
	                  fail: function (err) {
	                    console.log(err);
	                    wx.showToast({
	                      title: "wx.login调用失败！",
	                      icon: 'none',
	                      duration: 2000
	                    })
	                    app.setErrorMsg2(that, "wx.login失败：出错：" + JSON.stringify(err), "", false);
	                    if (timeTag <= timeOutTryCnt) {
	                      timeTag = timeTag + 1;
	                      app.getWeChatLoginUserInfo(that, timeTag);
	                    }
	                  }
	                })
	              }
	            },
	            fail: function (err) {
	              console.log(err);
	              wx.showToast({
	                title: "wx.getSetting调用失败！",
	                icon: 'none',
	                duration: 2000
	              })
	              app.setErrorMsg2(that, "wx.getSetting失败：出错：" + JSON.stringify(err), "", false);
	              if (timeTag <= timeOutTryCnt) {
	                timeTag = timeTag + 1;
	                app.getWeChatLoginUserInfo(that, timeTag);
	              }
	            }
	          })
	        }
	      } catch (e) {
	        app.setErrorMsg2(that, "app.getWeChatLoginUserInfo失败：出错：" + JSON.stringify(e), "", false);
	        if (timeTag <= timeOutTryCnt) {
	          timeTag = timeTag + 1;
	          app.getWeChatLoginUserInfo(that, timeTag);
	        }
	      }
	    },
		  //事件：取消注册
		  cancelRegAuthorization: function (mainObj) {
		    var that = mainObj,
		      app = this;
		
		    wx.showModal({
		      title: '系统消息',
		      content: "您确定取消授权吗？",
		      icon: 'none',
		      duration: 1500,
		      success: function (res) {
		        if (res.cancel) {
		          //点击取消,默认隐藏弹框
		          console.log("授权取消 cancel")
		          return;
		        } else {
		          //点击确定
		          console.log("授权取消 sure")
		          var nickName = "",
		            avatarUrl = "";
		          wx.login({
		            success: res => {
		              //用户登录凭证（有效期五分钟）
		              if (res.code) {
		                app.data.js_code = res.code;
		                app.regionBJYSys(that, nickName, avatarUrl, app.data.js_code, 0, 1);
		                that.setData({
		                  isShowAuthor: false,
		                })
		              }
		            }
		          })
		        }
		      },
		    })
		  },
  ```