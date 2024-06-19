// 云函数入口文件
const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    try{
		//生成手环二维码
		let qrList = event.qrList
		console.log("qrList", qrList)
		if(qrList.length > 0){
			let values = ""
			let number = 1000
			var [rows, fields] = await connection.execute("select max(bl_ID) maxNumber from Bracelets");
			if(rows[0].maxNumber != null && rows[0].maxNumber > 0){
				number = rows[0].maxNumber 
			}
			for(let i=0;i<qrList.length;i++){
				if(values.length > 0){
					values += ","
				}
				number++
				values += "('"+number+"','"+qrList[i]+"')"
			}
			var [rows, fields] = await connection.execute("insert into Bracelets (bl_ID, qr_link) values "+values);
			console.log("insert rows", rows)
		}
		
		//将数据导出Excel，并上传到云存储
		var [rows, fields] = await connection.execute("select * from Bracelets order by bl_ID asc");
		console.log("select rows", rows)
		let userdata = rows
		//1,定义excel表格名
		let dataCVS = 'braceletQRCode.xlsx'
		//2，定义存储数据的
		let alldata = [];
		let row = ['BLID', 'QRCode']; //表属性
		alldata.push(row);

		for (let key in userdata) {
			let arr = [];
			arr.push("B"+userdata[key].bl_ID);
			arr.push(userdata[key].qr_link);
			alldata.push(arr)
		}
		//3，把数据保存到excel里
		var buffer = await xlsx.build([{
			name: "qrCodeSheet",
			data: alldata
		}]);
		//4，把excel文件保存到云存储里
		connection.end()
		return await cloud.uploadFile({
			cloudPath: "uploadFile/"+dataCVS,
			fileContent: buffer, //excel二进制文件
		})
    }catch(error){
		console.log("error", error)
        connection.end()
        return null
    }
}