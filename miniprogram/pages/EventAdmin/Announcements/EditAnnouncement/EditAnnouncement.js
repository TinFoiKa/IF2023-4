// pages/EventAdmin/Announcements/EditAnnouncement/EditAnnouncement.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        annId : 0,
        annObj : {},
        inputContent : ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        if(options.id != undefined){
            this.setData({
                annId : options.id
            })
        }
    },

    inputContent : function(res){
        console.log(res)
        this.setData({
            inputContent : res.detail.value
        })
    },

    submit : function(res){
        if(this.data.inputContent.length == 0){
            wx.showToast({
                title: 'Notice content cannot be empty',
                icon : "none"
            })
            return
		}
		wx.showLoading({title: 'Loading', mask : true})
        let status = res.currentTarget.dataset.value
        let sql = "";
        if(this.data.annId == undefined || this.data.annId == 0){
            sql = "insert into Announcements (notice_content, notice_status, release_time) values ('"+this.data.inputContent+"', '"+status+"', NOW())";
        }else{
            sql = "update Announcements set notice_content='"+this.data.inputContent+"', notice_status='"+status+"', release_time=NOW() where notice_ID='"+this.data.annId+"'";
        }
        console.log("sql", sql)
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : sql
            },
            success : function(res){
				wx.hideLoading()
                wx.showToast({
					title: 'SUCCESS',
					icon : 'success',
					mask : true,
					duration : 3500,
				})
				setTimeout(() => {
					wx.navigateBack()
				}, 3000)
            },
            fail : function(res){
				wx.hideLoading()
                wx.showToast({
                    title: "request timeout",
                    icon : "error",
                    duration : 3500
                })
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
        if(this.data.annId != 0){
            const that = this
            wx.cloud.callFunction({
                name : "executeSql",
                data : {
                    sql : "select * from Announcements where notice_ID='"+this.data.annId+"'"
                },
                success : function(res){
                    that.setData({
                        inputContent : res.result[0].notice_content,
                        annObj : res.result[0]
                    })
                },
                fail : function(res){
                    wx.showToast({
                        title: "Load timeout",
                    	icon : "error"
                    })
                }
            })
        }
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
		wx.stopPullDownRefresh()
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