// pages/My/MyLuckyDrawPaymentShowMore/MyLuckyDrawPaymentShowMore.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
        luckyDrawTotalPayment : 0,
        recordList : []
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
		const that = this
        wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select sum(amount) as sumAmount from eBRecord where type=3 and is_return=0 and booth_type='3' and sender_open_id='"+this.data.openId+"' and wechatPaymentState=1"
			},
			success : function(res){
				if(res.result[0].sumAmount != null){
					that.setData({
						luckyDrawTotalPayment : res.result[0].sumAmount
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

		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select a.*, b.booth_name as boothName from eBRecord a inner join LuckyDraw b on a.booth_ID=b.booth_ID where a.sender_open_id='"+this.data.openId+"' and a.type=3 and a.booth_type=3 and a.wechatPaymentState=1 order by a.datetime desc"
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