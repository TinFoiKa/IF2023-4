// pages/EventAdmin/BoothManager/ViewSponsor/ViewSponsor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight:500,
        sponsorType : 0,
        sponsorTypeName : "",
        companyList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            sponsorType : options.sponsorType,
		})
		if(options.sponsorType == 1){
			this.setData({sponsorTypeName : "Sponsors"})
		}else if(options.sponsorType == 2){
			this.setData({sponsorTypeName : "Vendors"})
		}else if(options.sponsorType == 3){
			this.setData({sponsorTypeName : "Student Market Place"})
		}
    },

    deleteSponsor : function(event){
        const that = this
        let companyId = event.currentTarget.dataset.companyid
        wx.showModal({
            title : "",
            content : "Are you sure to delete?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
                    wx.showLoading({title : 'Loading', mask : true})
                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "delete from Sponsors where sponsor_ID='"+companyId+"'"
                        },
                        success : function(res){
                            wx.hideLoading()
                            wx.showToast({
                                title: 'SUCCESS',
                                icon : 'success'
                            })
                        },
                        fail : function(res){
                            wx.hideLoading()
                            wx.showToast({
                                title: 'Delete failed',
                                icon : 'error'
                            })
                        },
                        complete : function(){
                            console.log("重新加载")
                            that.onShow()
                        }
                    })
                }
            }
        })
    },

    toEditSponsor : function(event){
        let companyId = event.currentTarget.dataset.companyid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditSponsor/EditSponsor?companyId=' + companyId,
        })
    },

    toViewSponsorDetail : function(event){
        let companyId = event.currentTarget.dataset.companyid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewSponsorDetail/ViewSponsorDetail?companyId=' + companyId,
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
                sql : "select * from Sponsors where sponsor_type='"+this.data.sponsorType+"'"
            },
            success : function(res){
                that.setData({
                    companyList : res.result,
                })
            },
            fail : function(res){
                wx.showToast({
                    title: 'Data error',
                    icon : 'error'
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