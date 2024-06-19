// pages/wechatLogin/wechatLogin.js
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
		height : 0,
        phone : "",
        nickName : "",
        isUploadAvatar : false,
		avatarUrl: "cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/images/login_avatar.png",
		nickNameFocus : false,
		isDisabled : true,
    },
	
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		const sysInfo = wx.getSystemInfoSync()
        let phoneNumber = options.phoneNumber
        this.setData({
			height : sysInfo.windowHeight,
            phone : phoneNumber
		})
		wx.setStorageSync('v', "A")
		wx.hideHomeButton()
    },

    onChooseAvatar(e) {
		console.log("onChooseAvatar", e)
		const { avatarUrl } = e.detail 
		let disabled = true
		if(this.data.nickName.length > 0){
			disabled = false
		}
        this.setData({
            avatarUrl,
			isUploadAvatar : true,
			isDisabled : disabled
        })
    },

    nicknameInput : function(e){
		let disabled = true
		//检测是否含有表情
		let value = e.detail.value
		var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
		if(value.match(regRule)){
			value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
		}
        this.setData({
			nickName : value
        })
		if(this.data.nickName.length > 0 && this.data.isUploadAvatar){
			disabled = false
		}
		this.setData({
			isDisabled : disabled
        })
    },

    nicknameBlur : function(e){
		let disabled = true
		//检测是否含有表情
		let value = e.detail.value
		var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
		if(value.match(regRule)){
			value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
			if(value.length == 0){
				value = "IF23 User"
			}
		}
        this.setData({
			nickName : value
        })
		if(this.data.nickName.length > 0 && this.data.isUploadAvatar){
			disabled = false
		}
		this.setData({
			isDisabled : disabled
        })
    },

    register : function(){
        if(!this.data.isUploadAvatar){
            wx.showToast({
                title: 'Please select a avatar',
                icon: 'none'
            })
            return;
        }
        if(this.data.nickName.length == 0){
			this.setData({
				nickNameFocus : true
			})
            return;
        }
        let that = this
        wx.showLoading({title:'Loading', mask : true})
        let urls = this.data.avatarUrl.split(".")
        let suffix = urls[1]

        wx.cloud.uploadFile({
            cloudPath: "uploadFile/" + new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix,
            filePath: this.data.avatarUrl,
            success(res) {
                let fileID = res.fileID  
                let ifqr = util.uuid()
                wx.cloud.callFunction({
                    name : "cloudfunction",
                    data : {
                        type : "register",
                        phone : that.data.phone,
                        avatarUrl : fileID,
                        nickName : that.data.nickName,
                        ifqr : ifqr
                    },
                    success : function(res){
                        if(res.result.code > 0){
							wx.setStorageSync('openid', res.result.openid)
                            if(res.result.code == 1){
								//有账号，直接进入
								// that.deleteFile(fileID)
                                // wx.switchTab({
                                //     url: '/pages/Home/Home',
								// })
								wx.reLaunch({
                                    url: '/pages/Tutorial/Tutorial',
                                })
                            }if(res.result.code == -1){
								//注册失败，或登录失败
                                wx.showModal({
									title : "Error",
									content : "Login failed",
									showCancel : false,
									confirmText : "Ok"
								})
								that.deleteFile(fileID)
                            }else{
								//没有账号，进入操作指导页面
                                wx.reLaunch({
                                    url: '/pages/Tutorial/Tutorial',
                                })
                            }
                            wx.hideLoading()
                        }else{
                            wx.showModal({
                                title : "Error",
                                content : "Login failed",
                                showCancel : false,
                                confirmText : "Ok"
							})
							that.deleteFile(fileID)
                            wx.hideLoading()
                        }
                    },
                    fail : function(res){
                        console.log("cloudfunction fail", res)
                        that.deleteFile(fileID)
                        wx.hideLoading()
                    }
                })
            },
            fail : function(err){
                console.log("err", err)
                wx.hideLoading()
            }
        })
	},
	
	deleteFile(fileID){
		wx.cloud.deleteFile({
			fileList: [fileID],
			success(res) {
				console.log('Deleted file successfully')
			},
			fail(err) {
				console.log('Failed to delete file', err)
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
		wx.removeStorageSync('v')
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

    },
})