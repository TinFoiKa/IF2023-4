// pages/LuckyDraw/LuckyDraw.js
import util from '../../utils/util.js'
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
        isBoothManager : false,
		luckyDrawId : 0,
		luckyDraw : {},
		prizeList : [],
		paidMoney : 0,
		myTicketList : [],
		ticketNoAll : [],
		luckyDrawTicketNo : [],
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			luckyDrawId : options.luckyDrawId
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
	
	draw : function(){
		// const status = this.findActivityStatus()
		// if(!status){
		// 	return
		// }
		if(this.data.userInfo.is_Disable == 1){
			wx.showModal({
				title : "Alert",
				content : "The current account has been disabled and cannot be traded",//当前账户已被禁用，无法交易
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}
		wx.navigateTo({
		  	url: '/pages/LuckyDraw/Draw/Draw?luckyDrawId='+this.data.luckyDrawId,
		})
	},

	toLottery : function(options){
		wx.navigateTo({
		  	url: '/pages/LuckyDraw/Lottery/Lottery?luckyDrawId='+this.data.luckyDrawId+'&prizeId='+options.currentTarget.dataset.prizeid,
		})
	},

	tutorial : function(){
		wx.navigateTo({
            url: '/pages/Tutorial/Tutorial?tutorialType=3',
        })
	},

	showImage : function(options){
		const imageUrl = options.currentTarget.dataset.url
		wx.previewImage({
		  	urls: [imageUrl],
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
		//this.getActivityStatus()
		this.getUserInfo()
		this.getActivityEvent()
		this.loadIsBoothManager()
		this.loadLuckyDraw()
		this.loadLuckyDrawPrize()
		this.loadLuckyDrawTicket()
		this.loadPaidMoney()
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
				// wx.showToast({
				// 	title: "Load timeout",
                //     icon : "error"
				// })
			}
		})
	},

	loadLuckyDrawPrize : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select a.*, b.ticket_no, c.if_ID from LuckyDrawPrize a left join LuckyDrawTickets b on a.ticket_ID=b.ticket_ID left join Users c on a.win_open_id=c.open_ID where a.booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				that.setData({
					prizeList : res.result
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
                //     icon : "error"
				// })
			}
		})
	},

	loadLuckyDrawTicket : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDrawTickets where booth_ID='"+this.data.luckyDrawId+"' and open_ID='"+this.data.openId+"'"
			},
			success : function(res){
				that.setData({
					myTicketList : res.result
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
                //     icon : "error"
				// })
			}
		})
	},

	loadIsBoothManager : function(){
		const that = this
		wx.cloud.callFunction({
            name: "executeSql",
            data: {
                sql : "select * from BoothManagers where open_id='"+this.data.openId+"' and booth_type=3 and status=1"// and booth_id='"+this.data.luckyDrawId+"'
            },
            success: function (res) {
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        isBoothManager : true
                    })
                }
            }
		})
	},

	loadPaidMoney : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select sum(amount) as sumAmount from eBRecord where type=3 and is_return=0 and booth_type='3' and sender_open_id='"+this.data.openId+"' and wechatPaymentState=1"// and booth_ID='"+this.data.luckyDrawId+"'
			},
			success : function(res){
				if(res.result != null && res.result[0].sumAmount != null){
					that.setData({
						paidMoney : res.result[0].sumAmount
					})
				}
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
			},
		})
	},

	getActivityEvent(){
		const that = this
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
						activityEvent : res.result[0],
					})
                }
            },
            fail : function(res){
				console.log(res)
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
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

	getUserInfo(){
		const that = this
        wx.cloud.callFunction({
            name : "getUserByOpenId",
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
						userInfo : res.result[0],
					})
                }
            },
            fail : function(res){
                wx.showModal({
					title: 'Alert',
					content: 'Failed to obtain account information. Please try again',//获取账号信息失败，请重试
					showCancel : false,
					confirmText : 'Ok',
					complete: (res) => {
						if (res.confirm) {
							wx.navigateBack()
						}
					}
				})
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
		this.loadLuckyDrawPrize()
		this.loadLuckyDrawTicket()
		this.loadPaidMoney()
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