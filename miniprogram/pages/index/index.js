import util from '../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
		height : 0,
		windowWidth : 0,
		phoneNumber : "",
		iosDialog: false,
		openId : "",
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		const sysInfo = wx.getSystemInfoSync()
		console.log("sysInfo", sysInfo)
        this.setData({
			height : (sysInfo.windowHeight - (sysInfo.windowWidth * 183 / 375) - (sysInfo.windowWidth * 197 / 375)),
			windowWidth : sysInfo.windowWidth
		})
	},

	closeIOS() {
		this.setData({
		  iosDialog: false,
		});
	},

    exit: function () {
        wx.exitMiniProgram()
	},
    getPhoneNumber: function (event) {
		this.setData({
			iosDialog: false,
			openId : "",
			phoneNumber : "",
		});

		const that = this
		let cloudId = event.detail.cloudID;
        if (!cloudId) {
            return;
		}
        wx.showLoading({title:'Loading', mask : true})
        wx.cloud.callFunction({
            name: "getPhoneNumber",
            data: {
				weRunData: wx.cloud.CloudID(cloudId)
            }
        }).then(function (res) {
			let phoneNumber = res.result
            wx.cloud.callFunction({
                name: "cloudfunction",
                data: {
                    type: "getUserByOpenId"
                },
                success: function (response) {
					if (response.result.length > 0) {
						that.setData({
							openId : response.result[0].open_ID,
						});
					}
					that.setData({
						iosDialog: true,
						phoneNumber : phoneNumber,
				  	});
                    wx.hideLoading()
                },
                fail: function (response) {
                    console.log("getUserByOpenId fail", response)
                    wx.showToast({
						title: "Load timeout",
						icon : "error"
					})
                    wx.hideLoading()
                }
            })
        })
	},

	confirmPhone : function(){
		const that = this
		if(this.data.openId != undefined && this.data.openId != null && this.data.openId.length > 0){
			wx.showLoading({title:'Loading', mask : true})
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "update Users set phone_num='"+this.data.phoneNumber+"' where open_ID='"+this.data.openId+"'"
				},
				success : function(res){
					wx.hideLoading()
					if(res.result.affectedRows > 0){
						wx.setStorageSync('openid', that.data.openId)
						wx.reLaunch({
							url: '/pages/Tutorial/Tutorial',
						})
					}else{
						wx.showModal({
							title: 'Alert',
							content: 'Operation failed',
							showCancel: false,
							confirmText: 'Ok',
						})
					}
				},
				fail : function(r){
					wx.hideLoading()
					wx.showModal({
						title: 'Alert',
						content: 'Timeout',
						showCancel: false,
						confirmText: 'Ok',
					})
				},
			})
		}else{
			wx.reLaunch({
				url: '/pages/wechatLogin/wechatLogin?phoneNumber=' + this.data.phoneNumber,
			})
		}
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
		wx.stopPullDownRefresh()
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

	}
})