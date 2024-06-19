// pages/Home/EditFeedbacks/EditFeedbacks.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
		feedbackContent : "",
		fcr_string: "500",
        send_button_disabled: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
			xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
        })
	},
	
	FeedbackInput: function(text) {
        let textinput = text.detail.value
        this.setData({ 
            fcr_string: (500 - textinput.length).toString(),
			feedback: textinput
		})
		if(textinput.length == 0){
			this.setData({
				send_button_disabled: true
			})
		}else{
			this.setData({
				send_button_disabled: false
			})
		}
    },

    send : function(){
        if(this.data.feedbackContent == ""){
            wx.showToast({
                title: 'Feedback content cannot be empty',
                icon : "none"
            })
            return
		}
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "saveFeedbacks",
                feedbackContent : this.data.feedbackContent
            },
            success : function(res){
				wx.hideLoading()
                wx.showToast({
                    title: 'SUCCESS',
                    icon : "success",
                    duration : 3500,
                    success : function(){
                        that.setData({
                            feedbackContent : ""
                        })
                    }
				})
				setTimeout(() => {
					wx.navigateBack()
				}, 3000)
            },
            fail : function(res){
				wx.hideLoading()
				wx.showToast({
                    title: 'fail',
                    icon : 'error'
                })
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