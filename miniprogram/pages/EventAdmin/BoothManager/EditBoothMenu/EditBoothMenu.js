// pages/EventAdmin/BoothManager/EditBoothMenu/EditBoothMenu.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menuId : 0,
        boothId : 0,
        menuName : "",
        isUpload : false,
        oldMenuIcon : "",
        menuIcon : "",
		disabled : false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
        this.setData({
            menuId : options.menuId
        })
    },

    selectImage : function(){
        const that = this
        wx.chooseMedia({
            count : 1,
            mediaType : "image",
            success : function(res){
                that.setData({
					menuIcon : res.tempFiles[0].tempFilePath,
					disabled : true,
                })
            }
        })
    },

    submit : function(){
        if(this.data.menuName == ""){
            wx.showToast({
                title: 'Menu Name cannot be empty',
                icon : 'none'
            })
            return
        }
        wx.showLoading({title : 'Loading', mask : true})
        const that = this
        let menuIcon = this.data.menuIcon
        if(this.data.disabled){
            let path = menuIcon.split(".")
            let suffix = path[1]
            wx.cloud.uploadFile({
                cloudPath: "uploadFile/" + new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix,
                filePath: menuIcon,
                success : function(res) {
                    let fileID = res.fileID;

                    wx.cloud.callFunction({
                        name : "executeSql",
                        data : {
                            sql : "update BoothMenu set menu_name='"+that.data.menuName+"', icon='"+fileID+"' where menu_ID='"+that.data.menuId+"'"
                        },
                        success : function(res){
                            if(res.result.affectedRows > 0){
                                if(that.data.oldMenuIcon != ""){
                                    let fileID = that.data.oldMenuIcon
                                    wx.cloud.deleteFile({
                                        fileList: [fileID],
                                        success(res) {
                                            console.log('删除旧图片成功')
                                        },
                                        fail(err) {
                                            console.log('删除旧图片失败', err)
                                        }
                                    })
                                }
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
                            }else{
                                wx.cloud.deleteFile({
                                    fileList: [fileID],
                                    success(res) {
                                        console.log('Deleted file successfully')
                                    },
                                    fail(err) {
                                        console.log('Failed to delete file', err)
                                    }
                                })
                                wx.hideLoading()
                                wx.showToast({
                                    title: 'fail',
                                    icon : 'error'
                                })
                            }
                        },
                        fail : function(res){
                            console.log("修改菜单失败", res)
                            wx.cloud.deleteFile({
                                fileList: [fileID],
                                success(res) {
                                    console.log('Deleted file successfully')
                                },
                                fail(err) {
                                    console.log('Failed to delete file', err)
                                }
                            })
                            wx.hideLoading()
                        }
                    })
                },
                fail : function(err){
                    wx.hideLoading()
                }
            })
        }else{
            wx.cloud.callFunction({
                name : "executeSql",
                data : {
                    sql : "update BoothMenu set menu_name='"+that.data.menuName+"' where menu_ID='"+that.data.menuId+"'"
                },
                success : function(res){
                    wx.hideLoading()
                    if(res.result.affectedRows > 0){
						wx.showToast({
							title: 'SUCCESS',
							icon : 'success',
							mask : true,
							duration : 3500,
						})
						setTimeout(() => {
							wx.navigateBack()
						}, 3000)
                    }else{
                        wx.hideLoading()
                        wx.showToast({
                            title: 'fail',
                            icon : 'error'
                        })
                    }
                },
                fail : function(res){
                    console.log("修改菜单失败", res)
                    wx.cloud.deleteFile({
                        fileList: [fileID],
                        success(res) {
                            console.log('Deleted file successfully')
                        },
                        fail(err) {
                            console.log('Failed to delete file', err)
                        }
                    })
                    wx.hideLoading()
                }
            })
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
		const that = this
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from BoothMenu where menu_ID='"+this.data.menuId+"'"
            },
            success : function(res){
                that.setData({
                    boothId : res.result[0].booth_ID,
                    menuName : res.result[0].menu_name,
                    oldMenuIcon : res.result[0].icon,
                    menuIcon : res.result[0].icon
                })
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