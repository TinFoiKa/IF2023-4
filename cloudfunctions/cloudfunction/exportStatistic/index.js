// 云函数入口文件
const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const dataType = event.dataType//1购买EB支付记录，2抽奖买票支付记录，3灌水游戏支付记录，4摊位收入汇总
    try{
		let dataCVS = 'exportDataFile.xlsx'
		var buffer = ""
		if(dataType == 1){
			dataCVS = 'Purchase_Eagle_Buck_payment_records.xlsx'
			buffer = await expBuyEBPaymentRecord(connection)
		}else if(dataType == 2){
			dataCVS = 'Lucky_Draw_ticket_payment_record.xlsx'
			buffer = await expLuckyDrawPaymentRecord(connection)
		}else if(dataType == 3){
			dataCVS = 'Dunk_Tank_Payment_Record.xlsx'
			buffer = await expDunkTankPaymentRecord(connection)
		}else if(dataType == 4){
			dataCVS = 'Summary_of_booth_Eagle_Buck_revenue.xlsx'
			buffer = await expBoothIncomeTotalRecord(connection)
		}
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

//导出购买EB支付记录
async function expBuyEBPaymentRecord(connection){
	//将数据导出Excel，并上传到云存储
	var [rows, fields] = await connection.execute("select * from eBRecord a inner join Users b on a.sender_open_id=b.open_ID where a.type=1 and a.wechatPaymentState=1 order by a.datetime asc");
	console.log("select rows", rows)
	let userdata = rows
	//1,定义excel表格名
	//2，定义存储数据的
	let alldata = [];
	let row = ['No.', 'IFID', 'Alias', 'Phone number', 'EB quantity', 'Payment amount', 'Time of payment', 'Order ID']; //表属性
	alldata.push(row);

	if(userdata.length > 0){
		for (let key in userdata) {
			var datetimeFormat = formatDate(userdata[key].datetime)
			let arr = [];
			arr.push(Number(key)+1);
			arr.push(userdata[key].if_ID);
			arr.push(userdata[key].username);
			arr.push(userdata[key].phone_num);
			arr.push(userdata[key].eb_number);
			arr.push(userdata[key].amount);
			arr.push(datetimeFormat);
			arr.push(userdata[key].order_ID);
			alldata.push(arr)
		}
	}

	//3，把数据保存到excel里
	var buffer = await xlsx.build([{
		name: "Sheet",
		data: alldata
	}]);
	return buffer
}

//导出抽奖买票支付记录
async function expLuckyDrawPaymentRecord(connection){
	//将数据导出Excel，并上传到云存储
	var [rows, fields] = await connection.execute("select a.*, b.*, c.booth_name from eBRecord a inner join Users b on a.sender_open_id=b.open_ID inner join LuckyDraw c on a.booth_ID=c.booth_ID where a.type=3 and a.booth_type=3 and a.wechatPaymentState=1 order by a.datetime asc");
	console.log("select rows", rows)
	let userdata = rows
	//1,定义excel表格名
	//2，定义存储数据的
	let alldata = [];
	let row = ['No.', 'IFID', 'Alias', 'Phone number', 'Payment amount', 'Time of payment', 'Order ID', 'Activity Name']; //表属性
	alldata.push(row);

	if(userdata.length > 0){
		for (let key in userdata) {
			var datetimeFormat = formatDate(userdata[key].datetime)
			let arr = [];
			arr.push(Number(key)+1);
			arr.push(userdata[key].if_ID);
			arr.push(userdata[key].username);
			arr.push(userdata[key].phone_num);
			arr.push(userdata[key].amount);
			arr.push(datetimeFormat);
			arr.push(userdata[key].order_ID);
			arr.push(userdata[key].booth_name);
			alldata.push(arr)
		}
	}

	//3，把数据保存到excel里
	var buffer = await xlsx.build([{
		name: "Sheet",
		data: alldata
	}]);
	return buffer
}

//导出灌水游戏支付记录
async function expDunkTankPaymentRecord(connection){
	//将数据导出Excel，并上传到云存储
	var [rows, fields] = await connection.execute("select a.*, b.*, c.dunked_guy from eBRecord a inner join Users b on a.sender_open_id=b.open_ID inner join DunkTank c on a.booth_ID=c.dunk_ID where a.type=3 and a.booth_type=2 and a.wechatPaymentState=1 order by a.datetime asc");
	console.log("select rows", rows)
	let userdata = rows
	//1,定义excel表格名
	//2，定义存储数据的
	let alldata = [];
	let row = ['No.', 'IFID', 'Alias', 'Phone number', 'Payment amount', 'Time of payment', 'Order ID', 'Candidate']; //表属性
	alldata.push(row);

	if(userdata.length > 0){
		for (let key in userdata) {
			var datetimeFormat = formatDate(userdata[key].datetime)
			let arr = [];
			arr.push(Number(key)+1);
			arr.push(userdata[key].if_ID);
			arr.push(userdata[key].username);
			arr.push(userdata[key].phone_num);
			arr.push(userdata[key].amount);
			arr.push(datetimeFormat);
			arr.push(userdata[key].order_ID);
			arr.push(userdata[key].dunked_guy);
			alldata.push(arr)
		}
	}

	//3，把数据保存到excel里
	var buffer = await xlsx.build([{
		name: "Sheet",
		data: alldata
	}]);
	return buffer
}

//导出摊位EB收入汇总
async function expBoothIncomeTotalRecord(connection){
	//将数据导出Excel，并上传到云存储
	var [rows, fields] = await connection.execute("select a.booth_ID, a.booth_no, a.booth_name, (select sum(b.eb_number) from eBRecord b where b.type=3 and b.booth_type=1 and b.booth_ID=a.booth_ID) as inEB, (select sum(b.eb_number) from eBRecord b where b.type=4 and b.booth_type=1 and b.booth_ID=a.booth_ID) as outEB from BoothData a where a.booth_type in (1, 2) order by a.booth_type asc, a.booth_ID asc");
	console.log("select rows", rows)
	let userdata = rows
	//1,定义excel表格名
	//2，定义存储数据的
	let alldata = [];
	let row = ['No.', 'Booth No', 'Booth Name', 'Total Eagle Buck revenue', 'Total refund Eagle Buck']; //表属性
	alldata.push(row);

	if(userdata.length > 0){
		for (let key in userdata) {
			var datetimeFormat = formatDate(userdata[key].datetime)
			let arr = [];
			arr.push(Number(key)+1);
			arr.push(userdata[key].booth_no);
			arr.push(userdata[key].booth_name);
			let inEB = 0
			if(userdata[key].inEB != null){
				inEB = userdata[key].inEB
			}
			let outEB = 0
			if(userdata[key].inEB != null){
				outEB = userdata[key].outEB
			}
			arr.push(inEB);
			arr.push(outEB);
			alldata.push(arr)
		}
	}

	//3，把数据保存到excel里
	var buffer = await xlsx.build([{
		name: "Sheet",
		data: alldata
	}]);
	return buffer
}

function formatDate(utc) {
	var date = new Date(utc),
	year = date.getFullYear(),
	month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
	day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
	hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
	minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
	seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
	var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':'+ seconds;
	return res;
}