const uuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
       s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
   
    var uuid = s.join("");
    return uuid
}

const getCode = function () {
    var s = [];
    var hexDigits = "0123456789";
    for (var i = 0; i < 4; i++) {
      	s[i] = hexDigits.substr(Math.floor(Math.random() * 10), 1);
	}
    var code = s.join("");
    return code
}
  
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

var formatDateUTC_yyyyMMddHHmmss = function UTCformat(utc) {
	if(utc != null && utc != "" && utc.length > 0){
		var date = new Date(utc),
		year = date.getFullYear(),
		month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
		day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
		hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
		minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
		seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
		var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':'+ seconds;
		return res;
	}else{
		return "";
	}
}
  
var formatDateUTC_yyyyMMdd = function UTCformat(utc) {
	if(utc != null && utc != "" && utc.length > 0){
		var date = new Date(utc),
		year = date.getFullYear(),
		month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
		day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
		var res = year + '-' + month + '-' + day;
		return res;
	}else{
		return "";
	}
}

var formatDate_yyyyMMddHHmmss = function UTCformat(utc) {
	if(utc != null && utc != "" && utc.length > 0){
		var date = utc.replace("T", " ")
		date = date.substring(0, 19)
		return date;
	}else{
		return "";
	}
}

var formatDate_yyyyMMdd = function UTCformat(utc) {
	if(utc != null && utc != "" && utc.length > 0){
		var date = utc.substring(0, 10)
		return date;
	}else{
		return "";
	}
}

var formatDateUTC_yyyyMMddHHmmss_newDate = function UTCformat() {
	var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
	day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
	hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
	minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
	seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
	var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':'+ seconds;
	return res;
}
  
  // 需要导出
module.exports = {
	uuid,
	getCode,
	formatDateUTC_yyyyMMdd,
	formatDateUTC_yyyyMMddHHmmss,
	formatDate_yyyyMMddHHmmss,
	formatDate_yyyyMMdd,
	formatDateUTC_yyyyMMddHHmmss_newDate
}
