// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    let code = 1
    let errorInfos = []
    if(event.mgrData.length > 2){
        try{
            for(let i=2;i<event.mgrData.length;i++){
                let isError = false;
                
                let mgr = event.mgrData[i]
                let boothNo = mgr[0]
				let ifID = mgr[2]
				let boothData = null
				let user = null
                if(boothNo == null || boothNo == ""){
                    let error = []
                    error.push(i + 1)
                    error.push("Booth No cannot be empty;")//展位号不能为空
                    errorInfos.push(error)

                    isError = true;
                }else{
					boothNo = boothNo.replaceAll("'", "’")//替换所有单引号
					var [rows, fields] = await connection.execute("select * from BoothData where booth_no='"+boothNo+"' and booth_type in (1, 2)");
					if(rows.length == 0){
                        let error = []
                        error.push(i + 1)
                        error.push("Booth No does not exist;")//展位号不存在
                        errorInfos.push(error)

						isError = true;
                    }else{
						boothData = rows[0]
					}
				}
                if(ifID == undefined || ifID == null || ifID == ""){
                    let error = []
                    error.push(i + 1)
                    error.push("IFID cannot be empty;")//IFID不能为空
                    errorInfos.push(error)

                    isError = true;
                }else{
					if(!/^\d+$/.test(ifID)){
						let error = []
						error.push(i + 1)
						error.push("Incorrect format of IFID;")//IFID格式不正确
						errorInfos.push(error)

						isError = true;
					}else{
						var [rows, fields] = await connection.execute("select * from Users where if_ID='"+ifID+"'");
						let users = rows[0]
						if(rows.length == 0){
							let error = []
							error.push(i + 1)
							error.push("IFID does not exist;")//IFID不存在
							errorInfos.push(error)

							isError = true;
						}else{
							var [rows, fields] = await connection.execute("select * from BoothManagers where open_id='"+rows[0].open_ID+"'");
							if(rows.length > 0){
								let error = []
								error.push(i + 1)
								error.push("IFID user has bound booth;")//IFID用户已绑定展位
								errorInfos.push(error)

								isError = true;
							}else{
								user = users
							}
						}
					}
				}
                if(isError){
                    code = 2
                }else{
                    var [rows, fields] = await connection.execute("insert into BoothManagers (booth_id, open_id, booth_type) values (?, ?, ?)", [boothData.booth_ID, user.open_ID, 1]);
					if(rows.affectedRows == 0){
						code = 2
						error.push(i + 1)
						error.push("operation failed;")
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