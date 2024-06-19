// pages/EventAdmin/BoothManager/EditBooth/EditBooth.js
import util from '../../../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        boothId : 0,
        boothType : 0,
        boothNo : "",
        boothName : "",
        boothOrganization : "",
        errorMsg : ""
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
			boothType : options.boothType
        })
    },

    submit : function(){
        if(this.data.boothNo == ""){
            this.setData({
                errorMsg : "Booth No cannot be empty",
            })
            return
        }
        if(this.data.boothName == ""){
            this.setData({
                errorMsg : "Booth Name cannot be empty",
            })
            return
        }
        
        const that = this
        wx.showLoading({title: 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothData where booth_ID != '"+this.data.boothId+"' and booth_no='"+this.data.boothNo+"'"
            },
            success : function(res){
                if(res.result.length > 0){
                    that.setData({
                        errorMsg : "Booth No already exists",
                    })
                    wx.hideLoading()
                }else{
                    that.setData({
                        errorMsg : "",
					})
					let sql = ""
					if(that.data.boothId == undefined){
						let ifqr = util.uuid()
						sql = "insert into BoothData (booth_no, booth_name, booth_organization, booth_type, ifqr) values ('"+that.data.boothNo+"', '"+that.data.boothName+"', '"+that.data.boothOrganization+"', '"+that.data.boothType+"', '"+ifqr+"')"
					}else{
						sql = "update BoothData set booth_no='"+that.data.boothNo+"', booth_name='"+that.data.boothName+"', booth_organization='"+that.data.boothOrganization+"' where booth_ID='"+that.data.boothId+"'"
					}

                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : sql
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
		if(this.data.boothId != undefined){
			const that = this
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "select * from BoothData where booth_ID='"+this.data.boothId+"'"
				},
				success : function(res){
					console.log("onload res", res)
					that.setData({
						boothType : res.result[0].booth_type,
						boothNo : res.result[0].booth_no,
						boothName : res.result[0].booth_name,
						boothOrganization : res.result[0].booth_organization
					})
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