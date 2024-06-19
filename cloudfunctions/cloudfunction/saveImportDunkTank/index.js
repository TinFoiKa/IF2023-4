// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    let code = 1
    let errorInfos = []
    if(event.dunkTankData.length > 2){
        try{
            for(let i=2;i<event.dunkTankData.length;i++){
                let isError = false;
                
                let dunkTank = event.dunkTankData[i]
                let fullName = dunkTank[0]
                let introduction = dunkTank[1]
                let goal = dunkTank[2]
                if(fullName == null || fullName == "" || fullName == undefined){
                    let error = []
                    error.push(i + 1)
                    error.push("Full Name cannot be empty;")
                    errorInfos.push(error)

                    isError = true;
                }else{
					fullName = fullName.replaceAll("'", "’")//替换所有单引号
				}
                if(goal == undefined){
                    let error = []
                    error.push(i + 1)
                    error.push("Goal RMB cannot be empty;")
                    errorInfos.push(error)

                    isError = true;
                }else{
                    if (!(/(^(-?\d+)(\.\d+)?$)/.test(goal))){
                        let error = []
                        error.push(i + 1)
                        error.push("The input format of the goal RMB is incorrect;")
                        errorInfos.push(error)

                        isError = true;
                    }else{
                        let p = parseInt(goal)
                        if(p < 0){
                            let error = []
                            error.push(i + 1)
                            error.push("Goal RMB cannot be less than 0;")
                            errorInfos.push(error)

                            isError = true;
                        }
                    }
                }
                if(isError){
                    code = 2
                }else{
                    const [rows, fields] = await connection.execute("insert into DunkTank (dunked_guy, dunked_Introduction, goal_rmb) values (?, ?, ?)", [fullName, introduction, goal]);
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