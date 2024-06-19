// pages/EB/EB.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		userInfo : {},
		totalPaid : 0,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    MyQr : function(){
        wx.navigateTo({
          url: '/pages/EB/MyQR/MyQR',
        })
    },

    scan : function(){
        let braceletMaxCount = app.globalData.braceletMaxCount
        const that = this
        wx.scanCode({
			scanType : "qrCode",
			onlyFromCamera: true,
            success : function(res){
                let qrcode = res.result
				// let qrcode = "087617dc-1857-4306-bb2f-f801a283b512"
				wx.showLoading({title:'Loading', mask : true})
				wx.cloud.callFunction({
                    name: "cloudfunction",
                    data: {
                        type: "userScan",
						qrCode : qrcode,
						braceletMaxCount : braceletMaxCount
                    },
                    success : function(res){
						wx.hideLoading()
						if(res.result.errorCode == 1001){
							console.log("fail", res)
							wx.showModal({
								title: 'Fail',
								content: "Request to server failed, please try again",//请求服务器失败
								showCancel : false,
								confirmText : "Ok"
							})
						}else if(res.result.errorCode == 1002){
							let transferEBState = 0
							if(that.data.activityEvent.activity_ID != undefined){
								transferEBState = that.data.activityEvent.transferEB_state
							}
							if(transferEBState == 0){
								wx.showModal({
									title : "Alert",
									content : "Transfer Eagle Buck(s) function has been turned off",//转让EB功能已关闭
									showCancel : false,
									confirmText : "Ok",
								})
								return
							}
							if(that.data.userInfo.open_ID == undefined){
								wx.showModal({
									title : "Alert",
									content : "Failed to obtain account information, Please rescan the QR code",//获取账户信息失败，请重新扫描二维码
									showCancel : false,
									confirmText : "Ok",
									success : function(res){
										if(res.confirm){
											that.getUserInfo()
										}
									}
								})
								return
							}else{
								if(that.data.userInfo.is_Disable == 1){
									wx.showModal({
										title : "Alert",
										content : "The current account has been disabled and cannot be traded",//当前账户已被禁用，无法交易
										showCancel : false,
										confirmText : "Ok",
									})
									return
								}
							}

							let isDisable = res.result.qrcode_isDisable
							if(isDisable == 1){
								wx.showModal({
									title : "Alert",
									content : "The other party's account has been disabled and cannot be traded",//对方账户已被禁用，无法交易
									showCancel : false,
									confirmText : "Ok",
								})
								return
							}

							let openId = res.result.qrcode_openId
							//跳转到转账页面
							wx.navigateTo({
								url: '/pages/EB/Transfer/Transfer?openId='+openId,
							})
						}else if(res.result.errorCode == 1003){
							//跳转摊位退款页面
							wx.navigateTo({
								url: '/pages/EB/ReturnEB/ReturnEB?qrCode='+qrcode,
							})
						}else if(res.result.errorCode == 1004){
							wx.showModal({
								title: 'Fail',
								content: "The QR Code is invalid",//二维码无效
								showCancel : false,
								confirmText : "Ok"
							})
						}else if(res.result.errorCode == 1005){
							//跳转到添加手环
							wx.navigateTo({
								url: '/pages/EB/AddBracelet/AddBracelet?qrcode='+qrcode,
							})
						}else if(res.result.errorCode == 1006){
							wx.showModal({
								title: 'Fail',
								content: "The total number of QR codes exceeded the limit ("+braceletMaxCount+"/account)",//手环总数超过限制
								showCancel : false,
								confirmText : "Ok"
							})
						}else if(res.result.errorCode == 1007){
							wx.showModal({
								title: 'Fail',
								content: "The QR Code is in use",//二维码正在使用中
								showCancel : false,
								confirmText : "Ok"
							})
						}
					}
				})
            },
            fail : function(res){
                console.log("res fail", "扫码已关闭", res)
            }
        })
    },

    buy : function(){
		// const status = this.findActivityStatus()
		// if(!status){
		// 	return
		// }
		console.log("this.data.userInfo", this.data.userInfo)
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
			url: '/pages/EB/Buy/Buy',
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

    MyQrList : function(){
        wx.navigateTo({
            url: '/pages/EB/QRs/QRs',
        })
    },

    tutorial : function(){
		wx.navigateTo({
			url: '/pages/Tutorial/Tutorial?tutorialType=1',
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
		this.getUserInfo()
		this.loadEagleBuckSubtotal()
	},

	loadEagleBuckSubtotal : function(){
		const that = this
		wx.cloud.callFunction({
            name : "cloudfunction",
			data : {
				type : "getPayEBTotalPaidRMB"
			},
            success : function(res){
                that.setData({
                    totalPaid : res.result.totalEBPaid
                })
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
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
            }
		})
	},

	getUserInfo(){
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "getUserByOpenId",
            success : function(res){
				wx.hideLoading()
				console.log("getUserInfo", res.result)
                if(res.result != null && res.result.length > 0){
                    that.setData({
						userInfo : res.result[0],
					})
                }
            },
            fail : function(res){
				wx.hideLoading()
                wx.showModal({
					title: 'Alert',
					content: 'Failed to obtain account information. Please refresh and try again',//获取账号信息失败，请刷新重试
					showCancel : false,
					confirmText : 'Ok',
					complete: (res) => {
						if (res.confirm) {
							that.getUserInfo()
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
		this.loadEagleBuckSubtotal()
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