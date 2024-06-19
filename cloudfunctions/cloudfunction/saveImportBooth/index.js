// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    let code = 1
    let errorInfos = []
    if(event.boothData.length > 2){
        try{
			let boothType = event.boothType
            for(let i=2;i<event.boothData.length;i++){
                let isError = false;
                
				let booth = event.boothData[i]
				if(boothType == 1 || boothType == 2){
					let boothNo = booth[0]
					let boothName = booth[1]
					let boothOrganization = booth[2]
					if(boothNo == null || boothNo == ""){
						let error = []
						error.push(i + 1)
						error.push("Booth No cannot be empty;")
						errorInfos.push(error)

						isError = true;
					}else{
						boothNo = boothNo.replaceAll("'", "’")//替换所有单引号
					}
					if(boothName == null || boothName == ""){
						let error = []
						error.push(i + 1)
						error.push("Booth Name cannot be empty;")
						errorInfos.push(error)

						isError = true;
					}else{
						boothName = boothName.replaceAll("'", "’")//替换所有单引号
					}
					if(boothOrganization == null){
						boothOrganization = ""
					}else{
						boothOrganization = boothOrganization.replaceAll("'", "’")//替换所有单引号
					}
					if(isError){
						code = 2
					}else{
						const [rows, fields] = await connection.execute("select * from BoothData where booth_no='"+boothNo+"'");
						if(rows.length == 0){
							const [rows, fields] = await connection.execute("insert into BoothData (booth_type, booth_no, booth_name, booth_organization, ifqr) values (?, ?, ?, ?, ?)", [boothType, boothNo, boothName, boothOrganization, uuid()]);
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
							error.push("Booth No already exists;")
							errorInfos.push(error)
						}
					}
				}else if(boothType == 3 || boothType == 4){
					let startTime = booth[0]
					let endTime = booth[1]
					let boothName = booth[2]
					let description = booth[3]
					console.log("booth--", booth)
					if(startTime == null || startTime == ""){
						let error = []
						error.push(i + 1)
						error.push("Start Time cannot be empty;")
						errorInfos.push(error)

						isError = true;
					}else{
						// startTime = startTime.replace(/\s/g, "")//去除所有空格
					}
					if(endTime == null || endTime == ""){
						let error = []
						error.push(i + 1)
						error.push("End Time cannot be empty;")
						errorInfos.push(error)

						isError = true;
					}else{
						// endTime = endTime.replace(/\s/g, "")//去除所有空格
					}
					if(boothName == null || boothName == ""){
						let error = []
						error.push(i + 1)
						error.push("Title cannot be empty;")
						errorInfos.push(error)

						isError = true;
					}else{
						boothName = boothName.replaceAll("'", "’")//替换所有单引号
					}
					if(description == null){
						description = ""
					}else{
						description = description.replaceAll("'", "’")//替换所有单引号
					}
					if(isError){
						code = 2
					}else{
						const [rows, fields] = await connection.execute("insert into BoothData (booth_type, start_time, end_time, booth_name, booth_organization, ifqr) values (?, ?, ?, ?, ?, ?)", [boothType, startTime, endTime, boothName, description, uuid()]);
						if(rows.affectedRows == 0){
							code = 2
							error.push(i + 1)
							error.push("Data addition failed;")
							errorInfos.push(error)
						}
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

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
   
    var uuid = s.join("");
    return uuid
}