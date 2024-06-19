// pages/EventAdmin/BoothManager/ViewLuckyDraw/ViewLuckyDraw.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
		luckyDrawId : 0,
		luckyDraw : {},
		prizeList : []
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
		
		if(options.boothId == undefined){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditLuckyDraw/EditLuckyDraw',
		  	})
		}else{
			this.setData({
				luckyDrawId : options.boothId
			})
		}
	},
	
	EditLuckyDraw : function(event){
		wx.navigateTo({
			url: '/pages/EventAdmin/BoothManager/EditLuckyDraw/EditLuckyDraw?boothId='+this.data.luckyDrawId,
		})
	},

	EditLuckyDrawPrize : function(event){
		const prizeId = event.currentTarget.dataset.prizeid
		if(prizeId == undefined){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditLuckyDrawPrize/EditLuckyDrawPrize?boothId='+this.data.luckyDrawId,
			})
		}else{
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditLuckyDrawPrize/EditLuckyDrawPrize?boothId='+this.data.luckyDrawId+"&prizeId="+prizeId,
			})
		}
	},

	DeleteLuckyDrawPrize : function(event){
		const that = this
		const prizeId = event.currentTarget.dataset.prizeid
		const imgUrl = event.currentTarget.dataset.imgUrl
		wx.showModal({
            title : "Alert",
            content : "Are you sure to delete?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title : 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "executeSql",
						data : {
							sql : "delete from LuckyDrawPrize where prize_ID='"+prizeId+"'"
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
								title: 'SUCCESS',
								icon : "success"
							})
							if(imgUrl != undefined && imgUrl != null && imgUrl != ""){
								wx.cloud.deleteFile({
									fileList: [imgUrl],
									success(res) {
										console.log('Deleted file successfully')
									},
									fail(err) {
										console.log('Failed to delete file', err)
									}
								})
							}
							that.getLuckyDrawPrize()
						},
						fail : function(res){
							wx.hideLoading()
							console.log("error", res)
							wx.showToast({
								title: 'Delete failed',
							})
						}
					})
				}
			}
		})
	},

	ImportLuckyDrawPrize : function(){
		wx.navigateTo({
			url: '/pages/EventAdmin/BoothManager/ImportLuckyDrawPrize/ImportLuckyDrawPrize?boothId='+this.data.luckyDrawId,
		})
	},

	uploadImage : function(event){
		let prizeId = event.currentTarget.dataset.prizeid
        const that = this
        // wx.chooseMedia({//从手机相册中选择
        //     count : 1,
        //     mediaType : "image",
        //     success : function(res){
		// 		let path = res.tempFiles[0].tempFilePath
		wx.chooseMessageFile({//从微信聊天记录中选择
			count: 1,
			type: 'image',
			success(res) {
				let path = res.tempFiles[0].path;
				let fileName = res.tempFiles[0].name;
				wx.showLoading({title : 'Loading', mask : true})
				let urls = path.split(".")
                let suffix = urls[1]
				const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
				
                wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
						let fileID = res.fileID
                        wx.cloud.callFunction({
							name : "cloudfunction",
							data : {
								type : "uploadLuckyDrawPrizeImage",
								prizeId : prizeId,
								fileID : fileID,
								fileName : fileName
							},
							success : function(res){
								wx.hideLoading()
								if(res.result == 1000){
									wx.showToast({
										title: 'SUCCESS',
										icon : 'success'  
									})
									that.onShow()
								}else if(res.result == 1001){
									wx.showToast({
										title: 'Data acquisition failed',
										icon : 'error'
									})
								}else if(res.result == 1002){
									wx.showToast({
										title: 'Update error',
										icon : 'error'  
									})
								}else if(res.result == -1){
									wx.showToast({
										title: 'Update error',
										icon : 'error'  
									})
								}
							},
							fail : function(res){
								wx.hideLoading()
								wx.showToast({
									title: 'ERROR',
									icon : 'error'  
								})
								wx.cloud.deleteFile({
									fileList: [fileID],
									success(res) {
										console.log('删除旧图片成功')
									},
									fail(err) {
										console.log('删除旧图片失败', err)
									}
								})
							}
						})
                    },
                    fail : function(err){
						wx.hideLoading()
						wx.showToast({
							title: 'Upload failed',
							icon : 'error'  
						})
                    }
                });
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
		if(this.data.luckyDrawId != 0){
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "select * from LuckyDraw where booth_ID='"+this.data.luckyDrawId+"'"
				},
				success : function(res){
					that.setData({
						luckyDraw : res.result[0]
					})
				},
				fail : function(res){
					console.log(res)
					// wx.showToast({
					// 	title: "Load timeout",
                    // 	icon : "error"
					// })
				}
			})

			this.getLuckyDrawPrize()
		}
	},
	
	getLuckyDrawPrize : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDrawPrize where booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				that.setData({
					prizeList : res.result
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
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