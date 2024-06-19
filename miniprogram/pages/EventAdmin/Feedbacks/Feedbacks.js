// pages/EventAdmin/Feedbacks/Feedbacks.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        feedbackList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    toViewFeedbacks : function(event){
        console.log("event",event)
        let feedbackId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/EventAdmin/Feedbacks/ViewFeedbacks/ViewFeedbacks?id='+feedbackId,
        })
    },

    delete : function(event){
        const that = this
        let feedbackId = event.currentTarget.dataset.id
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
                            sql : "delete from Feedbacks where ID='"+feedbackId+"'"
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
                sql : "select * from Feedbacks order by create_time desc"
            },
            success : function(res){
                that.setData({
                    feedbackList : res.result
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