// pages/BoothMgr/BoothMgr.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openid : wx.getStorageSync('openid'),
		navbar: [
			'Scan',
			'Records'
		],
		currentTab: 0,
		boothInfo : {},
        transferOpenId : "",
		transferUser : {},
        transferBraceletQR : "",
		isTransfer : false,
		inputNumber : 1,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
		recordList : [],
	},
	
	navbarTap: function (e) {
		this.setData({
		  	currentTab: e.currentTarget.dataset.idx
		})
		if(this.data.currentTab == 1){
			this.searchBtn()
			this.loadBoothData()
		}
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.loadBoothData()
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

    reduce : function(){
        let inputNumber = parseInt(this.data.inputNumber) - 1
        if(inputNumber <= 1){
            inputNumber = 1
        }
        this.setData({
            inputNumber : inputNumber
        })
    },

    plus : function(){
        let inputNumber = parseInt(this.data.inputNumber) + 1
        this.setData({
            inputNumber : inputNumber
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
	
	scan : function(){
		const status = this.findActivityStatus()
		if(!status){
			return
		}
		const that = this
        wx.scanCode({
			scanType : "qrCode",
			onlyFromCamera: true,
            success : function(res){
                let qrcode = res.result
				//let qrcode = "89bbf5f6-a82f-4c61-9882-cf2769c56b92"//未绑定手环二维码
				//let qrcode = "c12b65cd-322a-4b9e-b901-b218d6efe20c"//已绑定手环二维码
				//let qrcode = "1aaa"//不存在的用户ifqr
				// let qrcode = "087617dc-1857-4306-bb2f-f801a283b512"//我的ifqr
                wx.showLoading({title:'Loading', mask : true})
                wx.cloud.callFunction({
                    name: "executeSql",
                    data: {
                        sql : "select * from Bracelets where qr_link='"+qrcode+"'"
                    },
                    success : function(res){
                        if(res.result == null || res.result.length == 0){
                            //手环不存在，判断是否是用户二维码
                            wx.cloud.callFunction({
                                name : "executeSql",
                                data : {
                                    sql : "select * from Users where ifqr='"+qrcode+"'"
                                },
                                success : function(res){
                                    wx.hideLoading()
                                    if(res.result == null || res.result.length == 0){
                                        wx.showModal({
                                            title: 'Alert',
                                            content: "The QR Code is invalid",//二维码无效
                                            showCancel : false,
                                            confirmText : "Ok"
                                        })
                                    }else{
										let useEBState = 0
										if(that.data.activityEvent.activity_ID != undefined){
											useEBState = that.data.activityEvent.useEB_state
										}
										if(useEBState == 0){
											wx.showModal({
												title : "Alert",
												content : "The use EB function has been turned off",//使用EB功能已关闭
												showCancel : false,
												confirmText : "Ok",
											})
											return
										}

										if(res.result[0].is_Disable == 1){
											wx.showModal({
												title : "Alert",
												content : "The user has been disabled and cannot proceed with transactions",//用户已禁用，无法进行交易
												showCancel : false,
												confirmText : "Ok",
											})
											return
										}

                                        that.setData({
											transferOpenId : res.result[0].open_ID,
											transferUser : res.result[0],
											transferBraceletQR : "",
											isTransfer : true
										})
                                    }
                                },
                                fail : function(res){
                                    console.log("fail", res)
                                    wx.hideLoading()
                                    wx.showModal({
                                        title: 'Alert',
                                        content: "Data acquisition timeout",//数据获取超时
                                        showCancel : false,
                                        confirmText : "Ok"
                                    })
                                }
                            })
                        }else{
                            //扫描的是手环
                            let bracelet = res.result[0]
                            if(bracelet.linked_open_id != null && bracelet.linked_open_id.length > 0){
								if(bracelet.is_active == 0){
									wx.hideLoading()
									wx.showModal({
										title: 'Alert',
										content: "The bracelet has been disabled by the main account",//手环已被主账号禁用
										showCancel : false,
										confirmText : "Ok"
									})
								}else{
									wx.cloud.callFunction({
										name: "cloudfunction",
										data: {
											type: "getOtherUserByOpenId",
											openId : bracelet.linked_open_id
										},
										success : function(res){
											wx.hideLoading()

											let useEBState = 0
											if(that.data.activityEvent.activity_ID != undefined){
												useEBState = that.data.activityEvent.useEB_state
											}
											if(useEBState == 0){
												wx.showModal({
													title : "Alert",
													content : "The use EB function has been turned off",//使用EB功能已关闭
													showCancel : false,
													confirmText : "Ok",
												})
												return
											}

											if(res.result[0].is_Disable == 1){
												wx.showModal({
													title : "Alert",
													content : "The main account has been disabled and transactions cannot be processed",//主账号已被禁用，无法进行交易
													showCancel : false,
													confirmText : "Ok",
												})
												return
											}

											that.setData({
												transferOpenId : res.result[0].open_ID,
												transferUser : res.result[0],
												transferBraceletQR : bracelet.qr_link,
												isTransfer : true
											})
										},
										fail : function(res){
											console.log("fail", res)
											wx.hideLoading()
											wx.showModal({
												title: 'Alert',
												content: "Data acquisition timeout",//数据获取超时
												showCancel : false,
												confirmText : "Ok"
											})
										},
									})
								}
                            }else{
								wx.hideLoading()
                                wx.showModal({
                                    title: 'Alert',
                                    content: "The bracelet is not bound to an account",//手环未绑定账户
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }
                        }
                    },
                    fail : function(res){
                        console.log("fail", res)
                        wx.showModal({
                            title: 'Alert',
                            content: "Data acquisition failed",//数据获取失败
                            showCancel : false,
                            confirmText : "Ok"
                        })
                        wx.hideLoading()
                    },
                })
            },
            fail : function(res){
                console.log("扫码已关闭", res)
            }
        })
	},

    submit : function(){
		const status = this.findActivityStatus()
		if(!status){
			return
		}
		let useEBState = 0
		if(this.data.activityEvent.activity_ID != undefined){
			useEBState = this.data.activityEvent.useEB_state
		}
		if(useEBState == 0){
			wx.showModal({
				title : "Alert",
				content : "The Eagle Buck function not enabled",//使用EB功能未开启
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}
		if(this.data.transferUser.is_Disable == 1){
			wx.showModal({
				title : "Alert",
				content : "The account has been disabled and cannot be traded",//账号已被禁用，无法进行交易
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}

        if(this.data.inputNumber < 1){
            wx.showToast({
                title : "Please fill in the transfer quantity",//请填写转账数量
                icon : "none",
                duration : 2000
            })
            return
        }
        const that = this
        const eagleBucksBoothPay = app.globalData.eagleBucksBoothPay
        if(this.data.inputNumber > eagleBucksBoothPay){
            wx.showModal({
                title : "Alert",
                content : "The limit of Back(s) in each transaction is "+eagleBucksBoothPay+", please enter another quantity",//每笔交易的Ebs限额为xxx，请输入其他数量
                showCancel : false,
                confirmText : "Ok"
            })
            return
		}
        wx.showModal({
			content : "The quantity of Back(s) you wish to collect is "+this.data.inputNumber+".",//您希望转移的EB数量为xxx
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
                    wx.cloud.callFunction({
                        name: "eagleBucks",
                        data: {
							recordType:3,//1购买EB，2转账，3摊位付款
							boothType:1,//摊位类型:1摊位付款，2灌水付款，3抽奖付款
                            ebNumber: that.data.inputNumber,
							transferOpenId : that.data.transferOpenId,
							transferBraceletQR : that.data.transferBraceletQR,
							boothId : that.data.boothInfo.booth_ID
                        },
                        success(res) {
							wx.hideLoading()
                            if(res.result == 1000){
                                wx.showModal({
                                    title : "Alert",
                                    content : "Successfully collected "+that.data.inputNumber+" Buck(s)",
                                    showCancel : false,
                                    confirmText : "Ok",
                                    success : function(res){
                                        that.cancel()
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
                                    content : "Insufficient balance in the other party's account",//对方账户余额不足
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
                                content : "Fail",
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
		this.setData({
			transferOpenId : "",
			transferUser : {},
			transferBraceletQR : "",
			isTransfer : false,
		})
	},
	
	searchBtn : function(){
		const that = this
		wx.showLoading({title:'Loading', mask : true})
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select a.*, b.if_ID as sender_IFID, c.bl_ID as sender_BLID, d.if_ID as recipient_IFID from eBRecord a "
						+ "left join Users b on a.sender_open_id=b.open_ID "
						+ "left join Bracelets c on a.sender_qr_link=c.qr_link "
						+ "left join Users d on a.recipient_open_id=d.open_ID "
						+ "where (a.type=3 or a.type=4) and a.booth_type=1 "
						+ "and a.booth_ID='"+that.data.boothInfo.booth_ID+"' and a.is_return=0 "
						+ "order by datetime desc"
			},
			success : function(res){
				wx.hideLoading()
				that.setData({
					recordList : res.result
				})
			},
			fail : function(res){
				wx.hideLoading()
				console.log("searchBtn fail", res)
				// wx.showToast({
                //     title: "Load timeout",//获取超时
                //     icon : "none"
                // })
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
	},

	loadBoothData : function(){
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
		wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothData where booth_ID in (select booth_id from BoothManagers where open_id='"+this.data.openid+"' and status=1)"
            },
            success : function(res){
				wx.hideLoading()
				console.log("BoothData res", res)
				if(res.result == null || res.result.length == 0){
					wx.showModal({
						title: 'Alert',
						content: 'No booth data was found',//没有查询到摊位数据
						showCancel: false,
						confirmText: 'Ok',
						complete: (res) => {
							if (res.confirm) {
								wx.navigateBack()
							}
						}
					})
					return
				}
                that.setData({
                    boothInfo : res.result[0]
				})
            },
            fail : function(res){
				console.log(res)
				wx.hideLoading()
				wx.showModal({
					title: 'Alert',
					content: 'Booth data acquisition failed, do you want to reload？',//摊位数据获取失败，是否重新加载
					cancelText: 'Cancel',
					confirmText: 'Ok',
					complete: (res) => {
						if (res.confirm) {
							that.loadBoothData()
						}
						if (res.cancel) {
							wx.navigateBack()
						}
					}
				})
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
        })
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
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
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
				wx.hideLoading()
				// wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
        })
	},
	
	getActivityStatus() {
		const that = this
		wx.cloud.callFunction({
			name : "getActivityStatus",
            success : function(res){
			    that.setData({
					activityStatus : res.result,
				})
            },
            fail : function(res){
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
		this.onShow()
		this.searchBtn()
		this.loadBoothData()
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