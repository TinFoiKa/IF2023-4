// pages/EventAdmin/BoothManager/EditSponsor/EditSponsor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sponsorType : 0,
        sponsorTypeName : "",
        companyId : 0,
        companyName : "",
        description : "",
        errorMsg : "",
        disabled : true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            companyId : options.companyId
        })
    },

    submit : function(){
        if(this.data.companyName == ""){
            that.setData({
                errorMsg : "Company Name cannot be empty",
            })
            return
        }

        const that = this
        wx.showLoading({
            title: 'Loading',
            mask : true
        })
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Sponsors where sponsor_ID != '"+this.data.companyId+"' and sponsor_name='"+this.data.companyName+"'"
            },
            success : function(res){
                if(res.result.length > 0){
                    that.setData({
                        errorMsg : "Company Name already exists",
                    })
                    wx.hideLoading()
                }else{
                    that.setData({
                        errorMsg : "",
                    })
                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "update Sponsors set sponsor_name='"+that.data.companyName+"', sponsor_description='"+that.data.description+"' where sponsor_ID='"+that.data.companyId+"'"
                        },
                        success : function(res){
                            wx.hideLoading()
                            wx.showToast({
                                title: 'SUCCESS',
                                icon : 'success',
								mask : true,
                                duration : 3500,
							})
							setTimeout(() => {
								wx.navigateBack()
							}, 3000)
                        },
                        fail : function(res){
                            wx.hideLoading()
                            that.setData({
                                errorMsg : "fail",
                            })
                        }
                    })
                }
            },
            fail : function(res){
                wx.hideLoading()
                that.setData({
                    errorMsg : "fail",
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
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from Sponsors where sponsor_ID='"+this.data.companyId+"'"
            },
            success : function(res){
                let sponsor_type = res.result[0].sponsor_type
                that.setData({
                    sponsorType : sponsor_type,
                    companyName : res.result[0].sponsor_name,
                    description : res.result[0].sponsor_description,
                    disabled : false
				})
				if(sponsor_type == 1){
					that.setData({sponsorTypeName : "Sponsor"})
				}else if(sponsor_type == 2){
					that.setData({sponsorTypeName : "Vendor"})
				}else{
					that.setData({sponsorTypeName : "Student Market Place"})
				}
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