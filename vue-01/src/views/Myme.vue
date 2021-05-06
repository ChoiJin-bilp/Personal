<template>
	<div>
		<div class="titlederss">
					<div class="notice">
						<a @click="change()">公告：</a>单笔满十杯，送一杯，详情请见订购须知。</div>
				</div>
				<div class="mainContent">
					<div class="sortlist">
						<div v-for="(item,index) in selProcuctTypeListont" :key="index" :class="index == item.type ?'listpitch':''" 
						@click.stop="selectCatalog(index)"
						>{{item.name}}</div>
					</div>
					<div class="drinkitem" id="list">
						<!--显示主题循环-->
						<div class="tea" v-for="(item,index) in dataArray" :key="index"  @click="onchangedetailType(index)">
							<div class="tea-image">
								<img class="milktea" :src="item.photo"></img>
								<!-- <div class="tally">热卖</div> -->
							</div>
							<div class="tea-item">
								<div class="teaname">{{item.productName}}</div>
								<div class="teaintroduce">{{item.remark}}</div>
								<div class="teaprice">￥{{item.minprice}}</div>
								<div class="count">
								          <template v-if="item.num>0">
								            <div class="adelnum" @click.stop="changeCut(index)" :index="index"></div>
								            <div class="ufo">{{item.num}}</div>
								          </template>
								          <template v-else>
								            <div></div>
								          </template>
									<div class="addnum" @click.stop="addProcuctnum(index)" :index="index"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tomcar">
					<div class="caricon">
						<div class="cariconab">
							<!-- <block wx:if="{{true}}"> -->
							<div class="cariconre selectback" @click.stop="onChagejudgment()">
								<img :src="DataURL+'/images/amy-shopwhite.png'"></image>
								<div class="thingnum">{{shoppingCartCnt}}</div>
							</div>
							<!--      </block>
		      <block wx:else>
		        <div class="cariconre ">
		          <img src="../images/amy-shop.png"></image>
		        </div>
		      </block> -->
						</div>
					</div>
					<div class="close">
						<div class="close-price">￥
							<a>{{shoppingCartAmount}}</a>
						</div>
						<router-link class="close-botton selectbut" to="/amited">去结算</router-link>
						<!-- <div class="close-botton selectbut">去结算</div> -->
						<!--    <block wx:elif='{{false}}'>
		      <div class="close-botton">去结算</div>
		    </block>
		    <block wx:else>
		      <div class="close-botton">休息中</div>
		    </block> -->
					</div>
				</div>
				<!--弹窗阴影-->
				<div class="windowBackgroud" v-if="judgment||detailType||chilType" @click="emptyType()"></div>
		
		
				<!---购买时调整数量弹窗-->
				<div  :class="judgment?'windowitem windowout':'windowitem '">
					<div class="milktop">
						<div>已选商品</div>
						<div class="milktop-Second"  @click.stop="clearShopCar()">
							<img :src="DataURL+'/images/amy-alittledrinkdel.png'" ></image>
							清空
						</div>
					</div>
					<div class="sroll" id="sroll">
						<div class="itemdetil" v-for="(item,index) in shopCarList" :key="index">
							<div class="detilcont">
								<div>{{item.productName}}</div>
								<div>已选：{{item.showLabels}}</div>
							</div>
							<div class="detilprice">
								<a>￥</a>{{item.amount}}
							</div>
							<div class="totalNum">
								<div class="adelnum" @click.stop="changeDrinkNum(1,index)"></div>
								<div class="ufo">{{item.num}}</div>
								<div class="addnum" @click.stop="changeDrinkNum(0,index)"></div>
							</div>
						</div>
					</div>
				</div>
		
				<!--饮品介绍弹窗-->
				<div :class="detailType?'commoditydetail commoditydetailout':'commoditydetail'">
					<template v-if="peilList">
					<div style="max-height:940rpx;position:relative;">
						<!---->
						<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3203743992,596634908&fm=26&gp=0.jpg"></image>
						<div class="commod">
							<div class="commodityName">{{peilList.productName}}</div>
							<div class="hendusk">
								<div class="henduskprice">￥
									<a>{{peilList.minprice}}</a>
								</div>
								<div class="addnum"></div>
							</div>
							<div class="taste">{{peilList.remark}}</div>
						</div>
						<div class="podelete" @click.stop="deletetypey()">
							<div class="delete" ></div>
						</div>
					</div>
					</template>
				</div>
		
				<!--选择杯型/冰度/糖度/配料弹窗-->
				<div :class="chilType?'burdening burdeningout':'burdening'" >
					<template v-if="peilList">
					<div style="position: relative;">
							<div class="ningOne">
									<img :src="peilList.photo"></img>
									<div class="Onejieshao">
										<div>{{peilList.productName}}</div>
										<div>{{peilList.showSelectLabels}}</div>
										<div>￥
											<div class="test">{{peilList.sumprice}}</div>
										</div>
									</div>
							</div>
						</div>
						<div class="secondSelect" v-for="(item,index) in peilList.detail" :key="index">
							<div class="typeTitle">{{item.attributeOne}}</div>
							<div class="selectCup">
							<div v-for="(labelitem,id) in item.labels" :key="id">
									<div @click.stop="labelitem.available>0?selectProductLabels(index,id):''"
									:class="labelitem.checked? 'seucces selectSucces':'seucces'" >{{labelitem.lblname}}
										<a v-if="labelitem.lblsingle==0">￥{{labelitem.lblprice}}</a>
										<div v-if="labelitem.available==0" class="pomilk"></div>
									</div>
							</div>
							</div>
						</div>
						<div class="butTure" @click.stop="selectOK()">选好了</div>
						<div class="poete" @click.stop="deletetype()">
							<div class="ete"></div>
						</div>
						</template>
					</div>
			</div>
	</div>
