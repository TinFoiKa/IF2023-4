// pages/EventAdmin/DisableFunction/DisableFunction.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		activityEvent : {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
	},
	
	changePayEBStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set payEB_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
                })
            }
        })
	},
	
	changeUseEBStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set useEB_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
                })
            }
        })
	},

	changeTransferEBStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set transferEB_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
                })
            }
        })
	},
	
	changeDunkTankStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set dunkTank_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
                })
            }
        })
	},
	
	changeLuckyDrawStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set luckyDraw_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
                })
            }
        })
	},
	
	changeStartLotteryStatus : function(event){
        const that=this
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
				sql : "update ActivityEvent set startLottery_state="+status
            },
            success : function(res){
				wx.hideLoading()
				that.getActivityEvent()
				wx.showToast({
                    title: 'SUCCESS',
                    icon : 'success'
                })
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Timeout',
                    icon : 'error'
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
		this.getActivityEvent()
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
                }
            },
            fail : function(res){
				console.log(res)
				wx.hideLoading()
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