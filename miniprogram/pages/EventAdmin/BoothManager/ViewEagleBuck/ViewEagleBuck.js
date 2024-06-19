// pages/EventAdmin/BoothManager/ViewEagleBuck/ViewEagleBuck.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        EagleBuckList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    changeStatus : function(event){
        const that=this
        let ebId = event.currentTarget.dataset.ebid
        let status = event.detail.value
        console.log(status)
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "update EagleBuckCommodity set eb_status="+status+" where eb_ID='"+ebId+"'"
            },
            success : function(res){
                wx.hideLoading()
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'fail',
                    icon : 'error'
                })
            },
            complete : function(){
                console.log("重新加载")
                that.onShow()
            }
        })
	},
	
	addEagleBuck : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditEagleBuck/EditEagleBuck',
        })
    },

    toEditEagleBuck : function(event){
        let ebId = event.currentTarget.dataset.ebid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditEagleBuck/EditEagleBuck?ebId=' + ebId,
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
                sql : "select * from EagleBuckCommodity"
            },
            success : function(res){
                that.setData({
                    EagleBuckList : res.result
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