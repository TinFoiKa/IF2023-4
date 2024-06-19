// pages/EB/Transfer/Transfer.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		userInfo : {},
        transferOpenId : "",
        transferUser : {},
		inputNumber : 1,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            transferOpenId : options.openId
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
		let transferEBState = 0
		if(this.data.activityEvent.activity_ID != undefined){
			transferEBState = this.data.activityEvent.transferEB_state
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
		if(this.data.userInfo.open_ID == undefined){
			wx.showModal({
				title : "Alert",
				content : "Failed to obtain account information, Please resubmit",//获取账户信息失败，请重新提交
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
			if(this.data.userInfo.is_Disable == 1){
				wx.showModal({
					title : "Alert",
					content : "The current account has been disabled and cannot be traded",//当前账户已被禁用，无法交易
					showCancel : false,
					confirmText : "Ok",
				})
				return
			}
		}
		if(this.data.transferUser.is_Disable == 1){
			wx.showModal({
				title : "Alert",
				content : "The other party's account has been disabled and cannot be traded",//对方账户已被禁用，无法交易
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}

        if(this.data.inputNumber < 1){
            wx.showToast({
                title : "Please fill in the transfer quantity",
                icon : "none",
                duration : 2000
            })
            return
        }
        const eagleBucksTransfer = app.globalData.eagleBucksTransfer
        if(this.data.inputNumber > eagleBucksTransfer){
            wx.showModal({
                title : "Alert",
                content : "The limit of Ebs in each transaction is "+eagleBucksTransfer+", please enter another quantity",
                showCancel : false,
                confirmText : "Ok"
            })
            return
        }
        wx.showModal({ 
            content : "The quantity of Eagle Bucks you wish to receive is "+this.data.inputNumber+".",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
                    wx.cloud.callFunction({
                        name: "eagleBucks",
                        data: {
                            recordType:2,
                            ebNumber: that.data.inputNumber,
                            transferOpenId : that.data.transferOpenId
                        },
                        success(res) {
							wx.hideLoading()
                            if(res.result == 1000){
                                wx.showModal({
                                    title : "Alert",
                                    content : "SUCCESS",
                                    showCancel : false,
                                    confirmText : "Ok",
                                    success : function(res){
										if(res.confirm){
											wx.navigateBack()
										}
                                    }
                                })
                            }else if(res.result == 1001){
                                wx.showModal({
                                    title : "Alert",
                                    content : "The server encountered an error and the operation failed",//服务器出现错误，操作失败
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }else if(res.result == 1002){
                                wx.showModal({
                                    title : "Alert",
                                    content : "User does not exist",//用户不存在
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }else if(res.result == 1003){
                                wx.showModal({
                                    title : "Alert",
                                    content : "Insufficient balance of the other party",//对方余额不足
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }
                        },
                        fail(res) {
							console.log("转账失败", res)
							wx.hideLoading()
                            wx.showModal({
                                title : "Alert",
                                content : "Transfer failed",
                                showCancel : false,
                                confirmText : "Ok"
                            })
                        }
                    })
                }
            }
        })
    },

    cancel : function(){
        wx.navigateBack()
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
		this.loadTransferUser()
	},

	loadTransferUser : function(){
		const that = this
		wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Users where open_ID='"+this.data.transferOpenId+"'"
            },
            success : function(res){
                that.setData({
                    transferUser : res.result[0]
                })
            },
            fail : function(res){
				wx.showModal({
					title: 'Alert',
					content: 'Load timeout，try again',
					showCancel : false,
					confirmText : "Ok",
					complete: (res) => {
						if (res.confirm) {
							wx.navigateBack()
						}
					}
				})
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
				that.findActivityStatus()
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
				wx.showModal({
					title: 'Alert',
					content: 'Load timeout，try again',
					showCancel : false,
					confirmText : "Ok",
					complete: (res) => {
						if (res.confirm) {
							wx.navigateBack()
						}
					}
				})
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
                if(res.result != null && res.result.length > 0){
                    that.setData({
						userInfo : res.result[0],
					})
                }
            },
            fail : function(res){
				console.log(res)
				wx.hideLoading()
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
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
		wx.stopPullDownRefresh()
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