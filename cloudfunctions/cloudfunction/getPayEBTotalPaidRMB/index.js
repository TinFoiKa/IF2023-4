// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	let totalEBPaid = 0//购买EB总付款RMB
    try{
        var [rows, fields] = await connection.execute("select sum(amount) as sumAmount from eBRecord where sender_open_id='"+openId+"' and type=1 and is_return=0 and wechatPaymentState=1 ");
		if(rows[0].sumAmount != null){
			totalEBPaid = rows[0].sumAmount
		}
		connection.end()
        return {
			totalEBPaid : totalEBPaid
		}
    }catch(error){
        console.log("error", error)
        connection.end()
        return null
    }
}

