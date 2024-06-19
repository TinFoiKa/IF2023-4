// pages/EB/MyQR/MyQR.js
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
import util from '../../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
		myQrcode : "",
		qrCodePath : ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
    },

    resetQRCode : function(){
        const that = this
        wx.showLoading({title:'Loading', mask : true})
        let ifqr = util.uuid()
        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "resetUserQrCode",
                ifqr : ifqr
            },
            success : function(res){
                wx.hideLoading()
                if(res.result.affectedRows > 0){
                    that.onShow()
                }else{
                    wx.showToast({
                        title : "fail",
                        icon : "none"
                    })
                }
            },
            fail : function(res){
                wx.hideLoading()
                console.log(res)
                wx.showToast({
                    title : "Request to server failed",
                    icon : "none"
                })
            }
        })
	},
	
	bindlongQRCode : function(options){
		wx.saveImageToPhotosAlbum({
			filePath : this.data.qrCodePath,
			success : function(res){
				wx.showToast({
					title: 'SUCCESS',
					icon : "success"
				})
			},
			fail : function(res){
				console.log("saveImageToPhotosAlbum fail", res)
				wx.showToast({
					title: 'No album authority',
					icon : "error"
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
		const that = this
        wx.showLoading({title:'Loading', mask : true})
        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "getUserByOpenId"
            },
            success : function(res){
                that.setData({
                    myQrcode : res.result[0].ifqr
                })

                const query = wx.createSelectorQuery()
                query.select('#myQrcode')
                    .fields({
                        node: true,
                        size: true
                    })
                    .exec((res) => {
                        var canvas = res[0].node
                
                        // 调用方法drawQrcode生成二维码
                        drawQrcode({
                            canvas: canvas,
                            canvasId: 'myQrcode',
                            width: 260,
                            padding: 30,
                            background: '#ffffff',
                            foreground: '#000000',
                            text: that.data.myQrcode,
                        })
                        
                        // 获取临时路径（得到之后，想干嘛就干嘛了）
                        wx.canvasToTempFilePath({
                            canvasId: 'myQrcode',
                            canvas: canvas,
                            x: 0,
                            y: 0,
                            width: 260,
                            height: 260,
                            destWidth: 260,
                            destHeight: 260,
                            success(res) {
								that.setData({
									qrCodePath : res.tempFilePath
								})
                                console.log('二维码临时路径：', res.tempFilePath)
                            },
                            fail(res) {
                                console.error(res)
                            },
                            complete(res) {
                                wx.hideLoading()
                            }
                        })
                    })
            },
            fail : function(res){
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
                })
            }
        })
	},
	
	share : function(){
		wx.showShareImageMenu({
			path: this.data.qrCodePath,
			success : function(res){
				wx.showToast({
					title : 'SUCCESS',
					icon : 'success'
				})
			},
			fail : function(res){
				wx.showToast({
					title: 'No permission',
					icon : 'error'
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
		
		// return {
		// 	title : "",
		// 	imageUrl : this.data.qrCodePath,
		// 	path : ""
		// }
    }
})