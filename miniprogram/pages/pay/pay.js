// pages/pay/pay.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		content: '',
		KeyboardKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'],
		keyShow: true,
		dunkTankId : 0,
		dunkTank : {},
		isCanPay : false,
		activityEvent : {},
		activityStatus : 0,//0未开始，1活动未到开始时间，2活动进行中，3活动已到结束时间，4活动已强制结束
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
			dunkTankId : options.dunkTankId
		})
	},

	//点击界面键盘消失
	hindKeyboard() {
		this.setData({
			keyShow: false
		});
	},
	//点击输入框，键盘显示
	showKeyboard() {
		this.setData({
			keyShow: true
		});
	},
	keyTap(e) {
		let keys = e.currentTarget.dataset.keys,
			content = this.data.content,
			len = content.length;

		switch (keys) {
			case '·': //点击小数点，（注意输入字符串里的是小数点，但是我界面显示的点不是小数点，是居中的点，在中文输入法下按键盘最左边从上往下数的第二个键，也就是数字键1左边的键可以打出居中的点）
				if (len < 11 && content.indexOf('.') == -1) { //如果字符串里有小数点了，则不能继续输入小数点，且控制最多可输入10个字符串
					if (content.length < 1) { //如果小数点是第一个输入，那么在字符串前面补上一个0，让其变成0.
						content = '0.';
					} else { //如果不是第一个输入小数点，那么直接在字符串里加上小数点
						content += '.';
					}
				}
				break;
			case '<': //如果点击删除键就删除字符串里的最后一个
				content = content.substr(0, content.length - 1);
				break;
			default:
				let Index = content.indexOf('.'); //小数点在字符串中的位置
				if (Index == -1 || len - Index != 3) { //这里控制小数点只保留两位
					if (len < 11) { //控制最多可输入10个字符串
						content += keys;
					}
				}
				break
		}

		this.setData({
			content
		});
	},

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

	payment : function(){
		const that = this
		const status = this.findActivityStatus()
		if(!status){
			return
		}

		if(this.data.isCanPay){
			wx.showModal({
				title : "Alert",
				content : "Target amount reached, stop payment",//已达到目标金额，停止付款
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}
		let dunkTankState = 0
		if(this.data.activityEvent.activity_ID != undefined){
			dunkTankState = this.data.activityEvent.dunkTank_state
		}
		if(dunkTankState == 0){
			wx.showModal({
				title : "Alert",
				content : "Dunk tank not turned on",//灌水游戏未开启
				showCancel : false,
				confirmText : "Ok",
			})
			return
		}

		let amount = this.data.content
		if(amount == ""){
			wx.showToast({
				title: 'Please enter the payment amount',
				icon : "none"  
			})
			return
		}
		if(amount == 0){
			wx.showToast({
				title: 'Amount cannot be less than 0',
				icon : "none"  
			})
			return
		}
		const dunkTankPayRMB = app.globalData.dunkTankPayRMB
        if(amount > dunkTankPayRMB){
            wx.showModal({
                title : "Alert",
                content : "The limit of amount in each payment is "+dunkTankPayRMB+", please enter another amount.",
                showCancel : false,
                confirmText : "Ok"
            })
            return
		}
		wx.showModal({
            title : "Alert",
            content : "The payment is Non-refundable",
            cancelText : "Cancel",
            confirmText : "Ok",
            success : function(res){
                if(res.confirm){
					wx.showModal({
						title : "Alert",
						content : "The amount of payment you wish to make is RMB "+amount+".",
						cancelText : "Cancel",
						confirmText : "Ok",
						success : function(res){
							if(res.confirm){
								var timeStamp = Date.parse(new Date());
								let formData = amount
								let orderId = "IF2023-" + timeStamp
								console.log('form发生了submit事件，携带数据为：', formData)
								wx.cloud.callFunction({
									name: "cloudpayDunkTank",
									data: {
										orderId : orderId,//订单ID
										boothId : that.data.dunkTankId,//摊位ID
										payment : formData * 100//付款金额RMB（元）
									},
									success(res) {
										console.log("提交成功", res.result)
										const payment = res.result.payment
						              	wx.requestPayment({
			    							...payment,
			                				success (res) {
							                  	console.log('pay success', res)
												wx.showToast({
													title: 'SUCCESS',
													icon : "success"  
												})
												setTimeout(() => {
													wx.navigateBack()
												}, 2000)
							                },
							                fail (err) {
							                  	console.error('pay fail', err)
							                }
						              	})
									},
									fail(res) {
										console.log("提交失败", res)
										wx.showModal({
											title : "Alert",
											content : "Submission failed",
											showCancel : false,
											confirmText : "Ok"
										})
									}
								})
							}
						}
					})
				}
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.getActivityStatus()
		this.getActivityEvent()
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.loadDunkTank()
	},

	getActivityEvent(){
		const that = this
		wx.showLoading({title: 'Loading', mask : true})
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
				wx.hideLoading()
                if(res.result != null && res.result.length > 0){
                    that.setData({
						activityEvent : res.result[0],
					})
                }
            },
            fail : function(res){
				wx.hideLoading()
                wx.showToast({
                    title: "Load timeout",
                    icon : "error"
                })
            }
        })
	},

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
					isCanPay : dis
				})
			},
			fail : function(res){
				wx.showToast({
                    title: "Load timeout",
                    icon : "error"
                })
			},
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})