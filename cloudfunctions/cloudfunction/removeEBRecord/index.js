// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	let errCode = 1000;//操作成功
	let recordId = event.data.recordId
	let ebNumber = event.data.ebNumber
    try{
		var [rows, fields] = await connection.execute("select * from eBRecord where ID=?", [recordId]);
		if(rows.length > 0){
			let record = rows[0]
			if(record.is_return == 0){
				var [rows, fields] = await connection.execute("select * from Users where open_ID=?", [record.sender_open_id]);
				let user = rows[0]
				if(record.type == 1){
					//购买EB
					if(user.eB >= ebNumber){
						var [rows, fields] = await connection.execute("update Users set eB=(eb-"+ebNumber+") where open_ID=?", [record.sender_open_id]);
						var [rows, fields] = await connection.execute("update eBRecord set is_return=1, returnTime=NOW() where ID=?", [recordId]);
					}else{
						errCode = 1004;//账户余额不足
					}
				}else if(record.type == 3 && record.booth_type == 1){
					//摊位付款
					var [rows, fields] = await connection.execute("update Users set eB=(eb+"+ebNumber+") where open_ID=?", [record.sender_open_id]);
					var [rows, fields] = await connection.execute("update eBRecord set is_return=1, returnTime=NOW() where ID=?", [recordId]);
				}
			}else{
				errCode = 1003;//该记录已经退回
			}
		}else{
			errCode = 1002;//没有查询到数据
		}
		connection.end()
        return errCode
    }catch(error){
        console.log("error", error)
        connection.end()
        return 1001//sql执行出错
    }
}