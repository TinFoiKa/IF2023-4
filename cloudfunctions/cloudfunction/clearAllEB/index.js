// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const ifqr = event.ifqr
	let code = 1000//没有查询到用户
	let ebNumber = 0
    try{
        var [rows, fields] = await connection.execute("select * from Users where ifqr='"+ifqr+"'");
        if(rows.length > 0){
			let openID = rows[0].open_ID
			ebNumber = rows[0].eB
			if(ebNumber > 0){
				var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, eb_number, type) values ('"+openID+"', '"+ebNumber+"', '5')");
				var [rows, fields] = await connection.execute("update Users set eB=(eb-"+ebNumber+") where open_ID='"+openID+"'");
				if(rows.affectedRows > 0){
					code = 1001//操作成功
				}
			}else{
				code = 1002//没有可扣除的EB
			}
		}
		connection.end()
        return {
			ebNumber : ebNumber,
            code : code,
        }
    }catch(error){
        console.log("error", error)
		connection.end()
		code = -1
        return {
            code : code,
        }
    }
}

