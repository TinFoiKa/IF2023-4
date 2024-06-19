// pages/EventAdmin/BoothManager/ViewLuckyDrawCommodity/EditLuckyDrawCommodity/EditLuckyDrawCommodity.js
const dateTimePicker = require('../../../../../utils/dateTimePicker.js');
const util = require('../../../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight: 500,
        id: 0,
        commodityInfo: {},
        startDate: "",//开始时间数组
        endDate: "",//结束时间数组
        startDate_p: "",//显示的开始时间
        endDate_p: "",//显示的结束时间

        dateTimeArray: '', //时间数组
        startYear: 1998, //最小年份
        endYear: 2002, // 最大年份
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        var h = wx.getSystemInfoSync().windowHeight;
        this.setData({
            xheight: (wx.getSystemInfoSync().windowHeight - 150) + 'px',
            startYear : new Date().getFullYear(),
            endYear : new Date().getFullYear(),
        })

        let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        this.setData({
        	dateTimeArray: obj.dateTimeArray,
        });

        let id = options.id
        if (id != undefined && id != null && id != "") {
            this.setData({
                id: id
            })
        }
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
        let name = event.detail.value.name
        let number = event.detail.value.number
        let price = event.detail.value.price
        if (name == "" || name.length == 0) {
            wx.showToast({
                title: 'Trade Name cannot be empty',
                icon: "none"
            })
            return
        }
        if (number == "" || number.length == 0 || number <= 0) {
            wx.showToast({
                title: 'Number of tickets must be greater than 0',
                icon: "none"
            })
            return
        }
        if (price == "" || price.length == 0 || price <= 0) {
            wx.showToast({
                title: 'Price must be greater than 0',
                icon: "none"
            })
            return
        }
        let sql = ""
        if (this.data.id == 0) {
            let status = 1
            sql = "insert into LuckyDrawCommodity (name, number, price, startDate, endDate, status) values ('" + name + "', '" + number + "', '" + price + "', '" + this.data.startDate_p + "', '" + this.data.endDate_p + "', '" + status + "')"
        } else {
            sql = "update LuckyDrawCommodity set name='" + name + "', number='" + number + "', price='" + price + "', startDate='" + this.data.startDate_p + "', endDate='" + this.data.endDate_p + "' where ID='" + this.data.id + "'"
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
					mask : true,
                    duration: 3500,
                })
				setTimeout(() => {
					wx.navigateBack()
				}, 3000)
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
        if (this.data.id != 0) {
            wx.showLoading({title: 'Loading', mask: true})
            wx.cloud.callFunction({
                name: "executeSql",
                data: {
                    sql: "select * from LuckyDrawCommodity where ID='" + this.data.id + "'"
                },
                success: function (res) {
                    wx.hideLoading()
                    let startDate = util.formatDate_yyyyMMddHHmmss(res.result[0].startDate)
                    let endDate = util.formatDate_yyyyMMddHHmmss(res.result[0].endDate)
                    that.setData({
                        commodityInfo: res.result[0],
                        startDate_p : startDate,
                        endDate_p : endDate,
                        startDate: dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, startDate).dateTime,
        	            endDate: dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, endDate).dateTime,
                    })

                },
                fail: function (res) {
                    wx.hideLoading()
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