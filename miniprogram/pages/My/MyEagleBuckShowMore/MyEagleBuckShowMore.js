// pages/My/MyEagleBuckShowMore/MyEagleBuckShowMore.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
        userInfo : {},
		recordList : [],
		eagleBuckSubtotal : {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
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
		console.log("openId", this.data.openId)
		const that = this
		wx.cloud.callFunction({
			name : "getEagleBuckSubtotal",
			success : function(res){
				that.setData({
					eagleBuckSubtotal : res.result
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

        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "getUserByOpenId",
            },
            success : function(res){
                that.setData({
                    userInfo : res.result[0]
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

		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from eBRecord where (sender_open_id='"+this.data.openId+"' or recipient_open_id='"+this.data.openId+"') and ((type=1 and wechatPaymentState=1) or type=2 or (type=3 and booth_type=1) or type=4 or type=5) order by datetime desc"
			},
			success : function(res){
				that.setData({
					recordList : res.result
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