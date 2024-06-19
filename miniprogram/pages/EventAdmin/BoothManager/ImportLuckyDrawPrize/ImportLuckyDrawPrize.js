// pages/EventAdmin/BoothManager/ImportLuckyDrawPrize/ImportLuckyDrawPrize.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		boothId : 0,
        isUpload : true,
        errorInfos : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		this.setData({
            boothId : options.boothId,
        })
	},
	
	//下载导入摊位菜单模板
    download : function(){
        wx.cloud.downloadFile({
            fileID : 'cloud://sas-2023if-6gnixjwic1713458.7361-sas-2023if-6gnixjwic1713458-1300310271/template/ImportLuckyDrawPrize.xlsx',
            success : function(res){
                if(res.statusCode == 200){
                    const filePath = res.tempFilePath
                    wx.showToast({
                        title: 'Download successful',
                        icon: "none",
                        duration: 1500
                    })
                    // wx.cloud.deleteFile({
                    //     fileList: [fileID],
                    //     success(res) {
                    //         console.log('Deleted file successfully')
                    //     },
                    //     fail(err) {
                    //         console.log(err)
                    //     }
                    // })
                    setTimeout(() => {
                        wx.openDocument({
                            filePath : filePath,
                            showMenu : true,
                            fileType : 'xlsx',
                            success: function (res) {
                                console.log('打开文档成功')
                            }
                        })
                    }, 1000)
                }else{
                    wx.showToast({
                        title : 'Download failed',
                        icon : 'none'
                    })
                }
            },
            fail : function(err){
                console.log("fail", err)
                wx.showToast({
                    title : 'Download error',
                    icon : 'none'
                })
            }
        })
    },

    import(e) {
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            extension : ["xls", "xlsx"],
            success(res) {
                wx.showLoading({title : 'Loading', mask : true})
                let path = res.tempFiles[0].path;
                // 上传云存储
                that.uploadExcel(path);
            },
            fail : function(res){
                console.log("取消上传")
            }
        })
    },
    
    // 上传云存储excel
    uploadExcel(path) {
        let urls = path.split(".")
        let suffix = urls[1]

        let that = this;
        wx.cloud.uploadFile({
			cloudPath: "uploadFile/" + new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix,
            filePath: path,
            success(res) {
                // 云函数解析excle文件
                that.jiexiadd(res.fileID);
            },
            fail : function(err){
				wx.hideLoading()
            }
        })
    },
    
    // 云函数解析excel文件
    jiexiadd(fileID) {
        console.log("进入解析excel文件");
        var that = this;
        wx.cloud.callFunction({
            name: 'cloudfunction',
            data: {
                type : 'readExcel',
                fileID: fileID
            }
        }).then(res => {
            console.log("解析并上传成功：", res);
            let data = res.result[0][0].data

            wx.cloud.callFunction({
                name : "cloudfunction",
                data : {
                    type : "saveImportLuckyDrawPrize",
                    boothId : that.data.boothId,
                    prizeData : data
                },
                success : function(res){
                    wx.hideLoading()
                    that.setData({
                        isUpload : false,
                    })
                    if(res.result.code != 1){
                        that.setData({
                            errorInfos : res.result.errorInfos
                        })
                    }
					wx.cloud.deleteFile({
                        fileList: [fileID],
                        success(res) {
                            console.log('Deleted file successfully')
                        },
                        fail(err) {
                            console.log('Deleted file successfully', err)
                        }
                    })
                },
                fail : function(err){
                    console.log("fail res", err)
					wx.hideLoading()
					wx.cloud.deleteFile({
                        fileList: [fileID],
                        success(res) {
                            console.log('Deleted file successfully')
                        },
                        fail(err) {
                            console.log('Deleted file successfully', err)
                        }
                    })
                }
            })
        }).catch(err => {
            console.log("解析失败：", err)
            wx.hideLoading()

            wx.cloud.deleteFile({
                fileList: [fileID],
                success(res) {
                    console.log('Deleted file successfully')
                },
                fail(err) {
                    console.log('Deleted file successfully', err)
                }
            })
        });
    },

    continueImporting : function(){
        this.setData({
            isUpload : true,
            errorInfos : []
        })
    },

    goBack : function(){
        wx.navigateBack()
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