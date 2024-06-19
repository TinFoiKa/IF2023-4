// pages/PTSACashier/Scan/Scan.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		userOpenid : "",
		userInfo : {},
		isShowPaymentRecord : false,
		paymentRecordList : [],
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
	},
	
	scan : function(){
		const that = this
        wx.scanCode({
            scanType : "qrCode",
            success : function(res){
                let qrcode = res.result
				//let qrcode = "89bbf5f6-a82f-4c61-9882-cf2769c56b92"//未绑定手环二维码
				//let qrcode = "25901fc1-9b26-4f29-8973-023223465de8"//已绑定手环二维码
				//let qrcode = "1aaa"//不存在的用户ifqr
				// let qrcode = "953fbd68-c785-416c-805a-fd33ac677e0f"//我的ifqr
                wx.showLoading({title:'Loading', mask : true})
                wx.cloud.callFunction({
                    name: "executeSql",
                    data: {
                        sql : "select b.*, a.linked_open_id, a.is_active from Bracelets a left join Users b on a.linked_open_id=b.open_ID where a.qr_link='"+qrcode+"'"
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
										that.setData({
											userOpenid : res.result[0].open_ID,
											userInfo : res.result[0],
											isShowPaymentRecord : true,
											paymentRecordList : []
										})
										wx.hideLoading()
										that.loadPaymentRecord()
                                    }
                                },
                                fail : function(res){
                                    console.log("fail", res)
                                    wx.hideLoading()
                                    wx.showModal({
                                        title: 'Alert',
                                        content: "Data acquisition failed",//数据获取失败
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
									that.setData({
										userOpenid : bracelet.linked_open_id,
										userInfo : bracelet,
										isShowPaymentRecord : true,
										paymentRecordList : []
									})
									wx.hideLoading()
									that.loadPaymentRecord()
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

	loadPaymentRecord : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select ID, eb_number, amount, datetime from eBRecord where type=1 and sender_open_id='"+this.data.userOpenid+"' and is_return=0 and wechatPaymentState=1 order by datetime desc"
			},
			success : function(res){
				that.setData({
					paymentRecordList : res.result
				})
				wx.hideLoading()
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
			}
		})
	},

	deleteRecord : function(event){
		const that = this
		let recordId = event.currentTarget.dataset.id
		let eb = event.currentTarget.dataset.eb
		let amount = event.currentTarget.dataset.amount
		wx.showModal({
            title : "Alert",
            content : "This Eagle Bucks’ purchase will be reversed, "+eb+" Bucks will be deducted from the Visitor’s account, and "+amount+" RMB will be refunded to the Visitor by PTSA Cashier offline. Are you sure to proceed?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title:'Loading', mask : true})
					wx.cloud.callFunction({
						name : "cloudfunction",
						data : {
							type : "removeEBRecord",
							data : {
								recordId : recordId,
								ebNumber : eb
							}
						},
						success : function(res){
							wx.hideLoading()
							if(res.result == 1000){
								wx.showModal({
									title: 'Alert',
									content: "Eagle Bucks are deducted from the Visitor’s account successfully, please refund "+amount+" RMB to the visitor offline. ",//操作成功，请退还amount元
									showCancel : false,
									confirmText : "Ok",
									success : function(res){
										if(res.confirm){
											that.setData({
												userOpenid : "",
												userInfo : {},
												isShowPaymentRecord : false,
												paymentRecordList : []
											})
										}
									}
								})
							}else if(res.result == 1001){
								wx.showModal({
									title: 'Alert',
									content: "ERROR",//出现错误
									showCancel : false,
									confirmText : "Ok"
								})
							}else if(res.result == 1002){
								wx.showModal({
									title: 'Alert',
									content: "No consumption records found",//没有查询到消费记录
									showCancel : false,
									confirmText : "Ok"
								})
							}else if(res.result == 1003){
								wx.showModal({
									title: 'Alert',
									content: "This consumption record has been refunded, please do not repeat the operation",//此消费记录已退款，请勿重复操作
									showCancel : false,
									confirmText : "Ok"
								})
							}else if(res.result == 1004){
								wx.showModal({
									title: 'Alert',
									content: "Insufficient account balance",//账户余额不足
									showCancel : false,
									confirmText : "Ok"
								})
							}
						},
						fail : function(res){
							wx.hideLoading()
							console.log("fail", res)
							wx.showModal({
								title: 'Alert',
								content: "fail",//操作失败
								showCancel : false,
								confirmText : "Ok"
							})
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