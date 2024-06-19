// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	let result = {}
	let totalStatus = true
    try{
		var [rows, fields] = await connection.execute("select * from BoothData where booth_type=1");
		console.log("foods rows", rows)
		if(rows.length > 0){
			result.foods=true
		}else{
			result.foods=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from BoothData where booth_type=2");
		console.log("games rows", rows)
		if(rows.length > 0){
			result.games=true
		}else{
			result.games=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from BoothData where booth_type=3");
		console.log("Main Stage rows", rows)
		if(rows.length > 0){
			result.mainStage=true
		}else{
			result.mainStage=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from BoothData where booth_type=4");
		console.log("Hillside Stage rows", rows)
		if(rows.length > 0){
			result.hillsideStage=true
		}else{
			result.hillsideStage=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from Sponsors where sponsor_type=1");
		console.log("sponsors rows", rows)
		if(rows.length > 0){
			result.sponsors=true
		}else{
			result.sponsors=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from Sponsors where sponsor_type=2");
		console.log("vendors rows", rows)
		if(rows.length > 0){
			result.vendors=true
		}else{
			result.vendors=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from Sponsors where sponsor_type=3");
		console.log("Student Market Place rows", rows)
		if(rows.length > 0){
			result.studentMarketPlace=true
		}else{
			result.studentMarketPlace=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from DunkTank");
		console.log("dunktank rows", rows)
		if(rows.length > 0){
			result.dunkTank=true
		}else{
			result.dunkTank=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from LuckyDraw");
		console.log("luckydraw rows", rows)
		if(rows.length > 0){
			result.luckyDraw=true
		}else{
			result.luckyDraw=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from EagleBuckCommodity");
		console.log("eaglebuck rows", rows)
		if(rows.length > 0){
			result.eagleBuck=true
		}else{
			result.eagleBuck=false
			totalStatus = false
		}

		var [rows, fields] = await connection.execute("select * from LuckyDrawCommodity");
		console.log("ticket rows", rows)
		if(rows.length > 0){
			result.ticket=true
		}else{
			result.ticket=false
			totalStatus = false
		}
		result.totalStatus=totalStatus
        
		connection.end()
        return result
    }catch(error){
        console.log("error", error)
        connection.end()
        return result
    }
}

