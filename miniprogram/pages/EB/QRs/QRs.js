// pages/EB/QRs/QRs.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        braceletMaxCount : app.globalData.braceletMaxCount,
		myQrList : [],
		updateBraceletQRCode : "",
		iosDialog : false,
		updateAlias : "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    showQrcode : function(event){
        const qrcode = event.currentTarget.dataset.value
        wx.navigateTo({
            url: '/pages/EB/QRs/showQR/showQR?qrcode=' + qrcode,
        })
    },

    changeStatus : function(event){
        const that=this
        let openId = event.currentTarget.dataset.openid
        let linkId = event.currentTarget.dataset.linkid
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "update Bracelets set is_active="+status+" where linked_open_id='"+openId+"' and qr_link='"+linkId+"'"
            },
            success : function(res){
                wx.hideLoading()
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Delete failed',
                    icon : 'error'
                })
            },
            complete : function(){
                that.onShow()
            }
        })
	},
	
	updateQRName : function(event){
		const qrcode = event.currentTarget.dataset.value
		const alias = event.currentTarget.dataset.alias
		this.setData({
			iosDialog: true,
			updateAlias : alias,
			updateBraceletQRCode : qrcode
		});
	},

	closeIOS() {
		this.setData({
			iosDialog: false,
			updateAlias : "",
			updateBraceletQRCode : "",
		});
	},

	updateAliasInput : function(e){
		this.setData({
			updateAlias : e.detail.value,
		})
	},

	confirmIOS() {
		const that = this
		wx.showLoading({title:'Loading', mask : true})
		wx.cloud.callFunction({
			name: "executeSql",
			data: {
				sql : "update Bracelets set qr_name='"+this.data.updateAlias+"' where qr_link='"+this.data.updateBraceletQRCode+"'"
			},
			success: function (response) {
				wx.hideLoading()
				that.closeIOS()
				that.onShow()
				wx.showToast({
					title: 'SUCCESS',
					icon : "success",
				})
			},
			fail: function (response) {
				console.log("update Alias fail", response)
				wx.showToast({
					title: "Fail",
					icon : "error"
				})
				wx.hideLoading()
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
            name : "cloudfunction",
            data : {
                type : "getMyQrList"
            },
            success : function(res){
                that.setData({
                    myQrList : res.result
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