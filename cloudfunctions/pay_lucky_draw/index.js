// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let errCode = 0
	let errMsg = "SUCCESS"
	const openId = event.userInfo.openId
	const orderId = event.outTradeNo
	if(event.returnCode == "SUCCESS"){//支付成功
		var connection = await mysql.createConnection({
			host : "sh-cynosdbmysql-grp-e6mfw7yu.sql.tencentcdb.com",
			database : "If2023",
			user : "root",
			password : "CBBKQmT2",
        	port : "20492"
		})
		
		var [rows, fields] = await connection.execute("select * from eBRecord where order_ID=? and sender_open_id=?", [orderId, openId]);
		if(rows.length > 0){
			const record = rows[0]
			if(record.wechatPaymentState == 2){
				const ticketCount = record.eb_number//抽奖券票数量
				const amount = record.amount//支付金额
				const boothId = record.booth_ID//摊位ID
				var [rows, fields] = await connection.execute("update eBRecord set wechatPaymentState=1 where order_ID=? and sender_open_id=?", [orderId, openId]);

				let ticket_index_max = 0;
				var [rows, fields] = await connection.execute("select max(ticket_index) as maxTicketIndex from LuckyDrawTickets");
				if(rows[0].maxTicketIndex == null){
					ticket_index_max = 10000
				}else{
					ticket_index_max = rows[0].maxTicketIndex
				}

				var [rows, fields] = await connection.execute("update LuckyDraw set booth_rmb=(booth_rmb+"+amount+") where booth_ID='"+boothId+"'");

				let values = ""
				for(let i=0;i<ticketCount;i++){
					if(i > 0){
						values += ","
					}
					values += "('"+boothId+"','"+openId+"','LDT"+(ticket_index_max+i+1)+"','"+(ticket_index_max+i+1)+"')"
				}
				var [rows, fields] = await connection.execute("insert into LuckyDrawTickets (booth_ID, open_ID, ticket_no, ticket_index) values " + values);
			}
		}
		connection.end()
	}else{// if(event.returnCode == "FAIL")
		var [rows, fields] = await connection.execute("update eBRecord set wechatPaymentState=3 where order_ID=? and sender_open_id=?", [orderId, openId]);
		connection.end()
	}
    return {
		errcode : errCode,
		errmsg : errMsg
    }
}