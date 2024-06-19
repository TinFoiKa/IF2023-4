// pages/EventAdmin/DisableAccountList/DisableAccountList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        disableUserList : [],
        popup_hidden: false,
        searchInp : "",
        notSelectUserList : [],
		selectUserList : [],
		totalAccountCount : 0
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
    },

    toSelectUser : function(event){
        this.setData({
            popup_hidden: true,
        })

		this.getTotalAccountCount()
		this.searchBtn()
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
                            sql : "update Users set is_Disable=0 where open_ID='"+userId+"'"
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
                sql : "select a.* from Users a where a.is_Disable=0 and (a.if_ID like '%"+this.data.searchInp+"%') order by a.if_ID asc"// or a.username like '%"+this.data.searchInp+"%' or a.phone_num like '%"+this.data.searchInp+"%'
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
				// 	title: 'Timeout',
				// 	icon : 'error'
				// })
            }
        })
    },

    change : function(event){
        this.setData({
            selectUserList : event.detail.value
		})
		console.log("selectUserList", this.data.selectUserList)
    },

    submit : function(){
        const that = this
        if(this.data.selectUserList.length > 0){
			wx.showLoading({title : 'Loading', mask : true})
			let userIds = ""
			for(let i=0;i<this.data.selectUserList.length;i++){
				if(userIds.length > 0){
					userIds += ","
				}
				userIds += "'"+this.data.selectUserList[i]+"'"
			}

            wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "update Users set is_Disable=1 where open_ID in ("+userIds+")"
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
                    console.log("disable user fail", res)
                    wx.showToast({
                        title: 'Fail',
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
		this.getDisableUserList()
	},

	getDisableUserList : function(){
		const that = this
		wx.showLoading({title : 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select a.* from Users a where a.is_Disable=1 order by a.if_ID asc"
            },
            success : function(res){
				wx.hideLoading()
                that.setData({
                    disableUserList : res.result
                })
            },
            fail : function(res){
				wx.hideLoading()
                console.log("DisableAccountList onLoad timeout", res)
                // wx.showToast({
                //     title: "Load timeout",
                //     icon : "error"
                // })
            }
        })
	},
	
	getTotalAccountCount : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select count(*) as userTotalCount from Users"
			},
			success : function(res){
				console.log("res userTotalCount", res)
				that.setData({
					totalAccountCount : res.result[0].userTotalCount
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: 'Load timeout',
				// 	icon : 'error'
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