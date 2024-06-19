// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

var ID = 0
var fullName = ""
var introduction = ""
var target = 0
var oldHeadIcon = ""
var headIconUrl = ""
var headIconFileName = ""
var photoList = []
var removePhotoList = []

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    console.log("saveDunkTank event", event)
    ID = event.data.ID
    fullName = event.data.fullName
    introduction = event.data.introduction
    target = event.data.target
    oldHeadIcon = event.data.oldHeadIcon
    headIconUrl = event.data.headIconUrl
    headIconFileName = event.data.headIconFileName
    photoList = event.data.photoList
    removePhotoList = event.data.removePhotoList
    try{
        if(ID == 0){
            var [rows, fields] = await connection.execute("insert into DunkTank (dunked_guy, dunked_Introduction, goal_rmb, dunked_url, dunked_url_fileName) values (?, ?, ?, ?, ?)", [fullName, introduction, target, headIconUrl, headIconFileName]);
            var [rows, fields] = await connection.execute("SELECT LAST_INSERT_ID() as lastID");
            if(rows[0].lastID > 0){
                addDunkTankPhoto(connection, rows[0].lastID)
            }
        }else{
            var [rows, fields] = await connection.execute("update DunkTank set dunked_guy=?, dunked_Introduction=?, goal_rmb=?, dunked_url=?, dunked_url_fileName=? where dunk_ID=?", [fullName, introduction, target, headIconUrl, headIconFileName, ID]);
            addDunkTankPhoto(connection, ID)
        }
        connection.end()
        return "success"
    }catch(error){
        connection.end()
        console.log("error", error)
        return "error";//sql执行出错
    }
}

async function addDunkTankPhoto(connection, dunkTankId) {
    if(photoList.length > 0){
		console.log("photoList", photoList)
		let sql = ""
		for(let i=0;i<photoList.length;i++){
			let photo = photoList[i]
			if(photo.ID == 0){
				let file_url = photo.file_url
				let file_name = photo.file_name
				if(sql.length > 0){
					sql += ","
				}
				sql += "('"+dunkTankId+"','"+file_name+"','"+file_url+"')"
			}
		}
		console.log("sql", sql)
		if(sql.length > 0){
			var [rows, fields] = await connection.execute("insert into DunkTankPhoto (dunk_ID, file_name, file_url) values " + sql);
			console.log("addDunkTankPhoto", rows)
		}
    }
    if(removePhotoList.length > 0){
        for(let i=0;i<removePhotoList.length;i++){
            let removePhoto = removePhotoList[i]
            deleteFile(removePhoto.file_url)
            deleteDunkTankPhoto(connection, removePhoto.ID)
        }
    }
}

async function deleteFile(fileID) {
	console.log("deleteFile", fileID)
    cloud.deleteFile({
        fileList: [fileID]
    }).then(res => {
		console.log(res)
	}).catch(error => {
		console.log(res)
	})
}

async function deleteDunkTankPhoto(connection, photoId) {
    await connection.execute("delete from DunkTankPhoto where ID=?", [photoId]);
}