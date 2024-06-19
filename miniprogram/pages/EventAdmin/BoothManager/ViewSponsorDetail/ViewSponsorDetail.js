// pages/EventAdmin/BoothManager/ViewSponsorDetail/ViewSponsorDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sponsorType : 0,
        companyId : 0,
        companyName : "",
        description : "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            companyId : options.companyId
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
                sql : "select * from Sponsors where sponsor_ID='"+this.data.companyId+"'"
            },
            success : function(res){
                that.setData({
                    sponsorType : res.result[0].sponsor_type,
                    companyName : res.result[0].sponsor_name,
                    description : res.result[0].sponsor_description,
                    disabled : false
                })
            },
            fail : function(res){
                that.setData({
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