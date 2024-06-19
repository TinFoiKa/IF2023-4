// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context, connection) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const braceletMaxCount = event.braceletMaxCount
    let errCode = 1000;//操作成功
    try{
        const [rows, fields] = await connection.execute("select * from Bracelets where qr_link='"+event.qrcode+"'");
        if(rows.length > 0){
            const bracelet = rows[0]
            if(bracelet.linked_open_id == null || bracelet.linked_open_id.length == 0){
                const [rows, fields] = await connection.execute("select * from Bracelets where linked_open_id='"+openId+"'");
                if(rows.length < braceletMaxCount){
                    const [rows, fields] = await connection.execute("update Bracelets set linked_open_id='"+openId+"', qr_name='"+event.qrNickName+"',is_active='1' where qr_link='"+event.qrcode+"'");
                    console.log("update rows", rows)
                    if(rows.affectedRows == 0){
                        errCode = 1004;//添加手环失败
                    }
                }else{
                    errCode = 1005;//二维码总数超过限制
                }
            }else{
                errCode = 1003;//二维码已绑定
            }
        }else{
            errCode = 1002;//二维码不存在，无效二维码
        }
        connection.end()
        return errCode
    }catch(error){
        connection.end()
        return 1001;//sql执行出错
    }
}