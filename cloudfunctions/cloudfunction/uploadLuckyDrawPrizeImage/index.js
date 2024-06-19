// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	let errorCode = 1000
	const prizeId = event.prizeId
	const fileID = event.fileID
	const fileName = event.fileName
    try{
		var [rows, fields] = await connection.execute("select * from LuckyDrawPrize where prize_ID='"+prizeId+"'");
		if(rows.length > 0){
			const oldUrl = rows[0].img_url
			console.log("select rows", rows)
			console.log("oldUrl", oldUrl)
			var [rows, fields] = await connection.execute("update LuckyDrawPrize set img_url='"+fileID+"', img_file_name='"+fileName+"' where prize_ID='"+prizeId+"'");
			if(rows.affectedRows > 0){
				if(oldUrl != null && oldUrl != ""){
					deleteFile(oldUrl)
				}
			}else{
				errorCode = 1002//头像修改失败
			}
		}else{
			errorCode = 1001//没有获取到数据
		}
		connection.end()
        return errorCode
    }catch(error){
        console.log("error", error)
		connection.end()
		errorCode = -1
        return errorCode
    }
}

async function deleteFile(fileID) {
	await cloud.deleteFile({
		fileList: [fileID],
		success(res) {
			console.log('Deleted file successfully')
		},
		fail(err) {
			console.log('Failed to delete file', err)
		}
	})
}