// pages/EventAdmin/BoothManager/EditLuckyDraw/EditLuckyDraw.js
const dateTimePicker = require('../../../../utils/dateTimePicker.js');
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
		xheight : 500,
		luckyDrawId : 0,
		boothName : "",
		startDate: "",//开始时间数组
        startDate_p: "",//显示的开始时间
        dateTimeArray: '', //时间数组
        startYear: 1998, //最小年份
        endYear: 2002, // 最大年份
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
			xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
			startYear : new Date().getFullYear(),
            endYear : new Date().getFullYear(),
		})

		let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        this.setData({
        	dateTimeArray: obj.dateTimeArray,
		});
		const that = this
		if(options.boothId != undefined){
			this.setData({
				luckyDrawId : options.boothId
			})
		}
	},

	boothNameInput : function(event){
		this.setData({
			boothName : event.detail.value
		})
	},
	
	/**
     * 选择时间
     * @param {*} e 
     */
    changeDateTime(e) {
        let dateTimeArray = this.data.dateTimeArray,
            {
                type,
                param
            } = e.currentTarget.dataset;
        this.setData({
            [type]: e.detail.value,
            [param]: dateTimeArray[0][e.detail.value[0]] + '-' + dateTimeArray[1][e.detail.value[1]] + '-' + dateTimeArray[2][e.detail.value[2]] + ' ' + dateTimeArray[3][e.detail.value[3]] + ':' + dateTimeArray[4][e.detail.value[4]] + ':' + dateTimeArray[5][e.detail.value[5]]
        });
    },
    changeDateTimeColumn(e) {
        var dateArr = this.data.dateTimeArray,
            {
                type
            } = e.currentTarget.dataset,
        arr = this.data[type];
        if(arr.length == 0){
            arr = [0, 0, 0, 0, 0, 0]
        }
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray: dateArr,
            [type]: arr
        });
	},
	
	submitForm: function (event) {
		const that = this
        let boothName = this.data.boothName
        let startDate = this.data.startDate_p
        if (boothName == "" || boothName.length == 0) {
            wx.showToast({
                title: 'Activity Name cannot be empty',
                icon: "none"
            })
            return
		}
		if (startDate == "" || startDate.length == 0) {
            wx.showToast({
                title: 'Lottery time cannot be empty',
                icon: "none"
            })
            return
		}
        wx.cloud.callFunction({
            name: "cloudfunction",
            data: {
                type: "saveLuckyDraw",
				luckyDrawId: this.data.luckyDrawId,
				boothName : boothName,
				drawprizeTime : startDate
            },
            success: function (res) {
				if(res.result.code == 1){
					wx.showToast({
						title: 'Success',
						icon: 'success',
						mask : true,
						duration: 3500,
					})
					const addLuckyDrawId = res.result.addId
					setTimeout(() => {
						if(addLuckyDrawId > 0){
							that.setData({
								luckyDrawId : addLuckyDrawId
							})
							let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
							let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
							prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
								luckyDrawId: addLuckyDrawId
							})
							//上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
						}

						//最后就是返回上一个页面。
						wx.navigateBack({
							delta: 1  // 返回上一级页面。
						})
					}, 3000)
				}else{
					wx.showToast({
						title: 'ERROR',
						icon: 'error',
						duration: 3000
					})
				}
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
		const that = this
		if(this.data.luckyDrawId != undefined && this.data.luckyDrawId != 0){
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "select * from LuckyDraw where booth_ID='"+this.data.luckyDrawId+"'"
				},
				success : function(res){
					that.setData({
						boothName : res.result[0].booth_name,
						startDate_p : util.formatDate_yyyyMMddHHmmss(res.result[0].drawprize_time)
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
		console.log("EditLockyDraw onHide")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
		console.log("EditLockyDraw onUnload", this.data.luckyDrawId)
		if(this.data.luckyDrawId == 0){
			//如果luckyDrawId为0，则多返回一级
			wx.navigateBack({
				delta: 1  // 多返回一级页面。
			})
		}
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