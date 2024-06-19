// pages/PTSACashier/Booth/Booth.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
		searchInp : "",
		boothList : [],
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
	
	searchBtn : function(){
		const that = this
		console.log(this.data.searchInp)
		let sql = ""
		if(this.data.searchInp != ""){
			sql = "and booth_no like '%"+this.data.searchInp+"%' or booth_name like '%"+this.data.searchInp+"%'"
		}
		wx.showLoading({title:'Loading', mask : true})
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from BoothData where booth_type in (1,2) "+sql+" order by booth_type asc"
			},
			success : function(res){
				wx.hideLoading()
				that.setData({
					boothList : res.result
				})
			},
			fail : function(res){
				wx.hideLoading()
				console.log("searchBtn fail", res)
				wx.showToast({
                    title: "Data acquisition failed",//获取失败
                    icon : "none"
                })
			}
		})
	},

	viewBoothQRCode : function(event){
		let boothId = event.currentTarget.dataset.id
		wx.navigateTo({
		  	url: '/pages/PTSACashier/ViewBoothQRCode/ViewBoothQRCode?boothId='+boothId,
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
		this.searchBtn()
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
		this.searchBtn()
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