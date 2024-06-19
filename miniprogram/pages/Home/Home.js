// pages/Home/Home.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityEvent : {},
        mapUrl : "",
		videoUrl : "",
		TopAnnouncement: "",//&emsp;
        AnnouncementList : [],
		duration: 0, //水平滚动总时间
	},

	view1:function(){
		console.log("view1")
	},
	view2:function(){
		console.log("view2")
	},
	view3:function(){
		console.log("view3")
	},
	view4:function(){
		console.log("view4")
	},
	view5:function(){
		console.log("view5")
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    toEditFeedbacks : function(){
        wx.navigateTo({
            url: '/pages/Home/EditFeedbacks/EditFeedbacks',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
		
	},
	
    /**
	 * 生命周期函数--监听页面显示
     */
	onShow: function () {
		this.getActivityEvent()
		this.getTopNotice()
		this.getNotice()
	},

	getTopNotice : function(){
		const that = this
		wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Announcements where is_top=1 and notice_status=1 order by top_time desc limit 1"
            }, 
            success : function(res){
				let notice = ""
				if(res.result != null && res.result.length > 0){
					for(let i=0;i<res.result.length;i++){
						let ann = res.result[i]
						if(notice.length > 0){
							notice += "&emsp;&emsp;&emsp;&emsp;"
						}
						notice += ann.notice_content
					}
				}
                that.setData({
                    TopAnnouncement : notice
				})
				wx.createSelectorQuery().select('#txt').boundingClientRect(function (rect) {
					console.log("rect", rect)
					if(rect != null){
						let duration = rect.width * 0.04;//滚动文字时间,滚动速度为0.08s/px
						that.setData({
							duration: duration,
						})
					}
				}).exec()
            },
            fail : function(res){
				console.log("home getTopNotice Load timeout", res)
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
        })
	},

	getNotice : function(){
		const that = this
		wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Announcements where is_top=0 and notice_status=1 order by release_time desc"
            }, 
            success : function(res){
                that.setData({
                    AnnouncementList : res.result
				})
            },
            fail : function(res){
				console.log("home getNotice Load timeout", res)
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
        })
	},

	getActivityEvent : function(){
		var that = this;
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        activityEvent : res.result[0],
                        mapUrl : res.result[0].mapUrl,
                        videoUrl : res.result[0].videoUrl
					})
				}
            },
            fail : function(res){
				console.log("home Load timeout", res)
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
		})
	},
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
		
    },
    
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
		this.getTopNotice()
		this.getNotice()
		app.stopPullDownRefresh()
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
		
    },

    tutorial : async function(){
        wx.navigateTo({
          url: '/pages/event/event',
        })
    }
})