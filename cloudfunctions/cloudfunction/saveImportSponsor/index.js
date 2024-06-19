// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const sponsorType = event.sponsorType
    let code = 1
    let errorInfos = []
    if(event.sponsorData.length > 2){
        try{
            for(let i=2;i<event.sponsorData.length;i++){
                let isError = false;
                let errorMsg = ""
                
                let sponsor = event.sponsorData[i]
                let sponsorName = sponsor[0]
                let description = ""
                if(sponsorType == 1){
                    description = sponsor[1]
				}
				if(description == undefined || description == null){
					description = ""
				}else{
					description = description.replaceAll("'", "’")//替换所有单引号
				}
                if(sponsorName == null || sponsorName == ""){
                    let error = []
                    error.push(i + 1)
                    if(sponsorType == 1){
                        error.push("Sponsor Company Name cannot be empty;")
                    }else if(sponsorType == 2){
                        error.push("Vendor Name cannot be empty;")
                    }else{
                        error.push("Name cannot be empty;")
                    }
                    errorInfos.push(error)

                    isError = true;
                }else{
					sponsorName = sponsorName.replaceAll("'", "’")//替换所有单引号
				}
                
                if(isError){
                    code = 2
                }else{
                    var [rows, fields] = await connection.execute("select * from Sponsors where sponsor_type='"+sponsorType+"' and sponsor_name='"+sponsorName+"'");
                    if(rows.length == 0){
                        var [rows, fields] = await connection.execute("insert into Sponsors (sponsor_type, sponsor_name, sponsor_description) values (?, ?, ?)", [sponsorType, sponsorName, description]);
                        if(rows.affectedRows == 0){
                            code = 2
                            error.push(i + 1)
                            error.push("Data addition failed;")
                            errorInfos.push(error)
                        }
                    }else{
                        code = 2
                        let error = []
                        error.push(i + 1)
                        if(sponsorType == 1){
                            error.push("Sponsor Company Name already exists;")
                        }else{
                            error.push("Vendor Name already exists;")
                        }
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