</template>

<script scoped>
	//引入vuex
	import {mapGetters} from 'vuex';
	//引入element-ui message方法
	import { Message } from 'element-ui';
	import {fetchProductList} from '@/api/product.js';
	import Utils from '../utils/util.js';
	import {doGetData,getShoppingCartData,getProductTypeList,dowithGetProductTypeList} from "../utils/axaj.js"
	import axios from 'axios';
	//引入轮播图
	import Swiper from 'swiper';
	//引入轮播的样式
	import "swiper/dist/css/swiper.min.css";
	export default{
	name:'Myme',
	data(){
		return {
			top5:[],
			swiperList:[],
			iconTextList:[],
			    DataURL: 'https://e.amjhome.com/baojiayou/tts_upload',
			    SMDataURL: 'https://bjy.51yunkeyi.com/baojiayou/tts_upload',
			    randomNum: Math.random() / 9999,
			    selProcuctTypeList: [],
			    selProductTypeIndex: 0,
			    //是否开放商户平台
			    isOpenMerchantPlatform: false,
			    // 店内饮品商品 方便兼容以前下单页面
			    isShop: true,
			    currentPage: 1,
			    selectProductIndex: 0,
			    dataArray: [],
			    // 临时缓存数组
			    tempDataArray: [],
			    //购物车数量
			    shoppingCartCnt: 0,
			    shoppingCartAmount: 0,
			    // 购物车的商品列表
			    shopCarList: [],
			    isReData: true,
				//配料数据列表
				
				//是否开放商户平台
				isOpenMerchantPlatform: false,
				//选择杯型/冰度/糖度/配料弹窗
				chilType:false,
				//饮品介绍弹窗
				detailType:false,
				//购买时调整数量弹窗
				judgment:false
		}
	},
	mounted:function(){
		// fetchProductList().then(res=>{
		// 	console.log(res);
		// })
		// //创建swiper对象
		var swiper = new Swiper('.swiper-container',{
			loop:true,
			autoplay:2000,//自动轮播切换图的速度
			speed:1000,
			observer:true,//配置swiper兼容异步操作
			observerParents:true,//配置swiper兼容异步操作
			pagination: '.swiper-pagination',
			paginationClickable: true
		});
		this.getShopCar()
		var that = this
		if (that.isReData) {
		      that.isReData = false
		      that.ShoppingCartData()
		
		      setTimeout(function () {
		        // 提交订单后 刷新数据 把界面数字清0
		        let dataArray = that.dataArray
		        let shoppingCartCnt = that.shoppingCartCnt
		        if (dataArray.length > 0 && shoppingCartCnt == 0) {
		          that.setProductNumData(that, 0)
		        }
		      }, 1500)
		    }
	},
	computed:{
		peilList:function(){
			return this.dataArray[this.selectProductIndex];
		},
		selProcuctTypeListont:function(){
			console.log(this.selProductTypeIndex)
			for(let i=0;i<this.selProcuctTypeList.length;i++){
				this.selProcuctTypeList[i].type = null
				if(this.selProductTypeIndex==i){
					this.selProcuctTypeList[i].type =this.selProductTypeIndex
				}
			}
			return this.selProcuctTypeList;
			},

	},

	methods:{
		change(){
			console.log(this.$store.getters.sidebar)
		},
		    onchangedetailType(e) {
		      var index = e;
		      this.detailType= !this.detailType;
		        this.selectProductIndex=index
		    },
			  addProcuctnum(e) {
			    var index = e
			    this.chilType= !this.chilType;
			    this.selectProductIndex= index;
			    this.detailType= false;
			  },
		emptyType(){
			this.chilType=false;
			//饮品介绍弹窗
			this.detailType=false;
			//购买时调整数量弹窗
			this.judgment=false;
		},
		deletetype(){
			this.chilType =false;
		},
		deletetypey(){
			this.detailType =false;
		},
		selectCatalog: function (e) {
		  var index = e
		  this.sCatalog(index)
		},
		  sCatalog: function (i) {
		    var that = this,
		      index = 0,
		      selProcuctTypeList = that.selProcuctTypeList
		    try {
		      index = parseInt(i);
		      index = isNaN(index) ? 0 : index;
		    } catch (err) {}
		    if (selProcuctTypeList != null && selProcuctTypeList != undefined && selProcuctTypeList.length > 0 && selProcuctTypeList[index] != null && selProcuctTypeList[index] != undefined) {
		      that.selProductTypeIndex= index,
		      that.loadInitData();
		    }
		  },
		  //清空购物车
		    clearShopCar() {
		      var that = this
		      var shopCarList = that.shopCarList
		      if (shopCarList.length == 0) {
		        // wx.showToast({
		        //   title: "购物车是空的",
		        //   icon: 'none',
		        //   duration: 2000
		        // })
				console.log("购物车是空的");
		        return
		      }
			  var shopCarId = []
			  for (let i = 0; i < shopCarList.length; i++) {
			    const shopCar = shopCarList[i];
			    shopCarId = shopCarId.concat(shopCar.id)
			  }
			  that.deleteShopCarProduct(shopCarId.join(","))
		      // wx.showModal({
		      //   title: '提示',
		      //   confirmText: '确定',
		      //   content: '确定清空购物车?',
		      //   success(res) {
		      //     if (res.confirm) {
		      //       var shopCarId = []
		      //       for (let i = 0; i < shopCarList.length; i++) {
		      //         const shopCar = shopCarList[i];
		      //         shopCarId = shopCarId.concat(shopCar.id)
		      //       }
		      //       that.deleteShopCarProduct(shopCarId.join(","))
		      //     } else if (res.cancel) {}
		      //   }
		      // })
		    },
		selectOK() {
		    var that = this
		    var dataArray = that.dataArray
		    var data = dataArray[that.selectProductIndex]
		
		    // 所选中的LabelId
		    var labelIdList = []
		    // var detailIdList = []
		
		    var details = data.detail
		    for (let i = 0; i < details.length; i++) {
		      const detail = details[i];
		      var labels = detail.labels
		      // 判断每个分类有没有选中一个的
		      var isHaveSelect = false
		      // 是否默认选中了 单选默认选中 多选不需要
		      let isSelect = false
		      for (let i = 0; i < labels.length; i++) {
		        const label = labels[i];
		        if (label.checked) {
		          labelIdList = labelIdList.concat(label.id)
		          // detailIdList = detailIdList.concat(label.detailId)
		          isHaveSelect = true
		          label.num++
		        }
		        // 多选可以不用选
		        if (label.lblsingle == 0) {
		          isHaveSelect = true
		        }
		        // 加入购物车后恢复默认选中 有货 单选默认选中
		        if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
		          label.checked = true
		          isSelect = true
		        } else {
		          // 多选不需要默认选中
		          label.checked = false
		        }
		      }
		      if (!isHaveSelect) {
		        // wx.showToast({
		        //   title: "商品规格不完整",
		        //   icon: 'none',
		        //   duration: 2000
		        // })
				console.log("商品规格不完整")
		        return;
		      }
		    }
		    data.num++
		    console.log("加入后购物车", dataArray)
		    that.tempDataArray = dataArray
		    var detailLabelId = labelIdList.join(",")
		    // var productDetailId = detailIdList.join(",")
		    that.addShopCar(detailLabelId, 0, 1)
		  },
		    /**
		     * 移除购物车中的商品 
		     */
		    deleteShopCarProduct(ids) {
		      var userId = this.$store.getters.sidebar.userId
		      let signParam = 'cls=product_shopCar&action=deleteShopCarProduct&ids=' + ids + "&userId=" + userId
			  var srvDevTest = this.$store.getters.sidebar.smurl; //测试接口域名地址
			  var smallInterfacePart ="/baojiayou/mall.jsp?";
			  var smurl = srvDevTest+smallInterfacePart;
		      doGetData(this,smurl, signParam, "", 6, "移除购物车中的商品")
		    },
  selectProductLabels(index,id) {
    var that = this;
    var dataArray = that.dataArray;
    var index = index;
    var labelindex = id;
    var data = dataArray[that.selectProductIndex]
    var labels = data.detail[index].labels
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      // 0多选 1单选
      if (label.lblsingle == 1) {
        if (i == labelindex) {
           label.checked = true;
        } else {
          label.checked = false;
        }
      }
      // 多选 
      else {
        if (i == labelindex) {
          label.checked = !label.checked
          break
        }
      }
    }

    // 弹窗显示选择的最终价格
    var sumprice = 0
    // 显示选择了哪些规格
    var showSelectLabelList = []
    var details = data.detail
    // 重新汇总所选择的商品规格
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.checked) {
          sumprice = sumprice + label.lblprice
          showSelectLabelList = showSelectLabelList.concat(label.lblname)
        }
      }
    }

    data.sumprice = sumprice.toFixed(2)
    data.showSelectLabels = showSelectLabelList.join("/")

    that.dataArray = dataArray;
  },
  onChagejudgment() {
    this.judgment= !this.judgment
    if (this.judgment) {
      this.getShopCar()
    }
  },
		    getShopCar() {
		      // var userId = appUserInfo.userId
			  //用户id
		      var userId = this.$store.getters.sidebar.userId
			  //公司id
			  var agentCompanyId = "746"
		      let signParam = 'cls=product_shopCar&action=userShopCar&userId=' + userId;
		      var otherParam = "&pageIndex=1&pageSize=99&shopType=3&companyId=" + agentCompanyId;
				var srvDevTest = this.$store.getters.sidebar.smurl; //测试接口域名地址
				var smallInterfacePart ="/baojiayou/mall.jsp?";
				var smurl = srvDevTest+smallInterfacePart;
			  doGetData(this, smurl, signParam, otherParam, 5, "用戶购物车列表")
		    },
			  getRuslt: function (data, code, error, tag) {
			    let that = this;
			    switch (code) {
			      case 1:
			        console.log(data)
			        var content = ""
			        switch (tag) {
			          case 0:
			            this.setProductList(data)
			            break
			          case 1:
			            content = "加入购物车成功"
			            that.chilType = false,
			            that.dataArray= that.tempDataArray,
			            that.ShoppingCartData()
			            break
			          case 2:
			            that.dataArray = that.tempDataArray,
			            that.ShoppingCartData()
			            break
			          case 3:
			            that.dataArray= that.tempDataArray,
			            that.ShoppingCartData()
			            that.getShopCar()
			            break
			          case 4:
			            break
			          case 5:
			            that.dealData5(data)
			            if (that.selProcuctTypeList.length == 0) {
			              that.ProductTypeList()
			            }
			            break
			          case 6:
			            content = "清空购物车成功"
			            that.dealData6()
			            break
			        }
			        if (!Utils.isNull(content)) {
			          // wx.showToast({
			          //   title: content,
			          //   icon: 'none',
			          //   duration: 1500
			          // })
			        }
			
			        break;
			      default:
			        console.log(error)
			        break
			    }
			  },
			    dealData6() {
			      var that = this
			  
			      that.setProductNumData(that, 0)
			  
			      that.shopCarList= [];
			        that.judgment= false;
			      that.getShoppingCartData()
			    },
			    setProductList(data) {
			      let that = this;
			      var currentPage = that.currentPage;
			      if (data.length > 0) {
			        // 购物车列表的数据
			        var shopCarList = that.shopCarList
			        // 设置标题 获取饮品详情中的公司名
			        // if (1 == currentPage) {
			        //   that.setTitle(data[0].companyName)
			        // }
			  
			        for (let i = 0; i < data.length; i++) {
			          const element = data[i];
			          if (Utils.isNull(element.photos)) {
			            element.photo = defaultItemImgSrc
			          } else {
			            let photos = element.photos.split(",");
			            element.photo = photos[0]
			          }
			          if (Utils.isNull(element.detailPhotos)) {
			            var dPhotos = []
			            dPhotos.push(defaultItemImgSrc)
			            element.dPhotos = dPhotos
			          } else {
			            let dPhotos = element.detailPhotos.split(",");
			            element.dPhotos = dPhotos
			          }
			  
			          //显示的最低价
			          element.minprice = 10000
			          // 选择的数量
			          element.num = 0
			          // 弹窗显示选择的最终价格
			          element.sumprice = 0
			          // 显示选择了哪些规格
			          element.showSelectLabels = ""
			          var showSelectLabelList = []
			  
			          let details = element.detail
			          for (let j = 0; j < details.length; j++) {
			            const detail = details[j];
			            let labels = detail.labels
			  
			            // 是否默认选中了 单选默认选中 多选不需要
			            let isSelect = false
			            for (let k = 0; k < labels.length; k++) {
			              const label = labels[k];
			              if (label.lblprice != 0 && element.minprice > label.lblprice) {
			                element.minprice = label.lblprice
			              }
			              label.checked = false
			              // 选择该规格的数量
			              label.num = 0
			              // 有货 单选默认选中
			              if (label.available > 0 && label.lblsingle == 1 && !isSelect) {
			                label.checked = true
			                element.sumprice = element.sumprice + label.lblprice
			                showSelectLabelList = showSelectLabelList.concat(label.lblname)
			                isSelect = true
			              }
			              // 查询购物车中label选的数量
			              for (let a = 0; a < shopCarList.length; a++) {
			                const shopCar = shopCarList[a];
			                var labList = shopCar.labList
			                for (let b = 0; b < labList.length; b++) {
			                  const lab = labList[b];
			                  if (lab.id == label.id) {
			                    label.num = shopCar.num
			                    break
			                  }
			                }
			              }
			  
			            }
			          }
			          // 查询购物车中product选的数量
			          for (let a = 0; a < shopCarList.length; a++) {
			            const shopCar = shopCarList[a];
			            if (shopCar.productId == element.id) {
			              element.num = element.num + shopCar.num
			            }
			          }
			          element.sumprice = element.sumprice.toFixed(2)
			          element.showSelectLabels = showSelectLabelList.join("/")
			        }
			  
			        that.dataArray= that.dataArray.concat(data)
			      } else {
			        if (1 == currentPage) {
			          // wx.showToast({
			          //   title: "暂无商品！",
			          //   icon: 'none',
			          //   duration: 1500
			          // })
					  console.log("暂无商品！")
			        } else {
			          that.currentPage = --currentPage;
			          // wx.showToast({
			          //   title: "商品加载完毕！",
			          //   icon: 'none',
			          //   duration: 1500
			          // })
			        }
			      }
			    },
			    ShoppingCartData: function () {
			      var that = this;
				  //公司id
				  var agentCompanyId = "746"
			      var otherParam = "&shopType=3&companyId=" + agentCompanyId
			      getShoppingCartData(that, otherParam);
			    },
				 dealData5(data) {
				    var that = this
				    let shopCarList = data.shopCarList
				    if (shopCarList.length > 0) {
				      for (let i = 0; i < shopCarList.length; i++) {
				        const shopCar = shopCarList[i];
				        var showLabelList = []
				        var labels = shopCar.labList
				        for (let j = 0; j < labels.length; j++) {
				          const label = labels[j];
				          showLabelList = showLabelList.concat(label.lblname)
				        }
				        shopCar.showLabels = showLabelList.join("/")
				      }
				      that.shopCarList = shopCarList;
				    } else {
				      // wx.showToast({
				      //   title: "购物车里是空的",
				      //   icon: 'none',
				      //   duration: 1500
				      // })
				        this.shopCarList =[]
				    }
				  },
				    ProductTypeList: function () {
				      var that = this
				      var companyId = "746"
				      // companyId = 5919
				      var otherParamCom = that.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + "5";
				      // 5是饮品
				      otherParamCom += "&typeId=5";
				      getProductTypeList(that, otherParamCom);
				    }, 
					 setProductNumData(mainThis, num) {
					    var that = mainThis
					    var dataArray = that.dataArray
					
					    // 把商品所显示的数量清空
					    for (let i = 0; i < dataArray.length; i++) {
					      const data = dataArray[i];
					      data.num = num
					      var details = data.detail
					      for (let j = 0; j < details.length; j++) {
					        const detail = details[j];
					        var labels = detail.labels
					        for (let k = 0; k < labels.length; k++) {
					          const label = labels[k];
					          label.num = num
					        }
					      }
					    }
					    that.dataArray= dataArray
					  },
					  withGetProductTypeList: function (dataList, tag, errInfo) {
					      let that = this;
					      dowithGetProductTypeList(that, dataList, tag, errInfo);
						  console.log(123)
					      console.log("分类列表:", that.selProcuctTypeList)
					      that.loadInitData();
					    },
						  /**
						   * 加载第一页数据
						   */
						  loadInitData: function () {
						    var that = this
						    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
						    var tips = "加载第" + (currentPage + 1) + "页";
						    console.log("load page " + (currentPage + 1));
						    // wx.showLoading({
						    //   title: tips,
						    // })
						    //是否清空所有已选数据
						    // 刷新时，清空dataArray，防止新数据与原数据冲突
						    that.dataArray = [];
						    var pageSize = 6
						    // 获取第一页列表信息
						    that.queryProducts(pageSize, 1);
						  },
						/**
						* 获取饮品商品
						*/
						queryProducts(pageSize, pageIndex) {
						var that = this;
						var pageSize =pageSize
						var companyId = "746"
						// companyId = 5919
						var otherParam = that.isOpenMerchantPlatform ? "" : "&companyId=" + companyId + "," + "5";
						var typeId = ""
						if (that.selProductTypeIndex > 0) {
						typeId = that.selProcuctTypeList[that.selProductTypeIndex].id
						}
						// 5是饮品
						otherParam = otherParam + "&status=0&typeflag=5&mold=9&typeId=" + typeId + "&pSize=" + pageSize + "&pIndex=" + pageIndex
						let signParam = 'cls=product_goodtype&action=QueryProducts'
						var srvDevTest = this.$store.getters.sidebar.smurl; //测试接口域名地址
						var smallInterfacePart ="/baojiayou/mall.jsp?";
						var smurl = srvDevTest+smallInterfacePart;
						doGetData(this, smurl, signParam, otherParam, 0, "获取饮品商品")
						},
						//减去数量
  changeCut(e) {
    var that = this
    var index = e
    var dataArray = that.dataArray
    var data = dataArray[index]

    // 所选中的LabelId
    var labelIdList = []
    // var detailIdList = []
    // 判断是否可以直接减 多规格不支持直接减
    var isCanCut = false

    var details = data.detail
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      isCanCut = false
      var labels = detail.labels
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.num > 0) {
          if (label.num == data.num) {
            isCanCut = true
            labelIdList = labelIdList.concat(label.id)
            // detailIdList = detailIdList.concat(label.detailId)
            label.num--
          } else {
            // 发现多种规格 不能直接减
            isCanCut = false
            break
          }
        }
      }
      if (!isCanCut) {
        // wx.showToast({
        //   title: "多规格商品请去购物车删除哦",
        //   icon: 'none',
        //   duration: 2500
        // })
        that.judgment =  true;
        that.detailType = false;
        return;
      }
    }
    data.num--
    var detailLabelId = labelIdList.join(",")
    // var productDetailId = detailIdList.join(",")
    that.tempDataArray = dataArray
    that.addShopCar(detailLabelId, 1, 2)
  },							//0       1
    addShopCar(detailLabelId, carStatus, tag) {
      var userId = this.$store.getters.sidebar.userId
      let signParam = 'cls=product_shopCar&action=addShopCar&userId=' + userId + "&productDetailId=0"
      //  carStatus  0 加 1減  （从商品处进行加减 用于餐馆/饮品）       非必填参数 默认为0
      //  1:餐馆 2:便利店 3饮品（不传值则为商城的购物车）     非必填参数   
      var otherParam = "&detailLabelId=" + detailLabelId + "&shopType=3&carStatus=" + carStatus + "&companyId=" + "746"
	  var srvDevTest = this.$store.getters.sidebar.smurl; //测试接口域名地址
	  var smallInterfacePart ="/baojiayou/mall.jsp?";
	  var smurl = srvDevTest+smallInterfacePart;
      doGetData(this, smurl, signParam, otherParam, tag, "加减购物车")
    },
	//购物商品加减操作
	  changeDrinkNum(tag,index) {
		  console.log(123)
	    var that = this;
	    var tag = tag;
	    var index = index;
	    var dataArray = that.dataArray;
	    var shopCarList = that.shopCarList[index]
	    var labList = shopCarList.labList
	
	    for (let i = 0; i < dataArray.length; i++) {
	      const data = dataArray[i];
	      if (data.id == shopCarList.productId) {
	        if (tag == 0) {
	          data.num++
	        } else {
	          data.num--
	        }
	      }
	
	      var details = data.detail
	      for (let j = 0; j < details.length; j++) {
	        const detail = details[j];
	        var labels = detail.labels
	        for (let k = 0; k < labels.length; k++) {
	          const label = labels[k];
	          for (let a = 0; a < labList.length; a++) {
	            const lab = labList[a];
	            if (lab.id == label.id) {
	              if (tag == 0) {
	                label.num++
	              } else {
	                label.num--
	              }
	              break
	            }
	          }
	        }
	      }
	    }
	
	    that.tempDataArray = dataArray
	    that.addShopCar(shopCarList.detailLabelId, tag, 3)
	  },			
	}
	}
