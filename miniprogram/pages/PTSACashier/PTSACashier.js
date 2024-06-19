// pages/PTSACashier/PTSACashier.js
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

	toScan : function(){
        wx.navigateTo({
            url: '/pages/PTSACashier/Scan/Scan',
        })
	},
	
	toBooth : function(){
        wx.navigateTo({
            url: '/pages/PTSACashier/Booth/Booth',
        })
	},
	
	toRedemptionEB : function(){
        wx.navigateTo({
            url: '/pages/PTSACashier/RedemptionEB/RedemptionEB',
        })
	},

	expBuyEBPaymentRecord : function(){
		//导出购买EB支付记录
		this.exportStatistic(1)
	},

	expLuckyDrawPaymentRecord : function(){
		//导出抽奖支付记录
		this.exportStatistic(2)
	},

	expDunkTankPaymentRecord : function(){
		//导出灌水游戏支付记录
		this.exportStatistic(3)
	},

	expBoothIncomeTotalRecord : function(){
		//导出摊位EB收入汇总
		this.exportStatistic(4)
	},

	exportStatistic : function(dataType){
		wx.showLoading({title: 'Loading', mask : true})
		wx.cloud.callFunction({
			name : "cloudfunction",
			data : {
				type : "exportStatistic",
				dataType : dataType//1购买EB支付记录，2抽奖买票支付记录，3灌水游戏支付记录，4摊位收入汇总
			},
            success : function(r){
				console.log("exportStatistic r", r)
				let uploadFilePath = r.result.fileID
				console.log("exportStatistic uploadFilePath", uploadFilePath)
				wx.cloud.downloadFile({
					fileID : uploadFilePath,
					success : function(res){
						wx.hideLoading()
						if(res.statusCode == 200){
							const filePath = res.tempFilePath
							wx.showToast({
								title: 'Download successful',
								icon: "none",
								duration: 1500
							})
							setTimeout(() => {
								wx.openDocument({
									filePath : filePath,
									showMenu : true,
									fileType : 'xlsx',
									success: function (res) {
										console.log('打开文档成功')
									},
								})
							}, 1000)
						}else{
							wx.showToast({
								title : 'Download failed',
								icon : 'none'
							})
						}
					},
					fail : function(err){
						console.log("fail", err)
						wx.hideLoading()
						wx.showToast({
							title : 'Download error',
							icon : 'none'
						})
					},
					complete: function (res) {
						wx.cloud.deleteFile({
							fileList: [uploadFilePath],
							success(res) {
								console.log('Deleted file successfully', uploadFilePath, res)
							},
							fail(err) {
								console.log(err)
							}
						})
					},
				})
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
				wx.showToast({
					title : 'Timeout',
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