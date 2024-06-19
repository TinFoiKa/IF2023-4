// pages/EventAdmin/BoothManager/BoothManager.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		xheight:500,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
		baseDataStatus : {},
		videoUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		mapUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		foodUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		gameUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		performancesMainUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		performancesHillsideUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		sponsorUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		vendorUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
		studentMarketPlaceUrl : "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/icon_empty.png",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
            xheight:(wx.getSystemInfoSync().windowHeight-150)+'px'
        })
	},
	
	editEventSetting : function(){
		wx.navigateTo({
            url: '/pages/EventAdmin/EventSetting/EventSetting',
        })
	},

    toImportBooth : function(event){
        let boothType = event.currentTarget.dataset.boothtype
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ImportBooth/ImportBooth?boothType=' + boothType,
        })
    },

    toViewBoothList : function(event){
        let boothType = event.currentTarget.dataset.boothtype
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewBooth/ViewBooth?boothType=' + boothType,
        })
	},

    toImportDunkTank : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ImportDunkTank/ImportDunkTank',
        })
    },

    toViewDunkTankList : function(event){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewDunkTank/ViewDunkTank',
        })
	},

	toViewLuckyDrawCommodity : function(event){
		wx.navigateTo({
			url: '/pages/EventAdmin/BoothManager/ViewLuckyDrawCommodity/ViewLuckyDrawCommodity',
        })
    },
	
	toViewLuckyDrawList : function(event){
		wx.navigateTo({
			url: '/pages/EventAdmin/BoothManager/ViewLuckyDrawList/ViewLuckyDrawList',
        })
    },

    toImportSponsor : function(event){
        let sponsorType = event.currentTarget.dataset.sponsortype
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ImportSponsor/ImportSponsor?sponsorType=' + sponsorType,
        })
    },

    toViewSponsorList : function(event){
        let sponsorType = event.currentTarget.dataset.sponsortype
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewSponsor/ViewSponsor?sponsorType=' + sponsorType,
        })
    },

    toViewEagleBuckList : function(event){
        let sponsorType = event.currentTarget.dataset.sponsortype
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewEagleBuck/ViewEagleBuck',
        })
	},

	ActicityLaunch : function(){
		const that = this
		wx.showModal({
			title : "Alert",
			content : "Are you sure to start the activity?",
			cancelText : "Cancel",
			confirmText : "Ok",
			success : function(res){
				if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "executeSql",
						data : {
							sql : "update ActivityEvent set activity_status=1 "
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
                                title: 'SUCCESS',
                                icon : 'success',
								mask : true,
								duration : 3500,
							})
							that.getActivityEvent()
						},
						fail : function(res){
							console.log("ActicityLaunch res", res)
							wx.hideLoading()
							wx.showToast({
                                title: 'Fail',
                                icon : 'error',
								mask : true,
								duration : 3500,
							})
						}
					})
				}
			}
		})
	},

	ActicityEnd : function(){
		const that = this
		wx.showModal({
			title : "Alert",
			content : "Are you sure to terminate the activity?",
			cancelText : "Cancel",
			confirmText : "Ok",
			success : function(res){
				if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "executeSql",
						data : {
							sql : "update ActivityEvent set activity_status=2 "
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
                                title: 'SUCCESS',
                                icon : 'success',
								mask : true,
								duration : 3500,
							})
							that.getActivityEvent()
						},
						fail : function(res){
							wx.hideLoading()
							wx.showToast({
                                title: 'Fail',
                                icon : 'error',
								mask : true,
								duration : 3500,
							})
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
		this.getActivityEvent()
		this.base()
	},
	
	getActivityEvent(){
		const that = this
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
                wx.hideLoading()
                if(res.result != null && res.result.length > 0){
                    that.setData({
						activityEvent : res.result[0],
					})
					if(res.result[0].videoUrl != ""){
						that.setData({videoUrl : res.result[0].videoUrl})
					}
					if(res.result[0].mapUrl != ""){
						that.setData({mapUrl : res.result[0].mapUrl})
					}
					if(res.result[0].foodUrl != ""){
						that.setData({foodUrl : res.result[0].foodUrl})
					}
					if(res.result[0].gameUrl != ""){
						that.setData({gameUrl : res.result[0].gameUrl})
					}
					if(res.result[0].performancesMainUrl != ""){
						that.setData({performancesMainUrl : res.result[0].performancesMainUrl})
					}
					if(res.result[0].performancesHillsideUrl != ""){
						that.setData({performancesHillsideUrl : res.result[0].performancesHillsideUrl})
					}
					if(res.result[0].sponsorUrl != ""){
						that.setData({sponsorUrl : res.result[0].sponsorUrl})
					}
					if(res.result[0].vendorUrl != ""){
						that.setData({vendorUrl : res.result[0].vendorUrl})
					}
					if(res.result[0].studentMarketPlaceUrl != ""){
						that.setData({studentMarketPlaceUrl : res.result[0].studentMarketPlaceUrl})
					}
					that.getActivityStatus()
                }
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
                })
            }
        })
	},

	getActivityStatus() {
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
		wx.cloud.callFunction({
			name : "getActivityStatus",
            success : function(res){
				wx.hideLoading()
			    that.setData({
					activityStatus : res.result,
			    })
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
            }
		})
	},

	base(){
		const that = this
		wx.cloud.callFunction({
			name : "cloudfunction",
            data : {
                type : "findBaseData",
            },
            success : function(res){
			    that.setData({
					baseDataStatus : res.result,
			    })
            },
            fail : function(res){
				console.log("findBaseData fail", res)
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