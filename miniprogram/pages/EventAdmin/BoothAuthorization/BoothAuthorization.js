// pages/EventAdmin/BoothAuthorization/BoothAuthorization.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		searchInp : "",
        boothNo : "",
        boothName : "",
        boothMgrIfid : "",
        dataList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    searchBtn : function(){
        this.queryBoothData()
    },
	
	toEditBoothMgr : function(event){
        let boothId = event.currentTarget.dataset.boothid
        let boothno = event.currentTarget.dataset.boothno
        let boothname = event.currentTarget.dataset.boothname
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditBoothMgr/EditBoothMgr?boothId=' + boothId + '&boothNo=' + boothno + '&boothName=' + boothname,
        })
	},
	
	toEditDunkTankMgr : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditDunkTankMgr/EditDunkTankMgr',
        })
	},

	toEditLuckyDrawMgr : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditLuckyDrawMgr/EditLuckyDrawMgr',
        })
	},

	importBoothMgr : function(){
		wx.navigateTo({
            url: '/pages/EventAdmin/BoothAuthorization/ImportBoothMgr/ImportBoothMgr',
        })
	},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
		this.queryBoothData()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
		
	},
	
	queryBoothData : function(){
		wx.showLoading({title : 'Loading', mask : true})
		let sqlStr = ""
		if(this.data.searchInp != "" || this.data.searchInp.length > 0){
			sqlStr = "and (a.booth_no like '%"+this.data.searchInp+"%' or a.booth_name like '%"+this.data.searchInp+"%')"
		}
		const that = this
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "select distinct a.* from BoothData a left join BoothManagers b on a.booth_ID=b.booth_id left join Users c on b.open_id=c.open_ID where a.booth_type in (1, 2) "+sqlStr+" order by a.booth_type asc, a.booth_ID asc"
            },
            success : function(res){
				wx.hideLoading()
                that.setData({
                    dataList : res.result
                })
            },
            fail : function(res){
				wx.hideLoading()
                console.log("BoothAuthorization onLoad fail")
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