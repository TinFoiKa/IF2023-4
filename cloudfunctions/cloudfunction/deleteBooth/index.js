// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
	const wxContext = cloud.getWXContext()
	const boothId = event.boothId
	const boothType = event.boothType//1:Food/Game/Performance，2:Dunk Tank，3:Lucky Draw
    try{
		if(boothType == 1){
			var [rows, fields] = await connection.execute("select * from BoothData where booth_ID=?", [boothId]);
			if(rows.length > 0){
				if(rows[0].booth_type == 1){
					var [rows, fields] = await connection.execute("select * from BoothMenu where booth_ID=? and icon != ''", [boothId]);
					if(rows.length > 0){
						let fileIds = []
						for(let i=0;i<rows.length;i++){
							fileIds.push(rows[i].icon)
						}
						await deleteFile(fileIds)
					}
				}
				var [rows, fields] = await connection.execute("delete from BoothMenu where booth_ID=?", [boothId]);
				var [rows, fields] = await connection.execute("delete from BoothManagers where booth_ID=? and booth_type=1", [boothId]);
				var [rows, fields] = await connection.execute("delete from BoothData where booth_ID=?", [boothId]);
			}
		}else if(boothType == 2){
			var [rows, fields] = await connection.execute("select file_url from DunkTankPhoto where dunk_ID=? and file_url != ''", [boothId]);
			if(rows.length > 0){
				let fileIds = []
				for(let i=0;i<rows.length;i++){
					fileIds.push(rows[i].file_url)
				}
				await deleteFile(fileIds)
			}
			var [rows, fields] = await connection.execute("delete from DunkTankPhoto where dunk_ID=?", [boothId]);
			// var [rows, fields] = await connection.execute("delete from BoothManagers where booth_type=2");
			var [rows, fields] = await connection.execute("select dunked_url from DunkTank where dunk_ID=? and dunked_url != ''", [boothId]);
			if(rows.length > 0){
				let fileIds = []
				for(let i=0;i<rows.length;i++){
					fileIds.push(rows[i].dunked_url)
				}
				await deleteFile(fileIds)
			}
			var [rows, fields] = await connection.execute("delete from DunkTank where dunk_ID=?", [boothId]);
		}else if(boothType == 3){
			var [rows, fields] = await connection.execute("select * from LuckyDrawPrize where booth_ID=? and img_url!=''", [boothId]);
			if(rows.length > 0){
				let fileIds = []
				for(let i=0;i<rows.length;i++){
					fileIds.push(rows[i].img_url)
				}
				await deleteFile(fileIds)
			}
			var [rows, fields] = await connection.execute("delete from LuckyDrawPrize where booth_ID=?", [boothId]);
			var [rows, fields] = await connection.execute("delete from LuckyDrawTickets where booth_ID=?", [boothId]);
			// var [rows, fields] = await connection.execute("delete from BoothManagers where booth_type=3");
			var [rows, fields] = await connection.execute("delete from LuckyDraw where booth_ID=?", [boothId]);
		}
		connection.end()
        return rows
    }catch(error){
        console.log("error", error)
        connection.end()
        return null
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
