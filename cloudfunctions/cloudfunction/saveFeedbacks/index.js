// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const feedbackContent = event.feedbackContent
    try{
        const [rows, fields] = await connection.execute("insert into Feedbacks (open_ID, content) values (?, ?)", [openId, feedbackContent]);
        connection.end()
        return "success"
    }catch(error){
        connection.end()
        console.log("error", error)
        return "error";//sql执行出错
    }
}