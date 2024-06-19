// pages/Tutorial/Tutorial.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_1.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_2.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_3.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_4.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_5.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_6.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_7.jpg',
            'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/tutorial_8.jpg',
          ],
          letsGo : false,
		  height : 0,
		  skipHeight : 0,
		  tutorialType : 0,
		  currentIndex : 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideHomeButton()
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		const sysInfo = wx.getSystemInfoSync()
        this.setData({
			height : sysInfo.screenHeight
		})
		let menu = wx.getMenuButtonBoundingClientRect()
		let bottom = menu.bottom
		this.setData({
			skipHeight : bottom + 20
		})
		if(options.tutorialType != undefined){
			this.setData({
				tutorialType : options.tutorialType
			})
			if(options.tutorialType == 1){//Eagle Bucks页面
				this.setData({currentIndex : 3})
			}else if(options.tutorialType == 2){//购买EB
				this.setData({currentIndex : 3})
			}else if(options.tutorialType == 3){//抽奖游戏
				this.setData({currentIndex : 7})
			}else if(options.tutorialType == 4){//灌水游戏
				this.setData({currentIndex : 6})
			}
		}
    },

    change : function(event){
        const current = event.detail.current
        if(current == this.data.imgUrls.length - 1){
            this.setData({
                letsGo : true
            })
        }
    },

    tutorial : function(){
		if(this.data.tutorialType == 0){
			wx.switchTab({
				url: '/pages/Home/Home',
			})
		}else{
			wx.navigateBack()
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
        wx.hideHomeButton()
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