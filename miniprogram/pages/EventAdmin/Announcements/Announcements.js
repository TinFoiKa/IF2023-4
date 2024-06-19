// pages/EventAdmin/Announcements/Announcements.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        AnnouncementList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    addAnnouncement : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/Announcements/EditAnnouncement/EditAnnouncement',
        })
    },

    toEditAnnouncement : function(event){
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/EventAdmin/Announcements/EditAnnouncement/EditAnnouncement?id=' + id,
        })
    },

    deleteAnnouncement : function(event){
        const that = this
        wx.showModal({
            title : "Alert",
            content : "Are you sure to delete it?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
                    let id = event.currentTarget.dataset.id
                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "delete from Announcements where notice_ID='"+id+"'"
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
                                title: 'fail',
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

    changeTop : function(event){
        const that=this
        let id = event.currentTarget.dataset.id
        let status = event.detail.value
        let topTimeSql = ""
        if(status){
            topTimeSql = ", top_time=NOW()"
        }else{
            topTimeSql = ", top_time=null"
        }
        console.log(status)
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "update Announcements set is_top="+status+topTimeSql+" where notice_ID='"+id+"'"
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
                sql : "select * from Announcements order by is_top desc, top_time desc, release_time desc"
            },
            success : function(res){
                that.setData({
                    AnnouncementList : res.result
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