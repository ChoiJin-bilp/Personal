<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">
				<img src="https://www.jvhv.com/wap/static/images/footer_1_red.png" />
				<div>首页</div>
			</router-link>-->
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 不可以被缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <aplayer
      ref="player"
      style="position: fixed"
      :music="videoUpload.music"
      class="qwoerty"
    ></aplayer>
    <aplayer
      ref="player2"
      style="position: fixed"
      :music="videoUpload2.music"
      class="qwoerty"
    ></aplayer>
  </div>
</template>

<script scoped>
import Utils from "./utils/util.js";
import MD5JS from "./utils/md5.js";
import axios from "axios";
import aplayer from "vue-aplayer";
import { Message } from "element-ui";
export default {
  name: "homeDragbtn",
  props: {},
  components: {
    aplayer,
  },
  data() {
    return {
      videoUpload: {
        progress: false,
        progressPercent: 0,
        successPercent: 0,
        music: {
          title: "你好",
          author: "林俊杰",
          // url: '../music/ykOrder.mp3',
          url: "https://bjy.51yunkeyi.com/baojiayou/media/ykOrder.mp3",
          lrc: "",
        },
      },
      videoUpload2: {
        progress: false,
        progressPercent: 0,
        successPercent: 0,
        music: {
          title: "撒的撒的",
          author: "啊实打实大",
          // url: '../music/ykOrder.mp3',
          url: "https://bjy.51yunkeyi.com/baojiayou/media/call.mp3",
          lrc: "",
        },
      },
      flag: "",
      //倒计时时间
      overtime: "",
      currentVersionType: "A", //接口版本类型：A A套接口；B B套接口
      version: "devtest", // devtest 开发测试版本，online 线上版本
      path: "ws://192.168.1.23:80/websocket",
      socket: "",
    };
  },
  mounted() {
    var that = this;
    var overtime = 3000;
    var overtime2 = 10000;
    that.overtime = overtime;
    that.overtime2 = overtime2;
    setInterval(function () {
      that.queryOrderDetail();
    }, overtime);
    //顾客呼叫
    setInterval(function () {
      that.queryOrderDetail2();
    }, overtime2);
    //设置公告变量
    that.beforeUpload();
    //设置收银机型号
    that.getSet();
    this.init();
  },

  methods: {
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function () {
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      console.log(msg.data);
    },
    // send: function () {
    //   this.socket.send("B202104290004/print");
    // },
    // send2: function () {
    //   this.socket.send("B202104290004/pay");
    // },
    close: function () {
      console.log("socket已经关闭");
    },
    //设置机子型号
    getSet() {
      var integrityurl = window.location.href;
      // var integrityurl = "http://192.1.1.1:1111/test.html?cashId=yk001&b=2&c=3&d=4";
      var that = this;
      var arr = that.getUrlArr(integrityurl);
      var cashId;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].cashId) {
          var cashId = arr[i].cashId;
          if (cashId.indexOf("#") != -1) {
            cashId = cashId.split("#")[0];
          }
        }
      }
      if (!cashId) {
        cashId = "yk001";
      }
      that.$store.dispatch("ShouYin", cashId);
    },
    //获取当前url数组
    getUrlArr(url) {
      var arr = [];
      var url = url;
      if (url.indexOf("?") == -1) {
        return arr;
      }
      var str = url.split("?")[1];
      var arr1 = str.split("&");
      for (var i = 0; i < arr1.length; i++) {
        var value = arr1[i].split("=")[1];
        var name = arr1[i].split("=")[0];
        arr.push({ [name]: value });
      }
      return arr;
    },
    beforeUpload() {
      var that = this,
        currentVersionType = that.currentVersionType,
        version = that.version;
      //接口版本类型：A A套接口；B B套接口
      that.$store.dispatch("toggleTao", currentVersionType);
      // 开发测试版本， 线上版本
      that.$store.dispatch("toggleSmurl", version);
    },
    // 添加PC、移动
    isMobile() {
      this.flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      console.log(this.flag);
      if (this.flag === null) {
        console.log("pc端");
        this.rightNavShow = true;
      } else {
        console.log("移动端");
        this.rightNavShow = false;
      }
    },
    queryOrderDetail: function () {
      var that = this;
      if (that.$store.getters.sidebar.userId == "") {
        return;
      }
      var overtime = that.overtime;
      var URL =
        this.$store.getters.sidebar.smurl +
        that.$store.getters.sidebar.smallInterfacePart;
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var KEY = this.$store.getters.sidebar.KEY;
      var urlParam =
        "cls=product_order&action=QueryOrdersNew&appId=1" +
        "&timestamp=" +
        timestamp;
      // console.log('sign:', urlParam + "&key=" + KEY)
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      // 订单状态 订单状态0:未支付1:待发货（已购买）2:已完成 3:已取消 4:退货5:团购中6待收货7团购失败 12已支付定金
      var status = "1,2";
      // 一般0,兑换1,领取2,团购3预售4软件定制5软件代理6酒店7,饮品8
      var linkNo = "8,9,11";

      //搜索时间段
      var NowTime = Utils.getDateTimeStr(
        new Date(new Date() - overtime),
        "-",
        1
      );
      var NowTime2 = Utils.getDateTimeStr(new Date(), "-", 1);
      //根据时间搜索
      urlParam =
        urlParam +
        "&status=" +
        status +
        "&sOrder=desc" +
        "&startDate=" +
        NowTime +
        "&endDate=" +
        NowTime2 +
        "&sign=" +
        sign;
      urlParam =
        urlParam + "&companyId=" + that.$store.getters.sidebar.CompanyId;
      // console.log('查询订单详情:', URL + urlParam);
      axios.get(URL + urlParam).then((res) => {
        // console.log('查询订单:', res.data.list)
        if (res.data.rspCode == 0) {
          var poty = res.data.list;
          var setGWOrderItemPosition = function () {
            var aplayer = that.$refs.player;
            aplayer.play();
            // that.$message({
            //   type: "success",
            //   message: "您有新的订单",
            // });
          };
          if (poty.length > 0) {
            var k = 0;
            var satTime = 3000;
            // var internalPlayAn = setInterval(function() {
            // 	if (k >= poty.length) {
            // 		clearInterval(internalPlayAn)
            // 	} else {
            // 		setGWOrderItemPosition(k)
            // 	}
            // 	k++;
            // }, satTime)
            setGWOrderItemPosition();
            this.socket.send(poty[0].sn + "/pay");
            return;
          } else {
            return;
          }
        }
      });
    },
    plshdyplay() {
      var that = this;
      var aplayer = that.$refs.player2;
      aplayer.play();
    },
    //获取数据信息
    queryOrderDetail2: function () {
      var that = this;
      var srvDevTest = that.$store.getters.sidebar.smurl,
        interfacePart = that.$store.getters.sidebar.interfacePart,
        smallInterfacePart = that.$store.getters.sidebar.smallInterfacePart;
      var overtime2 = that.overtime2;
      var URL = srvDevTest + smallInterfacePart;
      var appId = that.$store.getters.sidebar.appId;
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var KEY = that.$store.getters.sidebar.KEY;
      //搜索时间段
      var NowTime = Utils.getDateTimeStr(
        new Date(new Date() - overtime2),
        "-",
        1
      );
      var NowTime2 = Utils.getDateTimeStr(new Date(), "-", 1);
      var urlParam =
        "cls=product_custservice&action=QueryService&appId=" +
        appId +
        "&timestamp=" +
        timestamp +
        "&userId=";
      var sign = MD5JS.hexMD5(urlParam + "&key=" + KEY);
      urlParam =
        urlParam +
        "&startDate=" +
        NowTime +
        "&endDate=" +
        NowTime2 +
        "&sign=" +
        sign +
        "&mold=3";
      // console.log('查询订单详情:', URL + urlParam)
      axios
        .get(URL + urlParam)
        .then((res) => {
          // console.log(res.data)
          if (res.data.rspCode == 0) {
            var data = res.data.data;
            if (data.length > 0) {
              that.plshdyplay();
              that.$message({
                type: "success",
                message: "您有新的呼叫",
              });
            }
          } else {
            that.$message({
              type: "info",
              message: res.data.rspMsg,
            });
          }
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "网络错误！",
          });
        });
    },
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },
};
</script>

<style lang="scss">
/*reset*/
* {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
}

ul,
li {
  list-style: none;
}

body {
}

.link:hover {
  cursor: pointer;
}

/*lang="scss"  使用 scss的css预编译操作*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.qwoerty {
  position: fixed;
  height: 0;
  bottom: -99999px;
}
#nav {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  padding-top: 3px;
  background: #fff;

  a {
    color: #000;

    img {
      width: 27px;
      height: 27px;
    }

    &.router-link-exact-active {
      color: rgb(0, 91, 172);
    }
  }
}
</style>
