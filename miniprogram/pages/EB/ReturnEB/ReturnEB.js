// pages/EB/ReturnEB/ReturnEB.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		boothQRCode : "",
		boothData : {},
		inputNumber : 1,
		shoppingRecordList : [],
	},
	
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			boothQRCode : options.qrCode
		})
	},
	
	changeNumber : function(e){
        let value = e.detail.value
        this.setData({
            inputNumber : value
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
	
	submit : function(){
		if(JSON.stringify(this.data.boothData) == "{}"){
			wx.showToast({
                title : "Data error, please try again",
                icon : "none",
                duration : 2000
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
        const that = this
        const eagleBucksBoothPay = app.globalData.eagleBucksBoothPay
        if(this.data.inputNumber > eagleBucksBoothPay){
            wx.showModal({
                title : "Alert",
                content : "The limit of Eagle Buck(s) in each transaction is "+eagleBucksBoothPay+", please enter another quantity",
                showCancel : false,
                confirmText : "Ok"
            })
            return
        }
        wx.showModal({
            content : "The quantity of Eagle Buck(s) you wish to return is "+this.data.inputNumber+".",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title:'Loading', mask : true})
                    wx.cloud.callFunction({
                        name: "cloudfunction",
                        data: {
                            type : 'returnUserEagleBucks',
                            boothId:that.data.boothData.booth_ID,
                            ebNumber: that.data.inputNumber,
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
                                    content : "The booth does not exist, please return and try again",//摊位不存在，请返回重试
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }else if(res.result == 1003){
                                wx.showModal({
                                    title : "Alert",
                                    content : "Insufficient booth balance",//摊位余额不足
                                    showCancel : false,
                                    confirmText : "Ok"
                                })
                            }
                        },
                        fail(res) {
							console.log("退款失败", res)
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
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from BoothData where ifqr='"+this.data.boothQRCode+"'"
			},
			success : function(res){
				that.setData({
					boothData : res.result[0]
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

		this.loadRecord()
	},
	
	loadRecord(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select a.* from eBRecord a inner join BoothData b on a.booth_ID=b.booth_ID where a.type=3 and a.booth_type=1 and b.ifqr='"+this.data.boothQRCode+"' order by a.datetime desc"
			},
			success : function(res){
				that.setData({
					shoppingRecordList : res.result
				})
				wx.stopPullDownRefresh()
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
		this.loadRecord()
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