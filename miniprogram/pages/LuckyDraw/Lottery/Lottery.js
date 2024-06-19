// pages/LuckyDraw/Lottery/Lottery.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		luckyDrawId : 0,
		luckyDraw : {},
		prizeId : 0,
		prize : {},
		prizeList : [],
		ticketNoAll : [],
		luckyDrawTicketNo : [],

        result: '',//中奖结果
		isStart: false,//是否正在抽奖
		lotteryRemainTime : 5,
		initLotteryTime : 5,
		disabled : false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		console.log("options", options)
		this.setData({
			luckyDrawId : options.luckyDrawId,
			prizeId : options.prizeId
		})
	},

	back: function(){
		wx.navigateBack()
	},
	
	startLottery: function () {
		const that = this
        if (this.data.isStart) {
            return
		}
		wx.showModal({
			title : "Alert",
			content : "Are you sure to start the lottery？",//确定开始抽奖吗
			cancelText : "Cancel",
			confirmText : "Ok",
			success : function(res){
				if(res.confirm){
					wx.showLoading({title : 'Loading', mask : true})
					wx.cloud.callFunction({
						name : "executeSql",
						data : {
							sql : "select ticket_ID, ticket_no, open_ID from LuckyDrawTickets where booth_ID='"+that.data.luckyDrawId+"'"
						},
						success : function(res){
							if(res.result == null || res.result.length==0){
								wx.showModal({
									title : "Alert",
									content : "No users have purchased lottery tickets!",//没有用户购买奖券
									showCancel : false,
									confirmText : "Ok"
								})
								wx.hideLoading()
							}else{
								that.setData({
									ticketNoAll : res.result,
									luckyDrawTicketNo : res.result
								})
								if(that.data.ticketNoAll.length >= that.data.prizeList.length){
									//奖券数量大于奖品数量，中奖的奖券将不再抽取
									wx.cloud.callFunction({
										name : "executeSql",
										data : {
											sql : "select ticket_ID, ticket_no, open_ID from LuckyDrawTickets where booth_ID='"+that.data.luckyDrawId+"' and ticket_ID not in (select ticket_ID from LuckyDrawPrize where booth_ID='"+that.data.luckyDrawId+"')"
										},
										success : function(res){
											that.setData({
												luckyDrawTicketNo : res.result
											})
											that.startDraw()
											wx.hideLoading()
										},
										fail : function(res){
											wx.showToast({
												title: "Data acquisition failed",
												icon : "error"
											})
											wx.hideLoading()
										}
									})
								}else{
									that.startDraw()
									wx.hideLoading()
								}
							}
						},
						fail : function(res){
							wx.showToast({
								title: "Data acquisition failed",
								icon : "error"
							})
							wx.hideLoading()
						}
					})
				}
			}
		})
	},
	
	startDraw : function(){
		const that = this
		this.setData({
			isStart: true,
			disabled : true,
		})
		let timer = setInterval(() => {
			let curIndex = Math.floor(Math.random()*that.data.ticketNoAll.length)
			that.setData({
				result: that.data.ticketNoAll[curIndex].ticket_no,
			})
		}, 50)
		let timer2 = setInterval(() => {
			that.setData({
				lotteryRemainTime: that.data.lotteryRemainTime - 1,
			})
		}, 1000)

		setTimeout(() => {
			clearInterval(timer)
			clearInterval(timer2)

			let winIndex = Math.floor(Math.random()*that.data.luckyDrawTicketNo.length)
			that.setData({
				result: that.data.luckyDrawTicketNo[winIndex].ticket_no,
			})
			let winTicket = that.data.luckyDrawTicketNo[winIndex]

			that.setData({
				isStart: false,
			})
			wx.showLoading({title : 'Loading', mask : true})
			wx.cloud.callFunction({
				name : "executeSql",
				data : {
					sql : "update LuckyDrawPrize set ticket_ID='"+winTicket.ticket_ID+"', win_open_id='"+winTicket.open_ID+"' where prize_ID='"+that.data.prizeId+"'"
				},
				success : function(res){
					wx.hideLoading()
					if(that.data.luckyDraw.isOpen == 0){
						that.updateLuckyDrawState()
					}
					wx.showModal({
						title: 'Winner',
						content: that.data.result,
						showCancel: false,
						confirmText : "Ok",
						complete : function(res){
							if(res.confirm){
								
							}
						}
					})
				},
				fail : function(res){
					wx.hideLoading()
					wx.showModal({
						title: 'Alert',
						content: "Fail",//抽奖失败
						showCancel: false,
						confirmText : "Ok",
						complete : function(res){
							if(res.confirm){
								that.setData({
									lotteryRemainTime : that.data.initLotteryTime,
									disabled : false,
								});
							}
						}
					})
				}
			})
		}, that.data.lotteryRemainTime * 1000)
	},

	updateLuckyDrawState(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "update LuckyDraw set isOpen='1' where booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				console.log("success update LuckyDraw isOpen")
				that.onShow()
			},
			fail : function(res){
				console.log("fail update LuckyDraw isOpen")
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
		this.getPrizeInfo()
		this.getLuckyDrawPrize()
		this.getLuckyDraw()
	},

	getPrizeInfo : function(){
		const that = this
		//查询当前抽奖奖品Check the current prize draw
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDrawPrize where prize_ID='"+this.data.prizeId+"'"
			},
			success : function(res){
				that.setData({
					prize : res.result[0]
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
                //     icon : "error"
				// })
			}
		})
	},

	getLuckyDrawPrize : function(){
		const that = this
		//查询当前抽奖轮次所有奖品Query all prizes in the current lottery round
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDrawPrize where booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				that.setData({
					prizeList : res.result
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
                //     icon : "error"
				// })
			}
		})
	},
	
	getLuckyDraw : function(){
		const that = this
		wx.cloud.callFunction({
			name : "executeSql",
			data : {
				sql : "select * from LuckyDraw where booth_ID='"+this.data.luckyDrawId+"'"
			},
			success : function(res){
				that.setData({
					luckyDraw : res.result[0]
				})
			},
			fail : function(res){
				console.log(res)
				// wx.showToast({
				// 	title: "Load timeout",
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