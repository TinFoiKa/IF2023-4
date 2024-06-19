// pages/event/event.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo : {},
        isBoothManager : false,
        openid : wx.getStorageSync('openid')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    toBoothManager : function(){
        wx.navigateTo({
            url: '/pages/BoothMgr/BoothMgr',
        })
    },

    toCashier : function(){
        wx.navigateTo({
            url: '/pages/PTSACashier/PTSACashier',
        })
    },

    toEventAdmin : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/EventAdmin',
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
            name: "cloudfunction",
            data: {
                type: "getUserByOpenId"
            },
            success: function (res) {
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        userInfo : res.result[0]
                    })
                }
            }
        })

        wx.cloud.callFunction({
            name: "executeSql",
            data: {
                sql : "select * from BoothManagers where open_id='"+this.data.openid+"' and status=1"
            },
            success: function (res) {
				//booth_type：摊位类型，1食物/游戏/表演，2灌水游戏，3抽奖
                if(res.result != null && res.result.length > 0 && res.result[0].booth_type == 1){
                    that.setData({
                        isBoothManager : true
                    })
                }
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