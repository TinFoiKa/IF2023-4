// pages/EventAdmin/BoothManager/EditLuckyDrawPrize/EditLuckyDrawPrize.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
		luckyDrawId : 0,
		prizeId : 0,
		prize : {},
		oldPhotoUrl : "",
		newPhotoUrl : "",
		photoFileName : "",
		photoProgress : 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
			xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
			luckyDrawId : options.boothId
		})
		
		if(options.prizeId != undefined){
			this.setData({
				prizeId : options.prizeId
			})
		}
	},
	
	uploadPhoto : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                if(that.data.newPhotoUrl != ""){
                    wx.cloud.deleteFile({
                        fileList: [that.data.newPhotoUrl],
                        success(res) {
                            console.log('Deleted file successfully')
                        },
                        fail(err) {
                            console.log('Failed to delete file', err)
                        }
                    })
                }
                let path = res.tempFiles[0].path;
                that.setData({
                    photoFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
                            newPhotoUrl : res.fileID,
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        photoProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传")
            }
        })
	},
	
	removePhotoFile : function(){
        if(this.data.newPhotoUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newPhotoUrl],
                success(res) {
                    that.setData({
                        photoFileName : "",
                        newPhotoUrl : "",
                        photoProgress : ""
                    })
                    console.log('Deleted file successfully')
                },
                fail(err) {
                    console.log('Failed to delete file', err)
                }
            })
        }else{
            this.setData({
                photoFileName : "",
                photoProgress : ""
            })
        }
	},
	
	submitForm:function(event){
        const that = this
        let prizeName = event.detail.value.prizeName
        let prizeValue = event.detail.value.prizeValue
        let isDeleteOldPhotoFile = true
        if(prizeName == "" || prizeName.length == 0){
            wx.showToast({
                title: 'Prize Name cannot be empty',
                icon: "none"
            })
            return
        }
        if(this.data.newPhotoUrl == "" && this.data.oldPhotoUrl != ""){
            this.setData({
                newPhotoUrl : this.data.oldPhotoUrl,
            })
            isDeleteOldPhotoFile = false
        }
        let sql = ""
        if (JSON.stringify(this.data.prize) == "{}" || this.data.prizeId == 0) {
            sql = "insert into LuckyDrawPrize (booth_ID, prize_name, prize_value, img_url, img_file_name) values ('" + this.data.luckyDrawId + "', '" + prizeName + "', '" + prizeValue + "', '"+this.data.newPhotoUrl+"', '"+this.data.photoFileName+"')"
        } else {
            sql = "update LuckyDrawPrize set prize_name='" + prizeName + "', prize_value='" + prizeValue + "', img_url='" + this.data.newPhotoUrl + "', img_file_name='"+this.data.photoFileName+"' where prize_ID='" + this.data.prizeId + "'"
        }
        wx.cloud.callFunction({
            name: "executeSql",
            data: {
                sql: sql
            },
            success: function (res) {
                wx.showToast({
                    title: 'SUCCESS',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        if(isDeleteOldPhotoFile && that.data.oldPhotoUrl != ""){
                            wx.cloud.deleteFile({
                                fileList: [that.data.oldPhotoUrl],
                                success(res) {
                                    console.log('删除历史地图文件成功')
                                },
                                fail(err) {
                                    console.log('删除历史地图文件失败', err)
                                }
                            })
						}
						setTimeout(() => {
							wx.navigateBack()
						}, 1500)
                    }
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: 'fail',
                    icon: 'error'
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
		if(this.data.prizeId != undefined){
			const that = this
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "select * from LuckyDrawPrize where prize_ID='"+this.data.prizeId+"'"
				},
				success : function(res){
					if(res.result != null && res.result.length > 0){
						that.setData({
							prize : res.result[0],
							oldPhotoUrl : res.result[0].img_url,
							photoFileName : res.result[0].img_file_name
						})
					}
				},
				fail : function(res){
					wx.showToast({
						title: "Load timeout",
                    	icon : "error"
					})
				}
			})
		}
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