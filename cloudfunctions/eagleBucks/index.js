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
    const recordType = event.recordType//1购买EB，2转账，3摊位付款
    let errCode = 1000;//操作成功
    try{
        /**if(recordType == 1){//购买EB
            const orderId = event.orderId//订单ID
            const ebPrice = event.ebPrice//购买EB单价
            const ebNumber = event.ebNumber//购买EB数量
            const payment = event.payment//付款金额RMB（元）
            
            var [rows, fields] = await connection.execute("insert into eBRecord (amount, sender_open_id, order_ID, eb_price, eb_number, type) values ('"+payment+"', '"+openId+"', '"+orderId+"', '"+ebPrice+"', '"+ebNumber+"', '1')");
            var [rows, fields] = await connection.execute("update Users set eB=(eb+"+ebNumber+") where open_ID='"+openId+"'");
		}else **/
		if(recordType == 2){//转账
            const ebNumber = event.ebNumber//转移EB数量
            const transferOpenId = event.transferOpenId//转移用户openId
            var [rows, fields] = await connection.execute("select * from Users where open_ID='"+transferOpenId+"'");
            if(rows.length > 0){
                console.log("rows", rows)
                let transUser = rows[0]
                if(transUser.eB >= ebNumber){
                    var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, recipient_open_id, eb_number, type) values ('"+transferOpenId+"', '"+openId+"', '"+ebNumber+"', '2')");
                    var [rows, fields] = await connection.execute("update Users set eB=(eb-"+ebNumber+") where open_ID='"+transferOpenId+"'");
                    var [rows, fields] = await connection.execute("update Users set eB=(eb+"+ebNumber+") where open_ID='"+openId+"'");
                }else{
                    errCode = 1003;//用户鹰镑不足
                }
            }else{
                errCode = 1002;//用户不存在
            }
        }else if(recordType == 3){//摊位付款
			const orderId = event.orderId//订单ID
			const boothId = event.boothId//摊位ID
			const boothType = event.boothType//摊位类型:1摊位付款，2灌水付款，3抽奖付款
			const payment = event.payment//付款金额RMB（元）
			const ebNumber = event.ebNumber//摊位付款EB数量

			if(boothType == 1){
				//摊位EB付款
				const transferOpenId = event.transferOpenId//转移用户openId
				const transferBraceletQR = event.transferBraceletQR//如果扫描的是手环，此数据是手环二维码，如果不是手环，则此数据是""
				const boothId = event.boothId//摊位ID
				var [rows, fields] = await connection.execute("select * from Users where open_ID='"+transferOpenId+"'");
				if(rows.length > 0){
					let transUser = rows[0]
					if(transUser.eB >= ebNumber){
						var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, sender_qr_link, eb_number, type, booth_type, booth_ID) values ('"+transferOpenId+"', '"+transferBraceletQR+"', '"+ebNumber+"', '3', '1', '"+boothId+"')");
						var [rows, fields] = await connection.execute("update Users set eB=(eB-"+ebNumber+") where open_ID='"+transferOpenId+"'");
						var [rows, fields] = await connection.execute("update BoothData set eB=(eB+"+ebNumber+") where booth_ID='"+boothId+"'");
					}else{
						errCode = 1003;//用户鹰镑不足
					}
				}else{
					errCode = 1002;//用户不存在
				}
			}
			/**else if(boothType == 2){
				//灌水
				var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, order_ID, amount, eb_number, booth_ID, booth_type, type) values ('"+openId+"', '"+orderId+"', '"+payment+"', '"+ebNumber+"', '"+boothId+"', '"+boothType+"', '3')");
				var [rows, fields] = await connection.execute("update DunkTank set dunked_rmb=(dunked_rmb+"+payment+") where dunk_ID='"+boothId+"'");
			}else if(boothType == 3){
				//购买抽奖券
				const ticketCount = event.ticketCount//买票数量
				let ticket_index_max = 0;
				var [rows, fields] = await connection.execute("select max(ticket_index) as maxTicketIndex from LuckyDrawTickets");
				if(rows[0].maxTicketIndex == null){
					ticket_index_max = 10000
				}else{
					ticket_index_max = rows[0].maxTicketIndex
				}

				var [rows, fields] = await connection.execute("insert into eBRecord (sender_open_id, order_ID, amount, eb_number, booth_ID, booth_type, type) values ('"+openId+"', '"+orderId+"', '"+payment+"', '"+ebNumber+"', '"+boothId+"', '"+boothType+"', '3')");
				var [rows, fields] = await connection.execute("update LuckyDraw set booth_rmb=(booth_rmb+"+payment+") where booth_ID='"+boothId+"'");

				let values = ""
				for(let i=0;i<ticketCount;i++){
					if(values.length > 0){
						values += ","
					}
					values += "('"+boothId+"','"+openId+"','LDT"+(ticket_index_max+i+1)+"','"+(ticket_index_max+i+1)+"')"
				}
				var [rows, fields] = await connection.execute("insert into LuckyDrawTickets (booth_ID, open_ID, ticket_no, ticket_index) values " + values);
			}**/
        }
        connection.end()
        return errCode
    }catch(error){
        console.log(error)
        connection.end()
        return 1001;//sql执行出错
    }
}