// pages/EventAdmin/EventSetting/EventSetting.js
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xheight : 500,
        activityId : 0,
		activityEvent : {},
		
        videoUrl : "",
		videoFileName : "",
		isDeleteOldVideoFile : false,
        newVideoUrl : "",
        newVideoFileName : "",
		videoProgress : "",//上传进度
		
        mapUrl : "",
		mapFileName : "",
		isDeleteOldMapFile : false,
        newMapUrl : "",
        newMapFileName : "",
		mapProgress : "",//上传进度

		foodUrl : "",
		foodFileName : "",
		isDeleteOldFoodFile : false,
        newFoodUrl : "",
        newFoodFileName : "",
		foodProgress : "",//上传进度
		foodDesc : "",

		gameUrl : "",
		gameFileName : "",
		isDeleteOldGameFile : false,
        newGameUrl : "",
        newGameFileName : "",
		gameProgress : "",//上传进度
		gameDesc : "",

		performancesMainUrl : "",
		performancesMainFileName : "",
		isDeleteOldPerformancesMainFile : false,
        newPerformancesMainUrl : "",
        newPerformancesMainFileName : "",
		performancesMainProgress : "",//上传进度
		performancesMainDesc : "",

		performancesHillsideUrl : "",
		performancesHillsideFileName : "",
		isDeleteOldPerformancesHillsideFile : false,
        newPerformancesHillsideUrl : "",
        newPerformancesHillsideFileName : "",
		performancesHillsideProgress : "",//上传进度
		performancesHillsideDesc : "",

		vendorUrl : "",
		vendorFileName : "",
		isDeleteOldVendorFile : false,
        newVendorUrl : "",
        newVendorFileName : "",
		vendorProgress : "",//上传进度
		vendorDesc : "",

		studentMarketPlaceUrl : "",
		studentMarketPlaceFileName : "",
		isDeleteOldStudentMarketPlaceFile : false,
        newStudentMarketPlaceUrl : "",
        newStudentMarketPlaceFileName : "",
		studentMarketPlaceProgress : "",//上传进度
		studentMarketPlaceDesc : "",

		sponsorUrl : "",
		sponsorFileName : "",
		isDeleteOldSponsorFile : false,
        newSponsorUrl : "",
        newSponsorFileName : "",
		sponsorProgress : "",//上传进度
		sponsorDesc : "",
		
        startDate : "",
        endDate : ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		wx.hideShareMenu({menus: ['shareAppMessage', 'shareTimeline']})
		var h=wx.getSystemInfoSync().windowHeight;
        this.setData({
            xheight:(wx.getSystemInfoSync().windowHeight-150)+'px',
        })
    },

    bindStartDateChange:function(e){
        var checkStartDate = e.detail.value;
        console.log("checkStartDate", checkStartDate)
        this.setData({
            startDate:checkStartDate
        })
    },
    bindEndDateChange:function(e){
        var checkEndTime = e.detail.value;
        this.setData({
            endDate:checkEndTime
        })
    },

    uploadVideo : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',//video
            success(res) {
                //wx.showLoading({title : 'Loading', mask : true})
                let path = res.tempFiles[0].path;

                that.setData({
                    newVideoFileName : res.tempFiles[0].name
				})
				
                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]
                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newVideoUrl : res.fileID,
							isDeleteOldVideoFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        videoProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传")
            }
        })
    },
    
    removeVideoFile : function(){
        if(this.data.newVideoUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newVideoUrl],
                success(res) {
                    that.setData({
                        newVideoFileName : "",
                        newVideoUrl : "",
						videoProgress : "",
						isDeleteOldVideoFile : true
                    })
                    console.log('Deleted file successfully')
                },
                fail(err) {
                    console.log('Failed to delete file', err)
                }
            })
        }else{
            this.setData({
                newVideoFileName : "",
				videoProgress : "",
				isDeleteOldVideoFile : true
            })
        }
        
	},
	
	uploadMap : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newMapFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newMapUrl : res.fileID,
							isDeleteOldMapFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        mapProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传Map")
            }
        })
    },

    removeMapFile : function(){
        if(this.data.newMapUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newMapUrl],
                success(res) {
                    that.setData({
                        newMapFileName : "",
                        newMapUrl : "",
						mapProgress : "",
						isDeleteOldMapFile : true
                    })
                    console.log('删除Map文件成功')
                },
                fail(err) {
                    console.log('删除Map文件失败', err)
                }
            })
        }else{
            this.setData({
                newMapFileName : "",
                mapProgress : "",
				isDeleteOldMapFile : true
            })
        }
	},
	
	uploadFood : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newFoodFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newFoodUrl : res.fileID,
							isDeleteOldFoodFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        foodProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传Food")
            }
        })
    },

    removeFoodFile : function(){
        if(this.data.newFoodUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newFoodUrl],
                success(res) {
                    that.setData({
                        newFoodFileName : "",
                        newFoodUrl : "",
						foodProgress : "",
						isDeleteOldFoodFile : true
                    })
                    console.log('删除Food文件成功')
                },
                fail(err) {
                    console.log('删除Food文件失败', err)
                }
            })
        }else{
            this.setData({
                newFoodFileName : "",
                foodProgress : "",
				isDeleteOldFoodFile : true
            })
        }
	},
	
	uploadGame : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newGameFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newGameUrl : res.fileID,
							isDeleteOldGameFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        gameProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传Game")
            }
        })
    },

    removeGameFile : function(){
        if(this.data.newGameUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newGameUrl],
                success(res) {
                    that.setData({
                        newGameFileName : "",
                        newGameUrl : "",
						gameProgress : "",
						isDeleteOldGameFile : true
                    })
                    console.log('删除Game文件成功')
                },
                fail(err) {
                    console.log('删除Game文件失败', err)
                }
            })
        }else{
            this.setData({
                newGameFileName : "",
                gameProgress : "",
				isDeleteOldGameFile : true
            })
        }
	},
	
	uploadPerformancesMain : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newPerformancesMainFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newPerformancesMainUrl : res.fileID,
							isDeleteOldPerformancesMainFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        performancesMainProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传PerformancesMain")
            }
        })
    },

    removePerformancesMainFile : function(){
        if(this.data.newPerformancesMainUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newPerformancesMainUrl],
                success(res) {
                    that.setData({
                        newPerformancesMainFileName : "",
                        newPerformancesMainUrl : "",
						performancesMainProgress : "",
						isDeleteOldPerformancesMainFile : true
                    })
                    console.log('删除PerformancesMain文件成功')
                },
                fail(err) {
                    console.log('删除PerformancesMain文件失败', err)
                }
            })
        }else{
            this.setData({
                newPerformancesMainFileName : "",
                performancesMainProgress : "",
				isDeleteOldPerformancesMainFile : true
            })
        }
	},

	uploadPerformancesHillside : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newPerformancesHillsideFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newPerformancesHillsideUrl : res.fileID,
							isDeleteOldPerformancesHillsideFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        performancesHillsideProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传PerformancesHillside")
            }
        })
    },

    removePerformancesHillsideFile : function(){
        if(this.data.newPerformancesHillsideUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newPerformancesHillsideUrl],
                success(res) {
                    that.setData({
                        newPerformancesHillsideFileName : "",
                        newPerformancesHillsideUrl : "",
						performancesHillsideProgress : "",
						isDeleteOldPerformancesHillsideFile : true
                    })
                    console.log('删除PerformancesHillside文件成功')
                },
                fail(err) {
                    console.log('删除PerformancesHillside文件失败', err)
                }
            })
        }else{
            this.setData({
                newPerformancesHillsideFileName : "",
                performancesHillsideProgress : "",
				isDeleteOldPerformancesHillsideFile : true
            })
        }
	},

	uploadVendor : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newVendorFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newVendorUrl : res.fileID,
							isDeleteOldVendorFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        vendorProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传Vendor")
            }
        })
    },

    removeVendorFile : function(){
        if(this.data.newVendorUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newVendorUrl],
                success(res) {
                    that.setData({
                        newVendorFileName : "",
                        newVendorUrl : "",
						vendorProgress : "",
						isDeleteOldVendorFile : true
                    })
                    console.log('删除Vendor文件成功')
                },
                fail(err) {
                    console.log('删除Vendor文件失败', err)
                }
            })
        }else{
            this.setData({
                newVendorFileName : "",
                vendorProgress : "",
				isDeleteOldVendorFile : true
            })
        }
	},
	
	uploadStudentMarketPlace : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newStudentMarketPlaceFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newStudentMarketPlaceUrl : res.fileID,
							isDeleteOldStudentMarketPlaceFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        studentMarketPlaceProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传StudentMarketPlace")
            }
        })
    },

    removeStudentMarketPlaceFile : function(){
        if(this.data.newStudentMarketPlaceUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newStudentMarketPlaceUrl],
                success(res) {
                    that.setData({
                        newStudentMarketPlaceFileName : "",
                        newStudentMarketPlaceUrl : "",
						studentMarketPlaceProgress : "",
						isDeleteOldStudentMarketPlaceFile : true
                    })
                    console.log('删除StudentMarketPlace文件成功')
                },
                fail(err) {
                    console.log('删除StudentMarketPlace文件失败', err)
                }
            })
        }else{
            this.setData({
                newStudentMarketPlaceFileName : "",
                studentMarketPlaceProgress : "",
				isDeleteOldStudentMarketPlaceFile : true
            })
        }
    },
	
	uploadSponsor : function(e){
        let that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                let path = res.tempFiles[0].path;
                that.setData({
                    newSponsorFileName : res.tempFiles[0].name
                })

                // 上传云存储
                let urls = path.split(".")
                let suffix = urls[1]

                const cloudPath = new Date().getTime() + "-" + Math.floor(Math.random()*10000 + 10000) + "." + suffix
                const uploadTask = wx.cloud.uploadFile({
                    cloudPath: "uploadFile/" + cloudPath,
                    filePath: path,
                    success(res) {
                        that.setData({
							newSponsorUrl : res.fileID,
							isDeleteOldSponsorFile : true
                        })
                    },
                    fail : function(err){
                    }
                });
                uploadTask.onProgressUpdate((res) => {
                    // 上传进度条
                    that.setData({
                        sponsorProgress : res.progress
                    })
                })
            },
            fail : function(res){
                console.log("取消上传Sponsor")
            }
        })
    },

    removeSponsorFile : function(){
        if(this.data.newSponsorUrl != ""){
            const that = this
            wx.cloud.deleteFile({
                fileList: [this.data.newSponsorUrl],
                success(res) {
                    that.setData({
                        newSponsorFileName : "",
                        newSponsorUrl : "",
						sponsorProgress : "",
						isDeleteOldSponsorFile : true
                    })
                    console.log('删除Sponsor文件成功')
                },
                fail(err) {
                    console.log('删除Sponsor文件失败', err)
                }
            })
        }else{
            this.setData({
                newSponsorFileName : "",
                sponsorProgress : "",
				isDeleteOldSponsorFile : true
            })
        }
	},

    submitForm:function(event){
        const that = this
        let eventName = event.detail.value.eventName
        let introduction = event.detail.value.introduction
		let venue = event.detail.value.venue
        let credits = event.detail.value.credits
        let foodDesc = event.detail.value.foodDesc
        let gameDesc = event.detail.value.gameDesc
        let performancesMainDesc = event.detail.value.performancesMainDesc
        let performancesHillsideDesc = event.detail.value.performancesHillsideDesc
        let vendorDesc = event.detail.value.vendorDesc
        let studentMarketPlaceDesc = event.detail.value.studentMarketPlaceDesc
        let sponsorDesc = event.detail.value.sponsorDesc
        if(eventName == "" || eventName.length == 0){
            wx.showToast({
                title: 'Name of the Event cannot be empty',
                icon: "none"
            })
            return
		}
		if(introduction != "" || introduction.length > 0){
            introduction = introduction.replaceAll("'", "’")
		}
		if(venue != "" || venue.length > 0){
            venue = venue.replaceAll("'", "’")
		}
		if(credits != "" || credits.length > 0){
            credits = credits.replaceAll("'", "’")
		}
		if(foodDesc != "" || foodDesc.length > 0){
            foodDesc = foodDesc.replaceAll("'", "’")
		}
		if(gameDesc != "" || gameDesc.length > 0){
            gameDesc = gameDesc.replaceAll("'", "’")
		}
		if(performancesMainDesc != "" || performancesMainDesc.length > 0){
            performancesMainDesc = performancesMainDesc.replaceAll("'", "’")
		}
		if(performancesHillsideDesc != "" || performancesHillsideDesc.length > 0){
            performancesHillsideDesc = performancesHillsideDesc.replaceAll("'", "’")
		}
		if(vendorDesc != "" || vendorDesc.length > 0){
            vendorDesc = vendorDesc.replaceAll("'", "’")
		}
		if(studentMarketPlaceDesc != "" || studentMarketPlaceDesc.length > 0){
            studentMarketPlaceDesc = studentMarketPlaceDesc.replaceAll("'", "’")
		}
		if(sponsorDesc != "" || sponsorDesc.length > 0){
            sponsorDesc = sponsorDesc.replaceAll("'", "’")
		}
        if(this.data.startDate == "" || this.data.startDate.length == 0){
            wx.showToast({
                title: 'Start date cannot be empty',
                icon: "none"
            })
            return
        }
        if(this.data.endDate == "" || this.data.endDate.length == 0){
            wx.showToast({
                title: 'End date cannot be empty',
                icon: "none"
            })
            return
		}
        let sql = ""
        if (JSON.stringify(this.data.activityEvent) == "{}" || this.data.activityEvent.activityId == 0) {
            let status = 1
            sql = "insert into ActivityEvent (name, introduction, venue, credits, videoUrl, videoFileName, mapUrl, mapFileName, startDate, endDate, foodUrl, foodFileName, foodDesc, gameUrl, gameFileName, gameDesc, performancesMainUrl, performancesMainFileName, performancesMainDesc, performancesHillsideUrl, performancesHillsideFileName, performancesHillsideDesc, vendorUrl, vendorFileName, vendorDesc, studentMarketPlaceUrl, studentMarketPlaceFileName, studentMarketPlaceDesc, sponsorUrl, sponsorFileName, sponsorDesc) values ('" + eventName + "', '" + introduction + "', '" + venue + "', '" + credits + "', '"+this.data.newVideoUrl+"', '"+this.data.newVideoFileName+"', '"+this.data.newMapUrl+"', '"+this.data.newMapFileName+"', '" + this.data.startDate + "', '" + this.data.endDate + "', '"+this.data.newFoodUrl+"', '"+this.data.newFoodFileName+"', '"+foodDesc+"', '"+this.data.newGameUrl+"', '"+this.data.newGameFileName+"', '"+gameDesc+"', '"+this.data.newPerformancesMainUrl+"', '"+this.data.newPerformancesMainFileName+"', '"+performancesMainDesc+"', '"+this.data.newPerformancesHillsideUrl+"', '"+this.data.newPerformancesHillsideFileName+"', '"+performancesHillsideDesc+"', '"+this.data.newVendorUrl+"', '"+this.data.newVendorFileName+"', '"+vendorDesc+"', '"+this.data.newStudentMarketPlaceUrl+"', '"+this.data.newStudentMarketPlaceFileName+"', '"+studentMarketPlaceDesc+"', '"+this.data.newSponsorUrl+"', '"+this.data.newSponsorFileName+"', '"+sponsorDesc+"')"
        } else {
			if(!this.data.isDeleteOldVideoFile){
				this.setData({
					newVideoUrl : this.data.videoUrl
				})
			}
			if(!this.data.isDeleteOldMapFile){
				this.setData({
					newMapUrl : this.data.mapUrl
				})
			}
			if(!this.data.isDeleteOldFoodFile){
				this.setData({
					newFoodUrl : this.data.foodUrl
				})
			}
			if(!this.data.isDeleteOldGameFile){
				this.setData({
					newGameUrl : this.data.gameUrl
				})
			}
			if(!this.data.isDeleteOldPerformancesMainFile){
				this.setData({
					newPerformancesMainUrl : this.data.performancesMainUrl
				})
			}
			if(!this.data.isDeleteOldPerformancesHillsideFile){
				this.setData({
					newPerformancesHillsideUrl : this.data.performancesHillsideUrl
				})
			}
			if(!this.data.isDeleteOldVendorFile){
				this.setData({
					newVendorUrl : this.data.vendorUrl
				})
			}
			if(!this.data.isDeleteOldStudentMarketPlaceFile){
				this.setData({
					newStudentMarketPlaceUrl : this.data.studentMarketPlaceUrl
				})
			}
			if(!this.data.isDeleteOldSponsorFile){
				this.setData({
					newSponsorUrl : this.data.sponsorUrl
				})
			}
			sql = "update ActivityEvent set name='" + eventName + "', introduction='" + introduction + "', venue='" + venue + "', credits='" + credits + "', videoUrl='"+this.data.newVideoUrl+"', videoFileName='"+this.data.newVideoFileName+"', mapUrl='"+this.data.newMapUrl+"', mapFileName='"+this.data.newMapFileName+"', startDate='" + this.data.startDate + "', endDate='" + this.data.endDate + "', foodUrl='"+this.data.newFoodUrl+"', foodFileName='"+this.data.newFoodFileName+"', foodDesc='"+foodDesc+"', gameUrl='"+this.data.newGameUrl+"', gameFileName='"+this.data.newGameFileName+"', gameDesc='"+gameDesc+"', performancesMainUrl='"+this.data.newPerformancesMainUrl+"', performancesMainFileName='"+this.data.newPerformancesMainFileName+"', performancesMainDesc='"+performancesMainDesc+"', performancesHillsideUrl='"+this.data.newPerformancesHillsideUrl+"', performancesHillsideFileName='"+this.data.newPerformancesHillsideFileName+"', performancesHillsideDesc='"+performancesHillsideDesc+"', vendorUrl='"+this.data.newVendorUrl+"', vendorFileName='"+this.data.newVendorFileName+"', vendorDesc='"+vendorDesc+"', studentMarketPlaceUrl='"+this.data.newStudentMarketPlaceUrl+"', studentMarketPlaceFileName='"+this.data.newStudentMarketPlaceFileName+"', studentMarketPlaceDesc='"+studentMarketPlaceDesc+"', sponsorUrl='"+this.data.newSponsorUrl+"', sponsorFileName='"+this.data.newSponsorFileName+"', sponsorDesc='"+sponsorDesc+"' where activity_ID='" + this.data.activityEvent.activity_ID + "'"
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
                    duration: 3500,
				})
				if(that.data.isDeleteOldVideoFile){
					wx.cloud.deleteFile({
						fileList: [that.data.videoUrl],
						success(res) {
							console.log('删除历史Video文件成功')
						},
						fail(err) {
							console.log('删除历史Video文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldMapFile){
					wx.cloud.deleteFile({
						fileList: [that.data.mapUrl],
						success(res) {
							console.log('删除历史Map文件成功')
						},
						fail(err) {
							console.log('删除历史Map文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldFoodFile){
					wx.cloud.deleteFile({
						fileList: [that.data.foodUrl],
						success(res) {
							console.log('删除历史Food文件成功')
						},
						fail(err) {
							console.log('删除历史Food文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldGameFile){
					wx.cloud.deleteFile({
						fileList: [that.data.gameUrl],
						success(res) {
							console.log('删除历史Game文件成功')
						},
						fail(err) {
							console.log('删除历史Game文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldPerformancesMainFile){
					wx.cloud.deleteFile({
						fileList: [that.data.performancesMainUrl],
						success(res) {
							console.log('删除历史PerformancesMain文件成功')
						},
						fail(err) {
							console.log('删除历史PerformancesMain文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldPerformancesHillsideFile){
					wx.cloud.deleteFile({
						fileList: [that.data.performancesHillsideUrl],
						success(res) {
							console.log('删除历史PerformancesHillside文件成功')
						},
						fail(err) {
							console.log('删除历史PerformancesHillside文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldVendorFile){
					wx.cloud.deleteFile({
						fileList: [that.data.vendorUrl],
						success(res) {
							console.log('删除历史Vendor文件成功')
						},
						fail(err) {
							console.log('删除历史Vendor文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldStudentMarketPlaceFile){
					wx.cloud.deleteFile({
						fileList: [that.data.studentMarketPlaceUrl],
						success(res) {
							console.log('删除历史StudentMarketPlace文件成功')
						},
						fail(err) {
							console.log('删除历史StudentMarketPlace文件失败', err)
						}
					})
				}
				if(that.data.isDeleteOldSponsorFile){
					wx.cloud.deleteFile({
						fileList: [that.data.sponsorUrl],
						success(res) {
							console.log('删除历史Sponsor文件成功')
						},
						fail(err) {
							console.log('删除历史Sponsor文件失败', err)
						}
					})
				}
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
        wx.cloud.callFunction({
            name : "executeSql",
            data : {
                sql : "select * from ActivityEvent"
            },
            success : function(res){
                if(res.result != null && res.result.length > 0){
                    that.setData({
                        activityEvent : res.result[0],
                        activityId : res.result[0].activity_ID,
                        videoUrl : res.result[0].videoUrl,
                        videoFileName : res.result[0].videoFileName,
                        newVideoFileName : res.result[0].videoFileName,
                        mapUrl : res.result[0].mapUrl,
                        mapFileName : res.result[0].mapFileName,
                        newMapFileName : res.result[0].mapFileName,
                        startDate : util.formatDate_yyyyMMdd(res.result[0].startDate),
						endDate : util.formatDate_yyyyMMdd(res.result[0].endDate),
						foodUrl : res.result[0].foodUrl,
                        foodFileName : res.result[0].foodFileName,
						newFoodFileName : res.result[0].foodFileName,
						gameUrl : res.result[0].gameUrl,
                        gameFileName : res.result[0].gameFileName,
						newGameFileName : res.result[0].gameFileName,
						performancesMainUrl : res.result[0].performancesMainUrl,
                        performancesMainFileName : res.result[0].performancesMainFileName,
						newPerformancesMainFileName : res.result[0].performancesMainFileName,
						performancesHillsideUrl : res.result[0].performancesHillsideUrl,
                        performancesHillsideFileName : res.result[0].performancesHillsideFileName,
						newPerformancesHillsideFileName : res.result[0].performancesHillsideFileName,
						sponsorUrl : res.result[0].sponsorUrl,
                        sponsorFileName : res.result[0].sponsorFileName,
						newSponsorFileName : res.result[0].sponsorFileName,
						vendorUrl : res.result[0].vendorUrl,
                        vendorFileName : res.result[0].vendorFileName,
						newVendorFileName : res.result[0].vendorFileName,
						studentMarketPlaceUrl : res.result[0].studentMarketPlaceUrl,
                        studentMarketPlaceFileName : res.result[0].studentMarketPlaceFileName,
                        newStudentMarketPlaceFileName : res.result[0].studentMarketPlaceFileName,
                    })
                }
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