// pages/EventAdmin/Feedbacks/ViewFeedbacks/ViewFeedbacks.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		id : 0,
        feedback : {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			id : options.id
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
		const that = this
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Feedbacks a left join Users b on a.open_ID=b.open_ID where a.ID='"+this.data.id+"'"
            },
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        feedback : res.result[0]
                    })
                }
            },
            fail : function(res){
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
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
		this.onShow()
		// wx.stopPullDownRefresh()
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