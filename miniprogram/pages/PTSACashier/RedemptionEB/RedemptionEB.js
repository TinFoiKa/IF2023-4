// pages/PTSACashier/RedemptionEB/RedemptionEB.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
	},
	
	scanClearAllEB : function(){
		const that = this
        wx.scanCode({
            scanType : "qrCode",
            success : function(res){
                let qrcode = res.result
				// let qrcode = "aaa"//我的ifqr
				wx.showModal({
					title: 'Alert',
					content: "Are you sure you want to deduct all Eagle Bucks(s)？",//确定要扣除所有的Eagle Bucks吗
					cancelText : "Cancel",
					confirmText : "Ok",
					success : function(res){
						if(res.confirm){
							wx.showLoading({title:'Loading', mask : true})
							wx.cloud.callFunction({
								name: "cloudfunction",
								data: {
									type : "clearAllEB",
									ifqr : qrcode
								},
								success : function(res){
									wx.hideLoading()
									if(res.result.code > 0){
										if(res.result.code == 1000){
											wx.showModal({
												title: 'Alert',
												content: "No user information found",//未找到用户信息
												showCancel : false,
												confirmText : "Ok"
											})
										}else if(res.result.code == 1001){
											wx.showModal({
												title: 'Alert',
												content: "Successfully deducted "+res.result.ebNumber+" eagle buck(s)",//操作成功
												showCancel : false,
												confirmText : "Ok"
											})
										}else if(res.result.code == 1002){
											wx.showModal({
												title: 'Alert',
												content: "Account balance is 0, deduction failed",//账户余额为0，扣款失败
												showCancel : false,
												confirmText : "Ok"
											})
										}
									}else{
										wx.showModal({
											title: 'Alert',
											content: "Deduction failed",//操作失败
											showCancel : false,
											confirmText : "Ok"
										})
									}
								},
								fail : function(res){
									console.log("fail", res)
									wx.showModal({
										title: 'Alert',
										content: "Data acquisition failed",//数据获取失败
										showCancel : false,
										confirmText : "Ok"
									})
									wx.hideLoading()
								},
							})
						}
					}
				})
            },
            fail : function(res){
                console.log("扫码已关闭", res)
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