// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    var connection = await mysql.createConnection({
        host : "sh-cynosdbmysql-grp-e6mfw7yu.sql.tencentcdb.com",
		database : "If2023",
        user : "root",
        password : "CBBKQmT2",
        port : "20492"
	})

	const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	const orderId = event.orderId//订单ID
	const payment = event.payment//付款金额RMB（元）
	const boothId = event.boothId//摊位ID
	try{
		var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, order_ID, amount, booth_ID, booth_type, type, wechatPaymentState) values ('"+openId+"', '"+orderId+"', '"+payment/100+"', '"+boothId+"', '2', '3', 2)");
		connection.end()

		const res = await cloud.cloudPay.unifiedOrder({
		    "body" : "Dunk Tank Payment",
		    "outTradeNo" : orderId,
		    "spbillCreateIp" : "127.0.0.1",
		    "subMchId" : "1556444331",
		    "totalFee" : payment,
		    "envId": "sas-2023if-6gnixjwic1713458",
		    "functionName": "pay_dunk_tank"
	  	})
	  	return res
    }catch(error){
        console.log("error", error)
        connection.end()
        return null
    }
}