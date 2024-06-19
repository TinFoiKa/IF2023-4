// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
	const openId = wxContext.OPENID
	var connection = await mysql.createConnection({
        host : "sh-cynosdbmysql-grp-e6mfw7yu.sql.tencentcdb.com",
		database : "If2023",
        user : "root",
        password : "CBBKQmT2",
        port : "20492"
	})
	
    try{
		console.log("sql", "select * from Users where open_ID='"+openId+"'")
        const [rows, fields] = await connection.execute("select * from Users where open_ID='"+openId+"'");
        console.log("rows", rows)
        connection.end()
        return rows
    }catch(error){
        connection.end()
        return null
    }
}