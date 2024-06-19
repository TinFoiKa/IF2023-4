// 云函数入口文件
const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
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
	const ebPrice = event.ebPrice//购买EB单价
	const ebNumber = event.ebNumber//购买EB数量
	const payment = event.payment//付款金额RMB（元）
	try{
		const [rows, fields] = await connection.execute("insert into eBRecord (amount, sender_open_id, order_ID, eb_price, eb_number, type, wechatPaymentState) values ('"+payment/100+"', '"+openId+"', '"+orderId+"', '"+ebPrice+"', '"+ebNumber+"', '1', 2)");
		connection.end()

		const res = await cloud.cloudPay.unifiedOrder({
		    "body" : "Eagle Bucks Payment",
		    "outTradeNo" : orderId,
		    "spbillCreateIp" : "127.0.0.1",
		    "subMchId" : "1556444331",
		    "totalFee" : payment,
		    "envId": "sas-2023if-6gnixjwic1713458",
		    "functionName": "pay_buy_eb"
	  	})
	  	return res
    }catch(error){
        console.log("error", error)
        connection.end()
        return null
    }
}