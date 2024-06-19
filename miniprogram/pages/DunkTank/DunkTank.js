// pages/DunkTank/DunkTank.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		openId : wx.getStorageSync('openid'),
		userInfo : {},
		dunkTankId : 0,
		dunkTank : {},
		emptyPhotoList : [1,2,3],
		dunkTankPhotoList : [],
        isBoothManager : false,
		paidMoney : 0,
		disabled : false,
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
		isBatchDeletePhoto : false,
		checkPhotoIds : [],
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			dunkTankId : options.dunkTankId
		})
	},

	//Determine and return to active status
	findActivityStatus(){
		let result = true
		if(this.data.activityStatus == 0){
			//管理员未开启活动
			wx.showModal({
				title : "Alert",
				content : "Activity not enabled",//活动未开启
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}else if(this.data.activityStatus == 3){
			//活动已开启，已到活动结束时间
			wx.showModal({
				title : "Alert",
				content : "Activity has ended",//活动已结束
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}else if(this.data.activityStatus == 4){
			//活动已手动结束
			wx.showModal({
				title : "Alert",
				content : "Activity terminated",//活动已终止
				showCancel : false,
				confirmText : "Ok",
			})
			result = false
		}
		return result
	},
	
	//Enter the payment page
	dunk : function(){
		const status = this.findActivityStatus()
		if(!status){
			return
		}
		if(this.data.userInfo.is_Disable == 1){
			wx.showModal({
				title : "Alert",
				content : "The current account has been disabled and cannot be traded",//当前账户已被禁用，无法交易
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}
		wx.navigateTo({
		  	url: '/pages/pay/pay?dunkTankId='+this.data.dunkTankId,
		})
	},

	//Upload photos
	uploadDunkPhoto : function(event){
		let that = this;
        wx.chooseMedia({
            count: 20,
            mediaType: 'image',
            success(res) {
				wx.showLoading({title : 'Loading', mask : true})
				console.log("chooseMedia res", res)
				let files = res.tempFiles
				let uploads =[];  //构建的promise数组
				files.forEach((item,index)=>{
					uploads.push(that.uploadFile(item))//Upload photos to cloud storage
				})
				Promise.all(uploads).then(res=>{
					wx.hideLoading()
					that.loadDunkTankPhoto()
				})
            },
            fail : function(res){
                console.log("取消上传")
			}
        })
	},

	//Upload photos to cloud storage
	uploadFile(tempFile){
		const that = this
		return new Promise((resolve, reject) => {
			// 上传云存储
			console.log("tempFile", tempFile)
			let filename = ""
			let path = tempFile.tempFilePath;
			let urls = path.split(".")
			let suffix = urls[1]

			setTimeout(() => {
				const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
				wx.cloud.uploadFile({
					cloudPath: "uploadFile/"+cloudPath,
					filePath: path,
					success(res) {
						let fileID = res.fileID
						wx.cloud.callFunction({
							name : "executeSql",
							data : {
								sql : "insert into DunkTankPhoto (dunk_ID, file_name, file_url) values ('"+that.data.dunkTankId+"', '"+filename+"', '"+fileID+"')"
							},
							success : function(res){
								resolve()
							},
							fail : function(res){
								wx.cloud.deleteFile({
									fileList: [fileID],
									success(res) {
										console.log('Deleted file successfully')
										reject(err)
									},
									fail(err) {
										console.log('Failed to delete file', err)
										reject(err)
									}
								})
							}
						})
					},
					fail : function(err){
						console.log("Upload failure", err)
						reject(err)
					}
				});
			}, 2)
		})
	},

	batchDeleteDunkPhoto : function(){
		this.setData({
			isBatchDeletePhoto : true
		})
	},

	cancelBatchDelete : function(){
		this.setData({
			isBatchDeletePhoto : false
		})
	},

	checkBoxPhotoChange : function(e){
		this.setData({
			checkPhotoIds : e.detail.value
		})
	},

	//Batch delete photos
	confirmBatchDeleteDunkPhoto : function(){
		const that = this
		if(this.data.checkPhotoIds.length == 0){
			wx.showToast({
			  	title: 'Please select a photo',
			})
			return
		}
		wx.showModal({
            title : "Alert",
            content : "Are you sure to delete the selected photos?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showLoading({title: 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "cloudfunction",
						data : {
							type : "deleteDunkTankPhoto",
							photoIds : that.data.checkPhotoIds
						},
						success : function(res){
							wx.hideLoading()
							if(res.result == 1000){
								wx.showToast({
									title : "SUCCESS",
									icon : "success"
								})
								that.setData({
									checkPhotoIds : []
								})
								that.loadDunkTankPhoto()
							}else{
								wx.showToast({
									title : "Fail",
									icon : "error"
								})
							}
						},
						fail : function(res){
							wx.hideLoading()
							wx.showToast({
								title : "Fail",
								icon : "error"
							})
						}
					})
				}
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
		this.getUserInfo()//Search user information
		this.getActivityStatus()//Search activity status
		this.loadIsBoothManager()//Search for booth manager
		this.loadDunkTank()//Search dunk tank information
		this.loadDunkTankPhoto()//Search dunk tank photos
		this.loadPaidMoney()//Search for the payment amount of dunk tank
	},

	//Search for booth manager
	loadIsBoothManager : function(){
		const that = this
		wx.cloud.callFunction({
            name: "executeSql",
            data: {
                sql : "select * from BoothManagers where open_id='"+this.data.openId+"' and booth_type=2 and status=1"// and booth_id='"+this.data.dunkTankId+"'
            },
            success: function (res) {
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        isBoothManager : true
                    })
                }
            }
        })
	},

	//Search dunk tank information
	loadDunkTank : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from DunkTank where dunk_ID='"+this.data.dunkTankId+"'"
			},
			success : function(res){
				let dunkTankObj = res.result[0]
				let dis = false
				if(dunkTankObj.isFillUp==1 || dunkTankObj.goal_rmb <= dunkTankObj.dunked_rmb){
					dis = true
				}
				that.setData({
					dunkTank : dunkTankObj,
					disabled : dis
				})
			},
			fail : function(res){
				console.log(res)
			},
		})
	},

	//Search dunk tank photos
	loadDunkTankPhoto : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from DunkTankPhoto where dunk_ID='"+this.data.dunkTankId+"'"
			},
			success : function(res){
				let photoList = res.result
				if(photoList.length > 0){
					for(let i=0;i<photoList.length;i++){
						photoList[i].checked = false
					}
				}
				that.setData({
					dunkTankPhotoList : photoList
				})
			},
			fail : function(res){
				console.log(res)
			},
		})
	},

	//Search for the payment amount of dunk tank
	loadPaidMoney : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select sum(amount) as sumAmount from eBRecord where type=3 and is_return=0 and booth_type='2' and sender_open_id='"+this.data.openId+"' and wechatPaymentState=1"// and booth_ID='"+this.data.dunkTankId+"'
			},
			success : function(res){
				if(res.result != null && res.result[0].sumAmount != null){
					that.setData({
						paidMoney : res.result[0].sumAmount
					})
				}
			},
			fail : function(res){
				console.log(res)
			},
		})
	},
	
	//Search activity status
	getActivityStatus() {
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
		wx.cloud.callFunction({
			name : "getActivityStatus",
            success : function(res){
				wx.hideLoading()
			    that.setData({
					activityStatus : res.result,
				})
				that.findActivityStatus()
            },
            fail : function(res){
				wx.hideLoading()
				console.log("getActivityStatus fail", res)
            }
		})
	},

	tutorial : function(){
		wx.navigateTo({
            url: '/pages/Tutorial/Tutorial?tutorialType=4',
        })
	},

	showHead : function(options){
		const imageUrl = options.currentTarget.dataset.url
		wx.previewImage({
		  	urls: [imageUrl],
			  showmenu : false,
		})
	},

	showPhoto : function(options){
		console.log("options", options)
		let photoUrls = []
		for(let i=0;i<this.data.dunkTankPhotoList.length;i++){
			photoUrls.push(this.data.dunkTankPhotoList[i].file_url)
		}
		wx.previewImage({
			urls: photoUrls,
			showmenu : false,
			current : photoUrls[options.currentTarget.dataset.urlindex]
		})
	},

	//Search user information
	getUserInfo(){
		const that = this
        wx.cloud.callFunction({
            name : "getUserByOpenId",
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
						userInfo : res.result[0],
					})
                }
            },
            fail : function(res){
				wx.showModal({
					title: 'Alert',
					content: 'Failed to obtain account information. Please try again',//获取账号信息失败，请重试
					showCancel : false,
					confirmText : 'Ok',
					complete: (res) => {
						if (res.confirm) {
							wx.navigateBack()
						}
					}
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
		this.loadDunkTank()
		this.loadDunkTankPhoto()
		this.loadPaidMoney()
		app.stopPullDownRefresh()
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