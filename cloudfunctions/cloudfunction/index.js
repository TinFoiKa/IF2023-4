const register = require('./register/index')
const getUserByOpenId = require('./getUserByOpenId/index')
const createBracelet = require('./createBracelet/index')
const addBracelet = require('./addBracelet/index')
const getMyQrList = require('./getMyQrList/index')
const readExcel = require('./readExcel/index')
const executeSql = require('./executeSql/index')
const saveImportBooth = require('./saveImportBooth/index')
const saveImportBoothMenu = require('./saveImportBoothMenu/index')
const saveImportSponsor = require('./saveImportSponsor/index')
const saveBoothManager = require('./saveBoothManager/index')
const resetUserQrCode = require('./resetUserQrCode/index')
const getEagleBuckSubtotal = require('./getEagleBuckSubtotal/index')
const saveFeedbacks = require('./saveFeedbacks/index')
const saveImportDunkTank = require('./saveImportDunkTank/index')
const saveDunkTank = require('./saveDunkTank/index')
const saveLuckyDraw = require('./saveLuckyDraw/index')
const getOtherUserByOpenId = require('./getOtherUserByOpenId/index')
const removeEBRecord = require('./removeEBRecord/index')
const userScan = require('./userScan/index')
const returnUserEagleBucks = require('./returnUserEagleBucks/index')
const deleteDunkTank = require('./deleteDunkTank/index')
const uploadBoothMenuImage = require('./uploadBoothMenuImage/index')
const getActivityStatus = require('./getActivityStatus/index')
const saveImportBoothMgr = require('./saveImportBoothMgr/index')
const findBaseData = require('./findBaseData/index')
const saveImportLuckyDrawPrize = require('./saveImportLuckyDrawPrize/index')
const uploadLuckyDrawPrizeImage = require('./uploadLuckyDrawPrizeImage/index')
const deleteBooth = require('./deleteBooth/index')
const deleteDunkTankPhoto = require('./deleteDunkTankPhoto/index')
const clearAllEB = require('./clearAllEB/index')
const exportStatistic = require('./exportStatistic/index')
const getPayEBTotalPaidRMB = require('./getPayEBTotalPaidRMB/index')

// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var conn = await mysql.createConnection({
        host : "sh-cynosdbmysql-grp-e6mfw7yu.sql.tencentcdb.com",
		database : "If2023",
        user : "root",
        password : "CBBKQmT2",
        port : "20492"
	})
	
	switch (event.type) {
		case 'register':
			return await register.main(event, context, conn)
			break;
		case 'getUserByOpenId':
			return await getUserByOpenId.main(event, context, conn)
			break;
		case 'createBracelet':
			return await createBracelet.main(event, context, conn)
			break;
		case 'addBracelet':
			return await addBracelet.main(event, context, conn)
			break;
		case 'getMyQrList':
			return await getMyQrList.main(event, context, conn)
			break;
		case 'readExcel':
			return await readExcel.main(event, context, conn)
			break;
		case 'executeSql':
			return await executeSql.main(event, context, conn)
			break;
		case 'saveImportBooth':
			return await saveImportBooth.main(event, context, conn)
			break;
		case 'saveImportBoothMenu':
			return await saveImportBoothMenu.main(event, context, conn)
			break;
		case 'saveImportSponsor':
			return await saveImportSponsor.main(event, context, conn)
			break;
		case 'saveBoothManager':
			return await saveBoothManager.main(event, context, conn)
			break;
		case 'resetUserQrCode':
			return await resetUserQrCode.main(event, context, conn)
			break;
		case 'getEagleBuckSubtotal':
			return await getEagleBuckSubtotal.main(event, context, conn)
			break;
		case 'saveFeedbacks':
			return await saveFeedbacks.main(event, context, conn)
			break;
		case 'saveImportDunkTank':
			return await saveImportDunkTank.main(event, context, conn)
			break;
		case 'saveDunkTank':
			return await saveDunkTank.main(event, context, conn)
			break;
		case 'saveLuckyDraw':
			return await saveLuckyDraw.main(event, context, conn)
			break;
		case 'getOtherUserByOpenId':
			return await getOtherUserByOpenId.main(event, context, conn)
			break;
		case 'removeEBRecord':
			return await removeEBRecord.main(event, context, conn)
			break;
		case 'userScan':
			return await userScan.main(event, context, conn)
			break;
		case 'returnUserEagleBucks':
			return await returnUserEagleBucks.main(event, context, conn)
			break;
		case 'deleteDunkTank':
			return await deleteDunkTank.main(event, context, conn)
			break;
		case 'uploadBoothMenuImage':
			return await uploadBoothMenuImage.main(event, context, conn)
			break;
		case 'getActivityStatus':
			return await getActivityStatus.main(event, context, conn)
			break;
		case 'saveImportBoothMgr':
			return await saveImportBoothMgr.main(event, context, conn)
			break;
		case 'findBaseData':
			return await findBaseData.main(event, context, conn)
			break;
		case 'saveImportLuckyDrawPrize':
			return await saveImportLuckyDrawPrize.main(event, context, conn)
			break;
		case 'uploadLuckyDrawPrizeImage':
			return await uploadLuckyDrawPrizeImage.main(event, context, conn)
			break;
		case 'deleteBooth':
			return await deleteBooth.main(event, context, conn)
			break;
		case 'deleteDunkTankPhoto':
			return await deleteDunkTankPhoto.main(event, context, conn)
			break;
		case 'clearAllEB':
			return await clearAllEB.main(event, context, conn)
			break;
		case 'exportStatistic':
			return await exportStatistic.main(event, context, conn)
			break;
		case 'getPayEBTotalPaidRMB':
			return await getPayEBTotalPaidRMB.main(event, context, conn)
			break;
		default:
			conn.end()
			return wxContext.OPENID
			break;
	}
}