// pages/BoothLists/BoothLists.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		activityEvent : {},
		logoList : [
			"cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/logo_1.png",
			"cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/logo_2.png",
			"cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/logo_3.png",
		]
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
		this.getActivityEvent()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
		
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
		this.getActivityEvent()
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

    },

    foods : function(){
        wx.navigateTo({
          url: '/pages/BoothLists/Foods/Foods',
        })
    },

    games : function(){
        wx.navigateTo({
          url: '/pages/BoothLists/Games/Games',
        })
    },

    performances : function(options){
        wx.navigateTo({
          url: '/pages/BoothLists/Shows/Shows?boothType='+options.currentTarget.dataset.type,
        })
    },

    sponsors : function(){
        wx.navigateTo({
          url: '/pages/BoothLists/Sponsors/Sponsors',
        })
    },

    vendors : function(options){
		let type = options.currentTarget.dataset.type
        wx.navigateTo({
          url: '/pages/BoothLists/VendorsList/VendorsList?type='+type,
        })
    },
})