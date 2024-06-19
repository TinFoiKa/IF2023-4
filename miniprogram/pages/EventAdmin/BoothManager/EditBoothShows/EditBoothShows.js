// pages/EventAdmin/BoothManager/EditBoothShows/EditBoothShows.js
import util from '../../../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        boothId : 0,
		boothType : 0,
        startTime : "",
        endTime : "",
        title : "",
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
	
	bindShowDateChange:function(e){
        var checkShowDate = e.detail.value;
        console.log("checkShowDate", checkShowDate)
        this.setData({
            showDate:checkShowDate
        })
    },

    submit : function(){
        if(this.data.startTime == ""){
            this.setData({
                errorMsg : "Start Time cannot be empty",
            })
            return
		}
		if(this.data.endTime == ""){
            this.setData({
                errorMsg : "End Time cannot be empty",
            })
            return
        }
        if(this.data.title == ""){
            this.setData({
                errorMsg : "Title cannot be empty",
            })
            return
        }
        
        const that = this
        wx.showLoading({title: 'Loading', mask : true})
        that.setData({
			errorMsg : "",
		})
		let sql = ""
		if(that.data.boothId == undefined){
			let ifqr = util.uuid()
			sql = "insert into BoothData (start_time, end_time, booth_name, booth_organization, booth_type, ifqr) values ('"+that.data.startTime+"', '"+that.data.endTime+"', '"+that.data.title+"', '"+that.data.boothOrganization+"', '"+that.data.boothType+"', '"+ifqr+"')"
		}else{
			sql = "update BoothData set start_time='"+that.data.startTime+"', end_time='"+that.data.endTime+"', booth_name='"+that.data.title+"', booth_organization='"+that.data.boothOrganization+"' where booth_ID='"+that.data.boothId+"'"
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
						startTime : res.result[0].start_time,
						endTime : res.result[0].end_time,
						title : res.result[0].booth_name,
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