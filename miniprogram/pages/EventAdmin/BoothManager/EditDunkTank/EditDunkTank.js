// pages/EventAdmin/BoothManager/EditDunkTank/EditDunkTank.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        boothId : 0,
        dunkTank : {},
        isDeleteOldHeadIcon : false,
        headIconFileName : "",
		headIconUrl : "",
		headIconProgress : "",//上传进度
        photoList : [],
		removePhotoList : [],
		photoProgress : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
			xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
		})
		if(options.boothId != undefined){
			this.setData({
				boothId : options.boothId
			})
		}
    },

    uploadHeadIcon : function(){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                if(that.data.isDeleteOldHeadIcon){
                    wx.cloud.deleteFile({
                        fileList: [that.data.headIconUrl],
                        success(res) {
                            console.log('Deleted file successfully')
                        },
                        fail(err) {
                            console.log('Failed to delete file', err)
                        }
                    })
				}
				that.setData({
                    headIconFileName : res.tempFiles[0].name,
                    isDeleteOldHeadIcon : true
                })
				
				
				// 上传云存储
                let path = res.tempFiles[0].path;
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
                            headIconUrl : res.fileID,
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        headIconProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传")
            }
        })
    },

    removeHeadIcon : function(event){
		if(this.data.isDeleteOldHeadIcon){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.headIconUrl],
                success(res) {
                    that.setData({
                        headIconFileName : "",
                        headIconUrl : "",
                        headIconProgress : ""
                    })
                    console.log('Deleted file successfully')
                },
                fail(err) {
                    console.log('Failed to delete file', err)
                }
            })
        }else{
            this.setData({
                headIconFileName : "",
                headIconUrl : "",
                isDeleteOldHeadIcon : true,
                headIconProgress : ""
            })
        }
    },

    uploadDunkPhoto : function(){
        let that = this;
        wx.chooseMessageFile({
            count: 9,
			type: 'image',
			// type: 'all',
            success(res) {
				let photos = that.data.photoList
                for(let i=0;i<res.tempFiles.length;i++){
                    let filename = res.tempFiles[i].name;
					let path = res.tempFiles[i].path;
					photos.push({"ID": 0, "file_name": filename, "file_url": path})
					that.setData({
						photoList : photos
					})
				}

				let photoList = that.data.photoList
				for(let i=0;i<photoList.length;i++){
					let path = photoList[i].file_url;
					
					// 上传云存储
					let urls = path.split(".")
					let suffix = urls[1]
	
					const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
					const uploadTask = wx.cloud.uploadFile({
						cloudPath: "uploadFile/" + cloudPath,
						filePath: path,
						success(res) {
							let photo = photoList[i]
							photo.file_url = res.fileID
							let photos = photoList
							photos[i] = photo
							that.setData({
								photoList : photos
							})
						},
						fail : function(err){
						}
					});
					uploadTask.onProgressUpdate((res) => {
						// 上传进度条
						let progress = that.data.photoProgress
						progress[i] = res.progress
						that.setData({
							photoProgress : progress
						})
					})
				}
            },
            fail : function(res){
                console.log("取消上传")
            }
        })
    },

    removeDunkPhoto : function(event){
        let index = event.currentTarget.dataset.index
		let photos = this.data.photoList
		let progress = this.data.photoProgress
        let removePhotos = this.data.removePhotoList
        if(photos[index].ID > 0){
            removePhotos.push(photos[index])
            this.setData({
                removePhotoList : removePhotos
            })
        }else{
			let file = photos[index].file_url
			wx.cloud.deleteFile({
                fileList: [photos[index].file_url],
                success(res) {
                    console.log('Deleted file successfully', file)
                },
                fail(err) {
                    console.log('Failed to delete file', file, err)
                }
            })
		}
		photos.splice(index, 1);
		progress.splice(index, 1);
        this.setData({
			photoList : photos,
			photoProgress : progress,
        })
    },

    submitForm : function(event){
        if(event.detail.value.fullName == ""){
            wx.showToast({
                title: 'Full Name cannot be empty',
                icon : "node",
                duration : 2500
            })
            return
        }
        if(event.detail.value.target == ""){
            wx.showToast({
                title: 'Target cannot be empty',
                icon : "node",
                duration : 2500
            })
            return
        }
        wx.showLoading({
            title: 'Loading',
            mask : true
        })
        let oldHeadIcon = ""
        if(this.data.boothId > 0){
            if(this.data.isDeleteOldHeadIcon){
                oldHeadIcon = this.data.dunkTank.dunked_url
            }
		}
        wx.cloud.callFunction({
            name : "cloudfunction",
            data : {
                type : "saveDunkTank",
                data : {
                    ID : this.data.boothId,
                    fullName : event.detail.value.fullName,
                    introduction : event.detail.value.introduction,
                    target : event.detail.value.target,
                    oldHeadIcon : oldHeadIcon,
                    headIconUrl : this.data.headIconUrl,
                    headIconFileName : this.data.headIconFileName,
                    photoList : this.data.photoList,
                    removePhotoList : this.data.removePhotoList
                }
            },
            success : function(res){
				console.log(res)
                if(res.result == "success"){
                    wx.hideLoading()
                    wx.showToast({
                        title: 'SUCCESS',
                        icon : "success",
                        duration : 3500,
                        mask : true
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 3000)
                }else{
                    wx.hideLoading()
                    wx.showToast({
                        title: 'fail',
                        icon : "error",
                        duration : 3500
                    })
                }
            },
            fail : function(res){
                wx.hideLoading()
                console.log(res)
                wx.showToast({
                    title: 'fail',
                    icon : "error",
                    duration : 3500
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
		if(this.data.boothId != undefined && this.data.boothId > 0){
            const that = this
            wx.cloud.callFunction({
                name : "executeSql",
                data : {
                    sql : "select * from DunkTank where dunk_ID='"+this.data.boothId+"'"
                },
                success : function(res){
                    if(res.result != null && res.result.length > 0){
                        that.setData({
                            dunkTank : res.result[0],
                            headIconFileName : res.result[0].dunked_url_fileName,
                            headIconUrl : res.result[0].dunked_url
                        })
                    }
                },
                fail : function(res){
					console.log(res)
                    // wx.showToast({
                    //     title: "Load timeout",
                    // 	icon : "error"
                    // })
                }
            })
    
            wx.cloud.callFunction({
                name : "executeSql",
                data : {
                    sql : "select ID, file_name, file_url from DunkTankPhoto where dunk_ID='"+this.data.boothId+"'"
                },
                success : function(res){
                    if(res.result != null && res.result.length > 0){
                        that.setData({
                            photoList : res.result,
                        })
                    }
                },
                fail : function(res){
					console.log(res)
                    // wx.showToast({
                    //     title: "Load timeout",
                    // 	icon : "error"
                    // })
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