</script>

<style lang="scss">
	/*现在开始的第一样式*/
	.titlederss {
		width: 100%;
		height: 60px;
		background: #008665;
		color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		font-size: 30px;
	}
	
	.notice {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding-left: 30px;
		line-height: 60px;
	}
	
	/*主题内容模块css*/
	
	.mainContent {
		margin-left: 170px;
		margin-top: 60px;
		position: relative;
	}
	
	.sortlist {
		position: fixed;
		height: 100%;
		top: 60px;
		background: #f0f1f3;
		color: #9fa6a9;
		left: 0;
	}
	
	.sortlist div {
		line-height: 96px;
		width: 170px;
		text-align: center;
		border-bottom: solid 1px #eceaea;
		font-size: 28px;
	}
	
	.listpitch {
		color: #383c40;
		background: #fff;
		font-weight: 600;
	}
	
	.drinkitem {
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
		padding-bottom: 100px;
		display: flex;
		flex-wrap: wrap;
	}
	
	.adelnum {
		width: 36px;
		height: 36px;
		border: #2f9f82 solid 2px;
		border-radius: 50%;
		color: #2f9f82;
		padding-bottom: 21px;
		box-sizing: border-box;
		position: relative;
	}
	
	.adelnum::after {
		content: '';
		position: absolute;
		border: solid #2f9f82 2px;
		width: 16px;
		top: 48%;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.addnum {
		width: 36px;
		height: 36px;
		/* border: #2F9F82 solid 4px; */
		background: #2f9f82;
		border-radius: 50%;
		font-size: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-sizing: border-box;
		position: relative;
	}
	
	.addnum::after {
		content: "";
		width: 50%;
		border: 1px #fff solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(90deg);
	}
	
	.addnum::before {
		content: "";
		width: 50%;
		border: 1px #fff solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(0deg);
	}
	
	/*热卖样式*/
	
	.tally {
		width: 60px;
		color: #fff;
		line-height: 32px;
		padding-left: 14px;
		font-size: 22px;
		background: #fa5452;
		border-radius: 10px 0 24px 0;
	}
	
	/*轮播*/
	
	.slide-image {
		width: 100%;
		height: 100%;
	}
	
	.swiper {
		width: 100%;
		height: 300px;
	}
	
	.swiperimage {
		width: 100%;
		height: 100%;
	}
	
	/*引导标题*/
	
	.trace {
		position: fixed;
		top: 60px;
		left: 170px;
		width: 100%;
		background: #fff;
		color: #2f2f2f;
		padding-left: 20px;
		line-height: 60px;
		font-size: 28px;
	}
	
	/**/
	
	.tracetitle {
		width: 100%;
		background: #fff;
		color: #2f2f2f;
		line-height: 100px;
		font-size: 28px;
	}
	
	/*-----------------------------------循环样式-----------------------*/
	
	.tea {
		flex: 0 1 2;
		width: 33%;
		display: flex;
		margin-top: 20px;
	}
	
	.tea-image {
		height: 180px;
		padding: 20px;
		box-sizing: border-box;
		position: relative;
		width: 35%;
	}
	
	.milktea {
		width: 100%;
		height: 100%;
	}
	
	.tally {
		position: absolute;
		left: 0;
		top: 0;
	}
	
	.tea-item {
		width: 65%;
		position: relative;
	}
	
	.teaname {
		display: flex;
		font-size: 30px;
		font-weight: bold;
	}
	
	.teaintroduce {
		max-width: 76%;
		font-size: 18px;
		line-height: 34px;
		color: #a9abad;
		/*两行显示省略号*/
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.teaprice {
		font-family: DiN;
		color: #8d4611;
		font-weight: 700;
		line-height: 60px;
		font-size: 30px;
		display: flex;
	}
	
	.count {
		position: absolute;
		bottom: 20px;
		right: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.ufo {
		margin: 0 20px;
		font-size: 22rpx;
	}
	
	/*----------------------------------------底部购物导航------------------------------*/
	
	.tomcar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100px;
		background: #3d3e42;
		width: 100%;
		display: flex;
		z-index: 30;
	}
	
	.caricon {
		width: 22%;
		position: relative;
	}
	
	.cariconab {
		position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: #65666a;
		bottom: 20%;
		right: 20%;
	}
	
	.cariconre {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	
	.cariconre img {
		width: 60px;
		height: 60px;
	}
	
	.thingnum {
		position: absolute;
		padding: 10px;
		background: #8b440e;
		border-radius: 50%;
		top: -4px;
		right: -10px;
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 22px;
		box-sizing: border-box;
	}
	
	/*购物车有物品时样式*/
	
	.selectback {
		background: #008665;
		border-radius: 50%;
	}
	
	.close {
		width: 78%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 34px;
	}
	
	.close-price {
		color: #fff;
	}
	
	.close-price text {
		font-size: 46px;
	}
	
	.close-botton {
		display: flex;
		height: 100%;
		width: 200px;
		align-items: center;
		justify-content: center;
		background: #2b2e33;
		color: #84878c;
		font-weight: bold;
	}
	
	/*有物品时结算样式*/
	
	.selectbut {
		background: #008665;
		color: #fff;
	}
	
	/*已选商品样式弹窗*/
	
	.windowBackgroud {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #070707;
		opacity: 0.6;
		z-index: 20;
	}
	
	.windowitem {
		position: fixed;
		bottom: -600px;
		left: 0;
		z-index: 25;
		width: 100%;
		background: #eff0f2;
		transition: bottom 0.4s;
	}
	
	.windowout {
		bottom: 100px;
	}
	
	.milktop {
		color: #555;
		display: flex;
		justify-content: space-between;
		padding: 20px;
		box-sizing: border-box;
		font-size: 30px;
	}
	
	.milktop-Second {
		display: flex;
		align-items: center;
	}
	
	.milktop-Second img {
		width: 30px;
		height: 30px;
		margin-left: 20px;
	}
	
	.sroll {
		max-height: 470px;
		margin-bottom: 40px;
		overflow: auto;
	}
	
	.itemdetil {
		display: flex;
		padding: 30px 40px;
		box-sizing: border-box;
		font-size: 30px;
		background: #fff;
		align-items: center;
		justify-content: space-between;
	}
	
	.detilcont {
		width: 44%;
	}
	
	.detilcont div:nth-of-type(1) {
		line-height: 60px;
		font-size: 36px;
	}
	
	.detilcont div:nth-of-type(2) {
		color: #a0a6a8;
		font-size: 24px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 40px;
	}
	
	.detilprice {
		width: 30%;
		font-size: 34px;
		color: #a0673b;
		font-weight: bold;
	}
	
	.totalNum {
		display: flex;
	}
	
	/*删除样式*/
	
	.delete {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #080808;
		opacity: 0.6;
		box-sizing: border-box;
		position: relative;
	}
	
	.delete::after {
		content: "";
		width: 60%;
		border: 1px #fff solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(45deg);
	}
	
	.delete::before {
		content: "";
		width: 60%;
		border: 1px #fff solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(-45deg);
	}
	
	/*商品详情*/
	
	.commoditydetail {
		position: fixed;
		bottom: -940px;
		left: 0;
		z-index: 30;
		background: #f6f8fa;
		transition: bottom 0.4s;
		width: 100%;
	}
	
	.commoditydetailout {
		bottom: 0;
	}
	
	.commoditydetail .swiper {
		width: 100%;
		height: 560px;
	}
	
	.commod {
		padding: 40px;
	}
	
	.commodityName {
		font-weight: bold;
		font-size: 32px;
	}
	
	.hendusk {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30px 0;
	}
	
	.henduskprice {
		color: #9b5e30;
		font-size: 30px;
	}
	
	.henduskprice a {
		font-size: 38px;
	}
	
	.taste {
		color: #8d9297;
		font-size: 28px;
	}
	
	.podelete {
		position: absolute;
		top: 20px;
		right: 40px;
		opacity: 0.4;
	}
	
	/*选择杯型/冰度/糖度/配料样式*/
	
	.burdening {
		position: fixed;
		bottom: -1200px;
		left: 0;
		z-index: 30;
		background: #fff;
		transition: bottom 0.4s;
		width: 100%;
		padding: 40px;
		box-sizing: border-box;
		height: 600px;
		overflow-y: auto;
	}
	
	.burdeningout {
		bottom: 0;
	}
	
	.ningOne {
		display: flex;
		align-items: center;
	}
	
	.ningOne img {
		/* width: 170px; */
		width: 24%;
		height: 268px;
		padding-right: 10px;
		box-sizing: border-box;
	}
	
	.Onejieshao {
		width: 70%;
	}
	
	.Onejieshao div:nth-of-type(1) {
		font-size: 34px;
		font-weight: bold;
	}
	
	.Onejieshao div:nth-of-type(2) {
		font-size: 24px;
		margin: 10px 0;
		width: 100%;
		word-wrap: break-word;
	}
	
	.Onejieshao div:nth-of-type(3) {
		color: #8c4713;
		font-size: 30px;
		font-weight: bold;
	}
	
	.Onejieshao div:nth-of-type(3) .test {
		font-size: 40px;
		display: inline;
	}
	
	.secondSelect {
		max-height: 800px;
		margin-top: 20px;
	}
	
	.selectCup {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
	
	.typeTitle {
		font-size: 30px;
	}
	
	.seucces {
		font-size: 26px;
		background: #EFF0F2;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px 20px;
		color: #4B5156;
		margin-right: 20px;
		margin-bottom: 20px;
		margin-top: 20px;
		position: relative;
	}
	
	.selectSucces {
		background: #CEEBE6;
		color: #1B9777;
	}
	
	.seucces a {
		color: #1B9777;
	}
	
	
	.ete {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
	}
	
	.ete::after {
		content: "";
		width: 60%;
		border-bottom: 4px #333 solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(45deg);
	}
	
	.ete::before {
		content: "";
		width: 60%;
		border-bottom: 4px #333 solid;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%) rotate(-45deg);
	}
	
	.poete {
		position: absolute;
		top: 0px;
		right: 0px;
		opacity: 0.4;
	}
	
	.butTure {
		color: #C5DED8;
		background: #018766;
		line-height: 80px;
		text-align: center;
		font-size: 34px;
		border-radius: 6px;
	}
	
	.pomilk {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background: #a8a6a6;
		opacity: 0.7;
	}
	
	.countt {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.hid {
		display: block;
	}
	.deen {
		display: none;
	}

</style>
