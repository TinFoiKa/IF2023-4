// pages/EventAdmin/BoothManager/EditBoothMgr/EditBoothMgr.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        boothId : 0,
        boothNo : "",
        boothName : "",
        userList : [],
        popup_hidden: false,
        searchInp : "",
        notSelectUserList : [],
        selectUserList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
			xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
            boothId : options.boothId,
            boothNo : options.boothNo,
            boothName : options.boothName
        })
    },

    toSelectUser : function(event){
        this.setData({
            popup_hidden: true,
		})
		this.searchBtn()
    },

    changeStatus : function(event){
        const that=this
        let userId = event.currentTarget.dataset.userid
        let status = event.detail.value
        wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "update BoothManagers set status="+status+" where booth_id='"+that.data.boothId+"' and open_id='"+userId+"' and booth_type=1"
            },
            success : function(res){
                wx.hideLoading()
            },
            fail : function(res){
                wx.hideLoading()
                wx.showToast({
                    title: 'Load timeout',
                    icon : 'error'
                })
            }
        })
    },

    deleteUser : function(event){
        const that = this
        wx.showModal({
            title : "",
            content : "Are you sure to delete?",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
                    let userId = event.currentTarget.dataset.userid
                    wx.showLoading({title : 'Loading', mask : true})
                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "delete from BoothManagers where booth_id='"+that.data.boothId+"' and open_id='"+userId+"' and booth_type=1"
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
                                title: 'Load timeout',
                                icon : 'error'
                            })
                        }
                    })
                }
            }
        })
    },

    cancelPopup : function(event){
        this.setData({
			notSelectUserList : [],
			selectUserList : [],
			popup_hidden: false,
        })
	},

    searchBtn : function(){
        const that = this
		wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Users a where a.open_ID not in (select b.open_ID from BoothManagers b) and (a.if_ID like '%"+this.data.searchInp+"%') order by a.if_ID asc"
            },
            success : function(res){
				wx.hideLoading()
                that.setData({
                    notSelectUserList : res.result,
                    selectUserList : []
                })
            },
            fail : function(res){
				wx.hideLoading()
				console.log("toSelectUser fail", res)
				// wx.showToast({
                //     title: 'Timeout',
                //     icon : 'error'
                // })
            }
        })
    },

    change : function(event){
        this.setData({
            selectUserList : event.detail.value
        })
    },

    submit : function(){
        const that = this
        if(this.data.selectUserList.length > 0){
            wx.showLoading({title : 'Loading', mask : true})
            wx.cloud.callFunction({
                name : "cloudfunction",
                data : {
					type : "saveBoothManager",
					boothType : 1,
                    boothId : this.data.boothId,
                    userIdList : this.data.selectUserList
                },
                success : function(res){
                    wx.hideLoading()
                    wx.showToast({
                        title: 'SUCCESS',
                        icon : 'success'
                    })
                },
                fail : function(res){
                    wx.hideLoading()
                    console.log("Add Booth Manager fail", res)
                    wx.showToast({
                        title: 'fail',
                        icon : 'error'
                    })
                },
                complete : function(){
                    that.setData({
                        notSelectUserList : [],
                        selectUserList : [],
                        searchInp : "",
                        popup_hidden: false,
                    })
                    that.onShow()
                }
            })
        }else{
            this.setData({
                notSelectUserList : [],
                selectUserList : [],
                popup_hidden: false,
            })
        }
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
		wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select a.status, b.* from BoothManagers a inner join Users b on a.open_id=b.open_ID where a.booth_id='"+this.data.boothId+"' and booth_type=1"
            },
            success : function(res){
				wx.hideLoading()
                that.setData({
                    userList : res.result
                })
            },
            fail : function(res){
				wx.hideLoading()
                console.log("EditBoothMgr onLoad fail")
                // wx.showToast({
                //     title: "Load timeout",
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