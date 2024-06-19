// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	let errorCode = 1000
	const menuId = event.menuId
	const fileID = event.fileID
    try{
		var [rows, fields] = await connection.execute("select * from BoothMenu where menu_ID='"+menuId+"'");
		if(rows.length > 0){
			const oldUrl = rows[0].icon
			console.log("select rows", rows)
			console.log("oldUrl", oldUrl)
			var [rows, fields] = await connection.execute("update BoothMenu set icon='"+fileID+"' where menu_ID='"+menuId+"'");
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