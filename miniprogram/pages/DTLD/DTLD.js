// pages/DTLD/DTLD.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
		DunkTankList : [],
        role : 0,
		LuckyDrawList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
	},
	
    goDunkTank : function(event){
		const dunkTankId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/DunkTank/DunkTank?dunkTankId='+dunkTankId
        })
    },

    goLuckyDraw : function(event){
		const luckyDrawId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/LuckyDraw/LuckyDraw?luckyDrawId=' + luckyDrawId
        })
	},
	
	fillUpDunk : function(event){
		const luckyDrawId = event.currentTarget.dataset.id
		const that = this
		wx.showModal({
            title : "Alert",
            content : "Are you sure to top up?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "executeSql",
						data : {
							sql : "update DunkTank set isFillUp=1 where dunk_ID='"+luckyDrawId+"'"
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
								title : "SUCCESS",
								icon : "success"
							})
							that.loadDunkTankList()
						},
						fail : function(res){
							wx.hideLoading()
							wx.showToast({
								title : "fail",
								icon : "none"
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
		this.getBoothManager()//Search account permissions
		this.loadDunkTankList()//Search dunk tank booth
		this.loadLuckyDrawList()//Search lucky draw booths
	},
	
	//Search account permissions
	getBoothManager(){
		const that = this
		wx.cloud.callFunction({
            name: "cloudfunction",
            data: {
                type: "getUserByOpenId"
            },
            success: function (res) {
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        role : res.result[0].role
                    })
                }
            }
		})
	},

	//Search dunk tank booth
	loadDunkTankList(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from DunkTank"
			},
			success : function(res){
				that.setData({
					DunkTankList : res.result
				})
			},
			fail : function(res){
				console.log(res)
			},
		})
	},

	//Search lucky draw booths
	loadLuckyDrawList(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDraw"
			},
			success : function(res){
				that.setData({
					LuckyDrawList : res.result
				})
			},
			fail : function(res){
				console.log(res)
			},
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
		this.loadDunkTankList()
		app.stopPullDownRefresh()
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