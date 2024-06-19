// pages/EventAdmin/BoothManager/ViewDunkTank/ViewDunkTank.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        boothList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    addDunkTank : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditDunkTank/EditDunkTank',
        })
    },

    toEditDunkTank : function(event){
		let boothId = event.currentTarget.dataset.boothid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditDunkTank/EditDunkTank?boothId=' + boothId,
        })
	},
	
	toEditDunkTankMgr : function(event){
        let boothId = event.currentTarget.dataset.boothid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditDunkTankMgr/EditDunkTankMgr?boothId=' + boothId,
        })
	},

    deleteDunkTank : function(event){
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
							boothType : 2
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
								title: 'Fail',
								icon : 'error'
							})
						},
					})
                }
            }
        })
    },

    deleteFile(fileID) {
        console.log("删除文件", fileID)
        wx.cloud.deleteFile({
            fileList: [fileID],
            success(res) {
                console.log('Deleted file successfully')
            },
            fail(err) {
                console.log('Failed to delete file', err)
            }
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
                sql : "select * from DunkTank"
            },
            success : function(res){
                that.setData({
                    boothList : res.result
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