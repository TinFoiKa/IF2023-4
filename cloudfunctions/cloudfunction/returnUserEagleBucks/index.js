// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	const boothId = event.boothId
	const ebNumber = event.ebNumber
	let errorCode = 1000
    try{
		var [rows, fields] = await connection.execute("select * from BoothData where booth_ID=?", [boothId]);
		if(rows.length > 0){
			let boothData = rows[0]
			if(boothData.eB >= ebNumber){
				var [rows, fields] = await connection.execute("insert into eBRecord (recipient_open_id, eb_number, booth_ID, booth_type, type) values ('"+openId+"', '"+ebNumber+"', '"+boothId+"', '"+1+"', '"+4+"')");
				var [rows, fields] = await connection.execute("update BoothData set eB=(eB-"+ebNumber+") where booth_ID=?", [boothId]);
				var [rows, fields] = await connection.execute("update Users set eB=(eB+"+ebNumber+") where open_ID=?", [openId]);
			}else{
				//摊位余额不足
				errorCode = 1003
			}
		}else{
			//摊位不存在
			errorCode = 1002
		}
        console.log("rows", rows)
		connection.end()
        return errorCode
    }catch(error){
        console.log("error", error)
		connection.end()
		errorCode = 1001
        return errorCode
    }
}

