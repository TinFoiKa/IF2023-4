// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	const qrcode = event.qrCode
	const braceletMaxCount = event.braceletMaxCount
	let errorCode = 1000
	let qrcodeOpenId = ""
	let qrcodeIsDisable = 0
    try{
		var [rows, fields] = await connection.execute("select * from Bracelets where qr_link=?", [qrcode]);
		if(rows == null || rows.length == 0){
			//转账
			var [rows, fields] = await connection.execute("select * from Users where ifqr=?", [qrcode]);
			if(rows == null || rows.length == 0){
				//扫描财务出示的摊位二维码
				var [rows, fields] = await connection.execute("select * from BoothData where ifqr=?", [qrcode]);
				if(rows == null || rows.length == 0){
					//二维码无效
					errorCode = 1004
				}else{
					//摊位退款
					errorCode = 1003
				}
			}else{
				//跳转到转账页面
				errorCode = 1002
				qrcodeOpenId = rows[0].open_ID
				qrcodeIsDisable = rows[0].is_Disable
			}
		}else{
			//添加手环
			let bracelet = rows[0]
			if(bracelet.linked_open_id != null && bracelet.linked_open_id.length > 0){
				//二维码正在使用中
				errorCode = 1007
			}else{
				var [rows, fields] = await connection.execute("select * from Bracelets where linked_open_id='"+openId+"'");
				if(rows != null && rows.length >= braceletMaxCount){
					//手环总数超过限制
					errorCode = 1006
				}else{
					//添加手环
					errorCode = 1005
				}
			}
		}
		connection.end()
        return {
			qrcode_openId : qrcodeOpenId,
			qrcode_isDisable : qrcodeIsDisable,
			errorCode : errorCode
		}
    }catch(error){
        console.log("error", error)
		connection.end()
		errorCode = 1001
        return {
			qrcode_openId : qrcodeOpenId,
			errorCode : errorCode
		}
    }
}

