// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	var connection = await mysql.createConnection({
        host : "sh-cynosdbmysql-grp-e6mfw7yu.sql.tencentcdb.com",
		database : "If2023",
        user : "root",
        password : "CBBKQmT2",
        port : "20492"
	})

    const openId = wxContext.OPENID
	let totalBuy = 0//EB购买总额
	let totalReceived = 0//EB转账收到
	let totalReceivedOut = 0//EB转账转出
	let totalSpent = 0//EB花了
	let totalReturn = 0//EB退款
	// let totalPaid = 0//总付款RMB（作废）
	// let totalEBPaid = 0//购买EB总付款RMB（作废）
    try{
		var [rows, fields] = await connection.execute("select sum(eb_number) as sumNumber from eBRecord where sender_open_id='"+openId+"' and type=1 and is_return=0 and wechatPaymentState=1");
		if(rows[0].sumNumber != null){
			totalBuy = rows[0].sumNumber
		}

		var [rows, fields] = await connection.execute("select sum(eb_number) as sumNumber from eBRecord where recipient_open_id='"+openId+"' and type=2 and is_return=0");
		if(rows[0].sumNumber != null){
			totalReceived = rows[0].sumNumber
		}

		var [rows, fields] = await connection.execute("select sum(eb_number) as sumNumber from eBRecord where sender_open_id='"+openId+"' and type=2 and is_return=0");
		if(rows[0].sumNumber != null){
			totalReceivedOut = rows[0].sumNumber
		}

		var [rows, fields] = await connection.execute("select sum(eb_number) as sumNumber from eBRecord where sender_open_id='"+openId+"' and type=3 and is_return=0 and booth_type=1");
		if(rows[0].sumNumber != null){
			totalSpent = rows[0].sumNumber
		}

		var [rows, fields] = await connection.execute("select sum(eb_number) as sumNumber from eBRecord where recipient_open_id='"+openId+"' and type=4 and booth_type=1 and is_return=0");
		if(rows[0].sumNumber != null){
			totalReturn = rows[0].sumNumber
		}

		// var [rows, fields] = await connection.execute("select sum(amount) as sumAmount from eBRecord where sender_open_id='"+openId+"' and (type=1 or (type=3 and (booth_type=2 or booth_type=3))) and is_return=0 and wechatPaymentState=1 ");
		// if(rows[0].sumAmount != null){
		// 	totalPaid = rows[0].sumAmount
		// }

		// var [rows, fields] = await connection.execute("select sum(amount) as sumAmount from eBRecord where sender_open_id='"+openId+"' and type=1 and is_return=0 and wechatPaymentState=1 ");
		// if(rows[0].sumAmount != null){
		// 	totalEBPaid = rows[0].sumAmount
		// }

        connection.end()
		return {
			totalBuy : totalBuy, 
			totalReceived : totalReceived, 
			totalReceivedOut : totalReceivedOut,
			totalSpent : totalSpent,
			totalReturn : totalReturn,
			// totalPaid : totalPaid,
			// totalEBPaid : totalEBPaid
		}
    }catch(error){
		console.log(error)
        connection.end()
        return null;//sql执行出错
    }
}