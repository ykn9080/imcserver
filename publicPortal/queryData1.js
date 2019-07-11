var path = require('path');
var fs=require('fs');
var request = require('request');
const key="jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";

function portalGet(req,res){

// // var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst';
// // var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+key; /* Service Key*/
// // queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
// // queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
// // queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent('서울'); /* 시도 이름 (서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종) */
// // queryParams += '&' + encodeURIComponent('searchCondition') + '=' + encodeURIComponent('DAILY'); /* 요청 데이터기간 (시간 : HOUR, 하루 : DAILY) */
// // queryParams += '&' +'_returnType=json';

// var url = 'http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService';
// var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+key; /* Service Key*/
// queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* 공공데이터포털에서 받은 인증키 */
// queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지번호 */
// queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
// queryParams += '&' + encodeURIComponent('resultType') + '=' + encodeURIComponent('XML'); /* 결과형식(XML/JSON) */
// queryParams += '&' + encodeURIComponent('date') + '=' + encodeURIComponent('20171208'); /* 검색조건 날짜 (예시 : 20171208) */
// queryParams += '&' + encodeURIComponent('stationcode') + '=' + encodeURIComponent('1'); /* 검색조건 측정소코드 */
// queryParams += '&' + encodeURIComponent('itemcode') + '=' + encodeURIComponent('90303'); /* 검색조건 항목코드 */
// queryParams += '&' + encodeURIComponent('timecode') + '=' + encodeURIComponent('RH02'); /* 검색조건 시간구분 */


// request({
//     url: url + queryParams,
//     method: 'GET'
// }, function (error, response, body) {
//     //console.log('Status', response.statusCode);
//     //console.log('Headers', JSON.stringify(response.headers));
//     //console.log('Reponse received', body);
// 	var result = convert.xml2json(body, {compact: true, spaces: 0});
//     res.send(body);
// });

// var url = 'http://www.iwest.co.kr:8082/openapi-data/service/Air/AirList';
// var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+key; /* Service Key*/
// queryParams += '&' + encodeURIComponent('strOrgCd') + '=' + encodeURIComponent('TA'); // 발전소코드번호 
// queryParams += '&' + encodeURIComponent('strHoki') + '=' + encodeURIComponent('8612'); /* 발전소 위치번호 */
// queryParams += '&' + encodeURIComponent('strSym') + '=' + encodeURIComponent('201408'); /* 조회날짜 */
// console.log("11111",url+queryParams)
// request({
//     url: url + queryParams,
//     method: 'GET'
// }, function (error, response, body) {
//     //console.log('Status', response.statusCode);
//     //console.log('Headers', JSON.stringify(response.headers));
//     //console.log('Reponse received', body);
//     res.send(body)
// });

// var url = 'http://apis.data.go.kr/B551182/hospAsmRstInfoService/getGnhpSprmAsmRstList';
// var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+key; /* Service Key*/
// queryParams += '&' + encodeURIComponent('numOfRows') + '=1' + encodeURIComponent('pageNo')+'=10'; 
// request({
//     url: url + queryParams,
//     method: 'GET'
// }, function (error, response, body) {
//     //console.log('Status', response.statusCode);
//     //console.log('Headers', JSON.stringify(response.headers));
//     //console.log('Reponse received', body);
//     res.send(body)
// });
// console.log("req.body.url ",req.body.url)
request({
    url: req.body.url ,
    method: 'GET'
}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
	//var result = convert.xml2json(body, {compact: true, spaces: 0});
	console.log(body)
    res.send(body);
});
}
function readReturn(url){
	var root = path.join("__dirname__", "../");
	var spath=path.join(root,url);

	if (fs.existsSync(spath)) {
        var file = fs.readFileSync(spath, 'utf8');
        return JSON.parse(file);
    }
}
function readLocal(req,res){
	res.send(readReturn(req.body.url));
	// var root = path.join("__dirname__", "../");
	// var spath=path.join(root,req.body.url);

	// if (fs.existsSync(spath)) {
 //        var file = fs.readFileSync(spath, 'utf8');
 //        res.send(JSON.parse(file));
 //    }
}
module.exports.portalGet=portalGet;
module.exports.readReturn=readReturn;
module.exports.readLocal=readLocal;