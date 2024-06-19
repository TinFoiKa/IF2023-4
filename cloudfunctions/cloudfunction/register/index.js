// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    let code = 1
    try{
        var [rows, fields] = await connection.execute("select * from Users where open_ID='"+openId+"'");
        if(rows.length == 0){
            var [rows, fields] = await connection.execute("INSERT INTO Users (open_ID, ifqr, username, avatar, phone_num, if_ID) select '"+openId+"', '"+event.ifqr+"', '"+event.nickName+"', '"+event.avatarUrl+"', '"+event.phone+"', if(max(if_ID) is null,1000,max(if_ID)+1) from Users")
            if(rows.affectedRows > 0){
                code = 2
            }else{
                code = -1;
            }
        }else{
			await deleteFile(rows[0].avatar)
			var [rows, fields] = await connection.execute("update Users set username='"+event.nickName+"', avatar='"+event.avatarUrl+"' where open_ID='"+openId+"'")
		}
        connection.end()

        return {
            code : code,
            openid: wxContext.OPENID
        }
    }catch(error){
        connection.end()
        return {
            code : -1,
            openid: wxContext.OPENID
        }
    }
}

async function deleteFile(fileID) {
	await cloud.deleteFile({
		fileList: [fileID],
		success(res) {
			console.log('原头像删除成功')
		},
		fail(err) {
			console.log('原头像删除失败', err)
		}
	})
}