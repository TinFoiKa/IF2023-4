Component({
    /**
     * 组件的属性列表
     */
    properties: {
        toptitle:String,
		homeTop:Boolean,
		backflag:Boolean,
		homeflag:Boolean,
		showSysBtn:Boolean,
		isFixation:Boolean,
    },

    /**
     * 组件的初始数据
     */
    data: {
        homeTop:false,
        backflag:false,
        homeflag:false,
		toptitle:"",
		showSysBtn:false,
		customHeightTop : 0,
		customHeight : 0,
		isFixation : false,
        laglist:["English",'中文'],
        index:0,
        laguage:"laguage"
	},

	attached : function(options){
		let customHeight = wx.getMenuButtonBoundingClientRect()
		console.log("customHeight", customHeight)
		this.setData({
			customHeightTop : customHeight.top,
			customHeight : customHeight.height
		})
		let systemInfo = wx.getSystemInfoSync()
		console.log("systemInfo", systemInfo)
		return
		systemInfo = wx.getSystemInfoSync();
		//状态栏高度
		let statusBarHeight = Number(systemInfo.statusBarHeight);
		let menu = wx.getMenuButtonBoundingClientRect()
		
		//导航栏高度
		let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
		
		//状态栏加导航栏高度
		let navStatusBarHeight = statusBarHeight + menu.height + (menu.top - statusBarHeight) * 2
		this.setData({
			barHeight:(statusBarHeight+6)+''
		})
		console.log('barHeight',this.data.barHeight)
		console.log('状态栏高度',statusBarHeight)
		console.log('导航栏高度',navBarHeight)
		console.log('状态栏加导航栏高度',navStatusBarHeight)

		let isiOS = systemInfo.system.indexOf('iOS') > -1
		console.log("systemInfo.system", systemInfo.system)
		console.log("isiOS", isiOS)
	},

    /**
     * 组件的方法列表
     */
    methods: {
        PickerType: function (e) {
            wx.navigateTo({
                url: '/pages/event/event'
            })
        },
        PickerSelected: function (e) {
            this.setData({
                index: e.detail.value,
                laguage: e.detail.value==0?"laguage":"语言"
            });
        },
        backbtn:function(e){
            wx.navigateBack({
                delta: 1
            });
        },
        backhome:function(e){
            wx.switchTab({
                url: "/pages/Home/Home"
            });
        }
    }
})