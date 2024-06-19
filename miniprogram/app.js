// app.js

App({
    globalData: {
		theme: 'light', // dark
		mode: '', // 模式(care：关怀模式)
        isInit : true,
        braceletMaxCount : 32,//添加手环最大数量
        buyEagleBucksPayRMB : 1000,//购买EB付款人民币单次上限
        buyLuckyDrawPayRMB : 1000,//购买抽奖券付款人民币单次上限
        dunkTankPayRMB : 2000,//灌水付款人民币单次上限
        eagleBucksBoothPay : 20,//EB摊位付款单次上限
        eagleBucksTransfer : 100,//EB转账单次上限
        braceletNumber : 3300,//生成手环个数
    },

    onLaunch: function () {
        if (!wx.cloud) {
        	console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                env: 'sas-2023if-6gnixjwic1713458',
				traceUser: true,
				timeout: 30000,
            });
		}

        const openid = wx.getStorageSync('openid')
        if(openid != undefined && openid != null && openid != ""){
            wx.reLaunch({
                url: '/pages/Home/Home',
            })
		}
	},
	
	changeGlobalData(data) {
		this.globalData = Object.assign({}, this.globalData, data);
		listeners.forEach((listener) => {
		  	listener(this.globalData);
		});
	},
	watchGlobalDataChanged(listener) {
		if (listeners.indexOf(listener) < 0) {
		  	listeners.push(listener);
		}
	},
	unWatchGlobalDataChanged(listener) {
		const index = listeners.indexOf(listener);
		if (index > -1) {
		  	listeners.splice(index, 1);
		}
	},
	onThemeChange(resp) {
		this.changeGlobalData({
		  	theme: resp.theme,
		});
	},

    onShow : function(){
        const init = this.globalData.isInit
        if(init){
            const that = this
            const openid = wx.getStorageSync('openid')
            if(openid != undefined && openid != null && openid != ""){
                wx.cloud.callFunction({
					name: "cloudfunction",
					data: {
						type: "getUserByOpenId"
					},
					success: function (response) {
						if(response.result.length > 0){
							//wx.setStorageSync('openid', response.result[0].open_ID)
						}else{
							wx.clearStorageSync()
							wx.reLaunch({
								url: '/pages/index/index',
							})
						}
					}
				})
            }else{
				const v = wx.getStorageSync('v')//用于在注册选择头像页面选择头像后跳转到index页面
				if(v == null || v == undefined || v == ""){
					wx.cloud.callFunction({
						name: "cloudfunction",
						data: {
							type: "getUserByOpenId"
						},
						success: function (response) {
							if(response.result.length > 0){
								//wx.setStorageSync('openid', response.result[0].open_ID)
							}else{
								wx.reLaunch({
									url: '/pages/index/index',
								})
							}
						}
					})
				}
            }
        }
	},

	stopPullDownRefresh : function(){
		setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 2500)
	}
});
