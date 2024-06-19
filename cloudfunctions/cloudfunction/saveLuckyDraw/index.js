// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	let code = 1
    try{
		const luckyDrawId = event.luckyDrawId
		const boothName = event.boothName
		const drawprizeTime = event.drawprizeTime
		let addId = 0;
		let type = "";
		if(luckyDrawId == 0){
			type = "ins"
			var [rows, fields] = await connection.execute("insert into LuckyDraw (booth_name, drawprize_time) values (?, ?)", [boothName, drawprizeTime]);
			var [rows, fields] = await connection.execute("SELECT LAST_INSERT_ID() as lastID");
            if(rows[0].lastID > 0){
                addId = rows[0].lastID
            }
		}else{
			type = "upd"
			const [rows, fields] = await connection.execute("update LuckyDraw set booth_name=?, drawprize_time=? where booth_ID=?", [boothName, drawprizeTime, luckyDrawId]);
		}
        console.log("rows", rows)
		connection.end()
        return {code : code, type : type, addId : addId}
    }catch(error){
		code = 2
        console.log("error", error)
        connection.end()
        return {code : code}
    }
}