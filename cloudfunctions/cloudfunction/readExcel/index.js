const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 获取openId云函数入口函数
exports.main = async (event, context, connection) => {
    connection.end()
    
    let fileID = event.fileID
    console.log("env", cloud.DYNAMIC_CURRENT_ENV)
    //1,通过fileID下载云存储里的excel文件
    const res = await cloud.downloadFile({
        fileID: fileID,
    })
    const buffer = res.fileContent
    const tasks = [] //用来存储所有的添加数据操作
    //2,解析excel文件里的数据
    var sheets = xlsx.parse(buffer); //获取到所有sheets
    tasks.push(sheets)
    // 等待所有数据添加完成
    let result = await Promise.all(tasks).then(res => {
        return res
    }).catch(function (err) {
        return err
    })
    return result
};