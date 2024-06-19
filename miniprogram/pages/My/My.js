// index.js
// 获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
		userInfo: {},
		luckyDrawTotalPayment : 0,
		dunkTankTotalPayment : 0,
		braceletNumber : 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    showMore : function(event){
        let type = event.currentTarget.dataset.type
        if(type == 1){
            wx.navigateTo({
                url: '/pages/My/MyEagleBuckShowMore/MyEagleBuckShowMore',
            })
        }else if(type == 2){
			wx.navigateTo({
                url: '/pages/My/MyDunkTankPaymentShowMore/MyDunkTankPaymentShowMore',
            })
        }else if(type == 3){
			wx.navigateTo({
                url: '/pages/My/MyLuckyDrawPaymentShowMore/MyLuckyDrawPaymentShowMore',
            })
        }else if(type == 4){
			wx.navigateTo({
                url: '/pages/EB/QRs/QRs',
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const that = this
        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "getUserByOpenId"
            },
            success : function(res){
                that.setData({
					userInfo : res.result[0]
                })
            },
            fail : function(res){
                console.log("res", res)
            }
		})
		
		wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "getMyQrList"
            },
            success : function(res){
				if(res.result != null){
					that.setData({
						braceletNumber : res.result.length
					})
				}
            },
			fail : function(res){
				console.log(res)
			}
        })

		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select sum(amount) as sumAmount from eBRecord where type=3 and is_return=0 and booth_type='3' and sender_open_id='"+this.data.openId+"' and wechatPaymentState=1"
			},
			success : function(res){
				if(res.result != null && res.result[0].sumAmount != null){
					that.setData({
						luckyDrawTotalPayment : res.result[0].sumAmount
					})
				}
			},
			fail : function(res){
				console.log(res)
			},
		})
		
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select sum(amount) as sumAmount from eBRecord where type=3 and is_return=0 and booth_type='2' and sender_open_id='"+this.data.openId+"' and wechatPaymentState=1"
			},
			success : function(res){
				if(res.result != null && res.result[0].sumAmount != null){
					that.setData({
						dunkTankTotalPayment : res.result[0].sumAmount
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
	
	logout : function(){
		wx.showModal({
			title : "Alert",
			content : "Are you sure to exit？",
			cancelText : "Cancel",
			confirmText : "Ok",
			success : function(res){
				if(res.confirm){
					wx.clearStorageSync("openid")
					wx.reLaunch({
					  	url: '/pages/index/index',
					})
				}
			}
		})
	},

	ShowMyQR : function(){
		wx.navigateTo({
			url: '/pages/EB/MyQR/MyQR',
		})
	},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onShow()
		app.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        
    }
})