// pages/LuckyDraw/Draw/Draw.js
import util from '../../../utils/util.js'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		luckyDrawId : 0,
		luckyDraw : {},
        commodityList : [],
        ebNumber : 0,
        inputNumber : 0,
        ebPrice : 0,
        ebTotal : 0,
		totalPrice : 0,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
		newDate : ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			newDate : util.formatDateUTC_yyyyMMddHHmmss_newDate(),
			luckyDrawId : options.luckyDrawId,
		})
    },

    changeRadio : function(e){
        let number = e.currentTarget.dataset.number
        let price = e.currentTarget.dataset.price
        this.setData({
            ebNumber : number,
            ebPrice : price,
            ebTotal : this.data.inputNumber * number,
            totalPrice : this.data.inputNumber * price
		})
    },

    changeNumber : function(e){
        let value = e.detail.value
        this.setData({
            inputNumber : value
        })
        if(value != ""){
            value = parseInt(e.detail.value)
        }else{
            value = 0
        }
        let inputNumber = value
        this.setData({
            ebTotal : inputNumber * this.data.ebNumber,
            totalPrice : inputNumber * this.data.ebPrice
        })
    },

    blurNumber : function(e){
        let value = e.detail.value
        if(value.length == 0){
            value = 1
        }
        let inputNumber = parseInt(value)
        this.setData({
            inputNumber : inputNumber,
            ebTotal : inputNumber * this.data.ebNumber,
            totalPrice : inputNumber* this.data.ebPrice
        })
    },

	findActivityStatus(){
		let result = true
		if(this.data.activityStatus == 0){
			//管理员未开启活动
			wx.showModal({
				title : "Alert",
				content : "Activity not enabled",//活动未开启
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}else if(this.data.activityStatus == 3){
			//活动已开启，已到活动结束时间
			wx.showModal({
				title : "Alert",
				content : "Activity has ended",//活动已结束
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}else if(this.data.activityStatus == 4){
			//活动已手动结束
			wx.showModal({
				title : "Alert",
				content : "Activity terminated",//活动已终止
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}
		return result
	},

    submit : function(){
		const that = this
		const status = this.findActivityStatus()
		if(!status){
			return
		}
		let luckyDrawState = 0
		if(this.data.activityEvent.activity_ID != undefined){
			luckyDrawState = this.data.activityEvent.luckyDraw_state
		}
		if(luckyDrawState == 0){
			wx.showModal({
				title : "Alert",
				content : "Lucky draw ticket purchase not opened",//抽奖买票未开启
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}
		const isOpen = this.data.luckyDraw.isOpen
		if(isOpen == 1){
			wx.showModal({
				title: 'Alert',
				content: 'Prizes have been drawn, tickets cannot be purchased',//奖品已中奖，不能买票
				showCancel : false,
				confirmText : "Ok",
				complete: (res) => {
					if (res.confirm) {}
				}
			})
            return
		}

        if(this.data.ebNumber == 0){
            wx.showToast({
                title : "Please choose ticket",
                icon : "none",
                duration : 2000
            })
            return
        }
        if(this.data.inputNumber < 1){
            wx.showToast({
                title : "Please fill in the quantity",
                icon : "none",
                duration : 2000
            })
            return
        }
		const buyLuckyDrawPayRMB = app.globalData.buyLuckyDrawPayRMB
        if(this.data.totalPrice > buyLuckyDrawPayRMB){
            wx.showModal({
                title : "Alert",
                content : "The limit of amount in each payment is "+buyLuckyDrawPayRMB+", please enter another amount",
                showCancel : false,
                confirmText : "Ok"
            })
            return
        }
        wx.showModal({
            title : "Alert",
            content : "The payment is Non-refundable;",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
                    wx.showModal({
						title : "Alert",
                        content : "The Qty of tickets you wish to purchase is "+that.data.ebTotal+".",
                        cancelText : "Cancel",
                        confirmText : "Ok",
                        success : function(res){
                            if(res.confirm){
                                var timeStamp = Date.parse(new Date());
                                let formData = that.data.totalPrice
                                let orderId = "IF2023-" + timeStamp
								console.log('form发生了submit事件，携带数据为：', formData)
								wx.cloud.callFunction({
									name: "cloudpayLuckyDraw",
									data: {
										orderId : orderId,//订单ID
										boothId : that.data.luckyDrawId,
										ebPrice : that.data.ebPrice / that.data.ebNumber,//单个抽奖券单价
										ebNumber : that.data.ebTotal,//买票数量
										payment : formData * 100//付款金额RMB（元）
									},
									success(res) {
										console.log("提交成功", res.result)
										const payment = res.result.payment
										wx.requestPayment({
											...payment,
											success (res) {
												console.log('pay success', res)
												wx.showToast({
													title: 'SUCCESS',
													icon : "success"  
												})
											},
											fail (err) {
												console.error('pay fail', err)
											}
										})
									},
									fail(res) {
										console.log("提交失败", res)
										wx.showModal({
											title : "Alert",
											content : "Submission failed",
											showCancel : false,
											confirmText : "Ok"
										})
									}
								})
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
		
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
		this.getActivityStatus()
		this.getActivityEvent()
		this.loadLuckyDraw()
		this.loadLuckyDrawCommodity()
	},

	loadLuckyDraw : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDraw where booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				that.setData({
					luckyDraw : res.result[0]
				})
			},
			fail : function(res){
				console.log(res)
			}
		})
	},

	loadLuckyDrawCommodity : function(){
		const that = this
		wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from LuckyDrawCommodity where status='1'"
            },
            success : function(res){
                that.setData({
                    commodityList : res.result
                })
            },
            fail : function(res){
				console.log(res)
            }
        })
	},

	getActivityEvent(){
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
				wx.hideLoading()
                if(res.result != null && res.result.length > 0){
                    that.setData({
						activityEvent : res.result[0],
					})
				}
            },
            fail : function(res){
				console.log(res)
				wx.hideLoading()
            }
        })
	},
	
	getActivityStatus() {
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
		wx.cloud.callFunction({
			name : "getActivityStatus",
            success : function(res){
				wx.hideLoading()
			    that.setData({
					activityStatus : res.result,
				})
				that.findActivityStatus()
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
            }
		})
	},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
		this.loadLuckyDrawCommodity()
		app.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})