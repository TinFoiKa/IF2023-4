// pages/EventAdmin/EventAdmin.js
const util = require('../../utils/util.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		braceletNumber : app.globalData.braceletNumber,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    toEventSetting : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/EventSetting/EventSetting',
        })
    },

    toBoothManager : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/BoothManager',
        })
    },

    toBoothAuthorization : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothAuthorization/BoothAuthorization',
        })
    },

    toAnnouncement : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/Announcements/Announcements',
        })
	},

	toDisableFunction : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/DisableFunction/DisableFunction',
        })
	},
	
	toDisableAccountList : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/DisableAccountList/DisableAccountList',
        })
	},

    toFinancialStatement : function(){
		//财务报表
        // wx.navigateTo({
        //     url: '',
        // })
    },

    toFeedback : function(){
        wx.navigateTo({
            url: '/pages/EventAdmin/Feedbacks/Feedbacks',
        })
	},
	
	//生成手环
    bindCreateBracelet : function(){
		const that = this
		wx.showModal({
            title : "Alert",
            content : "Whether to create？",
            cancelText : "Cancel",
            confirmText : "Create",
            success : function(res){
				if(res.confirm){
					wx.showModal({
					    title : "Alert",
					    content : "Create or Export？",
					    cancelText : "Expert",
					    confirmText : "Create",
					    success : function(res){
							if(res.confirm){
								that.createBracelet(true)
								console.log("create 100 bracelet")
							}
							if(res.cancel){
								that.createBracelet(false)
							}
						},
						fail : function(res){
							console.log("fail ", res)
						}
					})
				}
			},
			fail : function(res){
				console.log("fail ", res)
			}
		})
	},

    //生成手环
    createBracelet : function(isCreate){
		wx.showLoading({title:'Loading', mask : true})
		let qrList = []
		if(isCreate){
			const braceletNumber = this.data.braceletNumber
			for(let i=0;i<braceletNumber;i++){
				qrList.push(util.uuid())
			}
		}
		wx.cloud.callFunction({
			name : "cloudfunction",
			data : {
				type : "createBracelet",
				qrList : qrList
			},
			success : function(r){
				console.log("createBracelet r", r)
				let uploadFilePath = r.result.fileID
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
			fail : function(r){
				console.log("fail", r)
				wx.hideLoading()
				wx.showToast({
					title : "Error",
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