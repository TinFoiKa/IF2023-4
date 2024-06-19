// pages/BoothLists/Sponsors/Sponsors.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sponsorsList : []
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
		//Search for suppliers or student market place
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Sponsors where sponsor_type=1"
            },
            success : function(res){
                that.setData({
                    sponsorsList : res.result
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