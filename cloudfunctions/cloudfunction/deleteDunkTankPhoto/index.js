// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	let errorCode = 1000

	const photoIds = event.photoIds
    try{
		let ids = ""
		for(let i=0;i<photoIds.length;i++){
			if(ids.length > 0){
				ids += ","
			}
			ids += "'"+photoIds[i]+"'"
		}

		var [rows, fields] = await connection.execute("select file_url from DunkTankPhoto where ID in ("+ids+") and file_url != ''");
		if(rows.length > 0){
			let fileIDs = []
			for(let i=0;i<rows.length;i++){
				fileIDs.push(rows[i].file_url)
			}
			deleteFile(fileIDs)
		}
		var [rows, fields] = await connection.execute("delete from DunkTankPhoto where ID in ("+ids+")");
		connection.end()
        return errorCode
    }catch(error){
        console.log("error", error)
		connection.end()
		errorCode = 1001
        return errorCode
    }
}

async function deleteFile(fileIDs) {
	await cloud.deleteFile({
		fileList: fileIDs,
		success(res) {
			console.log('Deleted file successfully')
		},
		fail(err) {
			console.log('Failed to delete file', err)
		}
	})
}

