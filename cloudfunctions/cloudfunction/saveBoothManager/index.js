// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	const boothType = event.boothType//摊位类型：1食物、游戏、表演、2灌水、3抽奖
    if(event.userIdList.length > 0){
        try{
            for(let i=0;i<event.userIdList.length;i++){
                let userId = event.userIdList[i]
                
                const [rows, fields] = await connection.execute("select * from BoothManagers where open_id='"+userId+"'");
                if(rows.length == 0){
					if(boothType == 1){
						const [rows, fields] = await connection.execute("insert into BoothManagers (booth_id, open_id, booth_type) values (?, ?, ?)", [event.boothId, userId, boothType]);
					}else{
						const [rows, fields] = await connection.execute("insert into BoothManagers (open_id, booth_type) values (?, ?)", [userId, boothType]);
					}
                }
            }
            connection.end()
            
            return "success"
        }catch(e){
            connection.end()
            console.log("error", e)
            return "error"
        }
    }
    return "success"
}