// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    try{
        const [rows, fields] = await connection.execute("update Users set ifqr='"+event.ifqr+"' where open_ID='"+openId+"'");
        console.log("rows", rows)
        connection.end()
        return rows
    }catch(error){
        connection.end()
        return null
    }
}