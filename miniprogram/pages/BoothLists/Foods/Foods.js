// pages/BoothLists/Foods/Foods.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        foodList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    foodMenu : function(event){
        let boothId = event.currentTarget.dataset.value
        let boothNo = event.currentTarget.dataset.no
        let boothName = event.currentTarget.dataset.name
        wx.navigateTo({
            url: '/pages/BoothLists/Foods/foodMenu/foodMenu?boothId=' + boothId + "&boothNo=" + boothNo + "&boothName=" + boothName,
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
		//Search for food booths
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothData where booth_type='1'"
            },
            success : function(res){
                that.setData({
                    foodList : res.result
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