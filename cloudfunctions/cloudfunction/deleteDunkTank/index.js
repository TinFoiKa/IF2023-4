// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	let errorCode = 1000

	const boothId = event.boothId
    try{
		var [rows, fields] = await connection.execute("select file_url from DunkTankPhoto where dunk_ID='"+boothId+"' and file_url != ''");
		if(rows.length > 0){
			for(let i=0;i<rows.length;i++){
				deleteFile(rows[i].file_url)
			}
		}
		var [rows, fields] = await connection.execute("delete from DunkTankPhoto where dunk_ID='"+boothId+"'");
		var [rows, fields] = await connection.execute("delete from BoothManagers where booth_id='"+boothId+"' and booth_type='2'");
		var [rows, fields] = await connection.execute("select dunked_url from DunkTank where dunk_ID='"+boothId+"' and dunked_url != ''");
		if(rows.length > 0){
			for(let i=0;i<rows.length;i++){
				deleteFile(rows[i].file_url)
			}
		}
		var [rows, fields] = await connection.execute("delete from DunkTank where dunk_ID='"+boothId+"'");
		connection.end()
        return errorCode
    }catch(error){
        console.log("error", error)
		connection.end()
		errorCode = 1001
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

