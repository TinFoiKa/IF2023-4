// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	let status = 0
    try{
		var [rows, fields] = await connection.execute("select * from ActivityEvent");
		if(rows.length > 0){
			const activityEvent = rows[0]
			if(activityEvent.activity_status == 1){
				let newDate = new Date().toISOString().substring(0,10);
				if(new Date() < activityEvent.startDate){
					status = 1//活动未到开始时间
				}else if(new Date() > activityEvent.startDate && new Date(newDate) <= activityEvent.endDate){
					status = 2//活动进行中
				}else{
					status = 3//活动已结束
				}
			}else if(activityEvent.activity_status == 2){
				status = 4//活动已强制结束
			}
		}
		connection.end()
        return status
    }catch(error){
        console.log("error", error)
		connection.end()
		status = -1
        return status
    }
}

