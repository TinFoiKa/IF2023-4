// pages/EventAdmin/BoothManager/ViewBoothMenu/ViewBoothMenu.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight:500,
        boothId : 0,
        boothNo : "",
        boothName : "",
        boothMenuList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
            xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
            boothId : options.boothId
        })
    },

    deleteBoothMenu : function(event){
        const that = this
        let menuId = event.currentTarget.dataset.menuid
        let iconUrl = event.currentTarget.dataset.icon
        wx.showModal({
            title : "",
            content : "Are you sure to delete?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
                    wx.showLoading({title : 'Loading', mask : true})
                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "delete from BoothMenu where menu_ID='"+menuId+"'"
                        },
                        success : function(res){
                            if(iconUrl != ""){
                                wx.cloud.deleteFile({
                                    fileList: [iconUrl],
                                    success(res) {
                                        console.log('Deleted file successfully')
                                    },
                                    fail(err) {
                                        console.log("文件删除失败", err)
                                    }
                                })
                            }
                            wx.hideLoading()
                            wx.showToast({
                                title: 'SUCCESS',
                                icon : 'success'
                            })
                        },
                        fail : function(res){
                            wx.hideLoading()
                            wx.showToast({
                                title: 'Delete failed',
                                icon : 'error'
                            })
                        },
                        complete : function(){
                            console.log("重新加载")
                            that.onShow()
                        }
                    })
                }
            }
        })
	},
	
	addBoothMenu : function(){
		wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditBoothMenu/EditBoothMenu?boothId='+this.data.boothId,
        })
	},

    toEditBoothMenu : function(event){
        let menuId = event.currentTarget.dataset.menuid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditBoothMenu/EditBoothMenu?menuId=' + menuId,
        })
	},
	
	uploadImage : function(event){
		let menuId = event.currentTarget.dataset.menuid
        const that = this
        wx.chooseMedia({//从手机相册中选择
            count : 1,
            mediaType : "image",
            success : function(res){
				let path = res.tempFiles[0].tempFilePath
		// wx.chooseMessageFile({//从微信聊天记录中选择
		// 	count: 1,
		// 	type: 'image',
		// 	success(res) {
		// 		let path = res.tempFiles[0].path;
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
								type : "uploadBoothMenuImage",
								menuId : menuId,
								fileID : fileID
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
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothData where booth_ID='"+this.data.boothId+"'"
            },
            success : function(res){
                that.setData({
                    boothNo : res.result[0].booth_no,
                    boothName : res.result[0].booth_name
                })
            },
            fail : function(res){
                wx.showToast({
                    title: 'Data error',
                    icon : 'error'
                })
            }
        })

        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothMenu where booth_ID='"+this.data.boothId+"'"
            },
            success : function(res){
                that.setData({
                    boothMenuList : res.result
                })
            },
            fail : function(res){
                wx.showToast({
                    title: 'Data error',
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

    }
})