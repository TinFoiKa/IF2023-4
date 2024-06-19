// pages/BoothLists/Foods/foodMenu/foodMenu.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		boothId : "",
        boothNo : "",
        boothName : "",
        menuList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
			boothId : options.boothId,
            boothNo : options.boothNo,
            boothName : options.boothName
        })
	},
	
	//View menu image
	showImage : function(options){
		const imageUrl = options.currentTarget.dataset.url
		wx.previewImage({
		  	urls: [imageUrl],
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
		//Search for food booth menu
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothMenu where booth_ID=" + this.data.boothId
            },
            success : function(res){
                that.setData({
                    menuList : res.result
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