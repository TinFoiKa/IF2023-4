// pages/EventAdmin/BoothManager/ViewBooth/ViewBooth.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        boothType : 0,
        boothName : "",
        boothList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            boothType : options.boothType,
		})
		if(options.boothType==1){
			this.setData({boothName : "Foods Booth"})
		}else if(options.boothType==2){
			this.setData({boothName : "Games Booth"})
		}else if(options.boothType==3){
			this.setData({boothName : "Main Stage Performances"})
		}else if(options.boothType==4){
			this.setData({boothName : "Hillside Stage Performances"})
		}
    },

    toViewBoothMenu : function(event){
        let boothId = event.currentTarget.dataset.boothid
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ViewBoothMenu/ViewBoothMenu?boothId=' + boothId,
        })
    },

    toImportBoothMenu : function(event){
        let boothId = event.currentTarget.dataset.boothid
        let boothno = event.currentTarget.dataset.boothno
        let boothname = event.currentTarget.dataset.boothname
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/ImportBoothMenu/ImportBoothMenu?boothId=' + boothId + '&boothNo=' + boothno + '&boothName=' + boothname,
        })
	},
	
	addBooth : function(event){
		if(this.data.boothType == 1 || this.data.boothType == 2){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditBooth/EditBooth?boothType=' + this.data.boothType,
			})
		}else if(this.data.boothType == 3 || this.data.boothType == 4){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditBoothShows/EditBoothShows?boothType=' + this.data.boothType,
			})
		}
    },

    toEditBooth : function(event){
		let boothId = event.currentTarget.dataset.boothid
		if(this.data.boothType == 1 || this.data.boothType == 2){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditBooth/EditBooth?boothId=' + boothId,
			})
		}else if(this.data.boothType == 3 || this.data.boothType == 4){
			wx.navigateTo({
				url: '/pages/EventAdmin/BoothManager/EditBoothShows/EditBoothShows?boothId=' + boothId,
			})
		}
    },

    toEditBoothMgr : function(event){
        let boothId = event.currentTarget.dataset.boothid
        let boothno = event.currentTarget.dataset.boothno
        let boothname = event.currentTarget.dataset.boothname
        wx.navigateTo({
            url: '/pages/EventAdmin/BoothManager/EditBoothMgr/EditBoothMgr?boothId=' + boothId + '&boothNo=' + boothno + '&boothName=' + boothname,
        })
	},
	
	deleteBooth : function(event){
		const that = this
        let boothId = event.currentTarget.dataset.boothid
        wx.showModal({
			title: 'Alert',
			content: 'Are you sure to delete it?',
			cancelText : 'Cancel',
			confirmText : 'Ok',
			complete: (res) => {
				if (res.confirm) {
					wx.showLoading({title : 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "cloudfunction",
						data : {
							type : "deleteBooth",
							boothId : boothId,
							boothType : 1
						},
						success : function(res){
							wx.hideLoading()
							wx.showToast({
								title: 'SUCCESS',
								icon : 'success'
							})
							that.onShow()
						},
						fail : function(res){
							wx.hideLoading()
							wx.showToast({
								title: 'Fail',
								icon : 'error'
							})
						},
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
		const that = this
		let sql = "select * from BoothData where booth_type='"+this.data.boothType+"' "
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : sql
            },
            success : function(res){
                that.setData({
                    boothList : res.result
                })
            },
            fail : function(res){
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
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