// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    let code = 1
    let errorInfos = []
    const boothId = event.boothId
    if(event.prizeData.length > 2){
        try{
            for(let i=2;i<event.prizeData.length;i++){
                let isError = false;
                
                let prize = event.prizeData[i]
				let prizeName = prize[0]
				let prizeValue = prize[1]
                if(prizeName == null || prizeName == ""){
                    let error = []
                    error.push(i + 1)
                    error.push("Prize Name Name cannot be empty;")
                    errorInfos.push(error)

                    isError = true;
				}else{
					prizeName = prizeName.replaceAll("'", "’")//替换所有单引号
				}
				if(prizeValue == undefined || prizeValue == null){
					prizeValue = ""
				}
                if(isError){
                    code = 2
                }else{
                    const [rows, fields] = await connection.execute("insert into LuckyDrawPrize (booth_ID, prize_name, prize_value) values (?, ?, ?)", [boothId, prizeName, prizeValue]);
                    if(rows.affectedRows == 0){
                        code = 2
                        error.push(i + 1)
                        error.push("Data addition failed;")
                        errorInfos.push(error)
                    }
                }
            }
            connection.end()
            
            return {
                code : code,
                errorInfos: errorInfos
            }
        }catch(e){
            connection.end()
            console.log("error", e)

            let error = []
            error.push(0)
            error.push("Program exception, import failed")
            errorInfos.push(error)
            return {
                code : -1,
                errorInfos: errorInfos
            }
        }
    }else{
        code = 2
        
        let error = []
        error.push(0)
        error.push("No data, please add data")
        errorInfos.push(error)

        return {
            code : code,
            errorInfos: errorInfos
        }
    }
}