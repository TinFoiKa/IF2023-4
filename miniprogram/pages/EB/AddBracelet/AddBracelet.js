// pages/EB/AddBracelet/AddBracelet.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		qrcode : "",
		qrNickName : "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            qrcode : options.qrcode
        })
	},
	
	nicknameInput : function(e){
		this.setData({
            qrNickName : e.detail.value
        })
	},

    add : function(){
        const that = this
        wx.showModal({
            content: 'Add the QR code to this account？',//将二维码添加到此帐户
            cancelText : "Cancel",
            confirmText : "Ok",
            complete: (res) => {
                if (res.confirm) {
                    wx.showLoading({title:'Loading', mask : true})
                    that.addBracelet()
                }
            }
        })
    },

    cancel : function(){
        wx.navigateBack()
    },

    //添加手环
    addBracelet : function(){
        const qrcode = this.data.qrcode
        let braceletMaxCount = app.globalData.braceletMaxCount
        wx.cloud.callFunction({
            name: "cloudfunction",
            data: {
                type: "addBracelet",
                braceletMaxCount : braceletMaxCount,
				qrcode : qrcode,
				qrNickName : this.data.qrNickName
            },
            success: function (response) {
                wx.hideLoading()
                if(response.result == 1000){
                    wx.showModal({
                        title: 'Alert',
                        content: "SUCCESS",//操作成功
                        showCancel : false,
                        confirmText : "Ok",
                        success : function(res){
                            if(res.confirm){
                                wx.navigateBack()
                            }
                        }
                    })
                }else{
                    if(response.result == 1002){
                        wx.showModal({
                            title: 'Fail',
                            content: "Invalid QR code",//二维码不存在，无效二维码
                            showCancel : false,
                            confirmText : "Ok"
                        })
                    }else if(response.result == 1003){
                        wx.showModal({
                            title: 'Fail',
                            content: "The QR Code is in use",//二维码正在使用中
                            showCancel : false,
                            confirmText : "Ok"
                        })
                    }else if(response.result == 1004){
                          wx.showModal({
                            title: 'Fail',
                            content: "QR code addition failed",//二维码添加失败
                            showCancel : false,
                            confirmText : "Ok"
                          })
                    }else if(response.result == 1005){
                        wx.showModal({
                            title: 'Fail',
                            content: "The total number of QR codes exceeded the limit ("+braceletMaxCount+"/account)",//二维码总数超过限制
                            showCancel : false,
                            confirmText : "Ok"
                        })
                    }else{
                        wx.showModal({
                            title: 'Error',
                            content: "fail",
                            showCancel : false,
                            confirmText : "Ok"
                        })
                    }
                }
            },
            fail: function (response) {
                wx.hideLoading()
                wx.showModal({
                    title: 'Error',
                    content: "fail",
                    showCancel : false,
                    confirmText : "Ok"
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