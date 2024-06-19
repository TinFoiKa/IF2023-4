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
	const ebPrice = event.ebPrice//购买抽奖券单价
	const ebNumber = event.ebNumber//购买抽奖券数量
	const payment = event.payment//付款金额RMB（元）
	const boothId = event.boothId//摊位ID
	try{
		var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, order_ID, amount, eb_price, eb_number, booth_ID, booth_type, type, wechatPaymentState) values ('"+openId+"', '"+orderId+"', '"+payment/100+"', '"+ebPrice+"', '"+ebNumber+"', '"+boothId+"', '3', '3', 2)");
		connection.end()

		const res = await cloud.cloudPay.unifiedOrder({
		    "body" : "Lucky Draw Tickets Payment",
		    "outTradeNo" : orderId,
		    "spbillCreateIp" : "127.0.0.1",
		    "subMchId" : "1556444331",
		    "totalFee" : payment,
		    "envId": "sas-2023if-6gnixjwic1713458",
		    "functionName": "pay_lucky_draw"
	  	})
	  	return res
    }catch(error){
        console.log("error", error)
        connection.end()
        return null
    }
}