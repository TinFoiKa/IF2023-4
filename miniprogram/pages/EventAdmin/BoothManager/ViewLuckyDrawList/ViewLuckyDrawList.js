// pages/EventAdmin/BoothManager/ViewLuckyDrawList/ViewLuckyDrawList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		LuckyDrawList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
	},
	
	ViewLuckyDraw : function(event){
		if(event.currentTarget.dataset.boothid == undefined){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/ViewLuckyDraw/ViewLuckyDraw',
		  	})
		}else{
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/ViewLuckyDraw/ViewLuckyDraw?boothId='+event.currentTarget.dataset.boothid,
		  	})
		}
	},

	deleteLuckyDraw : function(event){
		const that = this
		let boothId = event.currentTarget.dataset.boothid
		wx.showModal({
            title : "",
            content : "Are you sure to delete?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title : 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "cloudfunction",
						data : {
							type : "deleteBooth",
							boothId : boothId,
							boothType : 3
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
								title: 'SUCCESS',
								icon : 'success'
							})
							that.onShow()
						},
						fail : function(res){
							wx.hideLoading()
							wx.showToast({
								title: 'Delete Timeout',
								icon : 'error'
							})
						},
					})
                }
            }
        })
	},

	toEditLuckyDrawMgr : function(event){
		let boothId = event.currentTarget.dataset.boothid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditLuckyDrawMgr/EditLuckyDrawMgr?boothId=' + boothId,
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
				sql : "select * from LuckyDraw order by drawprize_time asc"
			},
			success : function(res){
				if(res.result.length > 0){
					that.setData({
						LuckyDrawList : res.result
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