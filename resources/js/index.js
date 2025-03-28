// index에서만 적용할 자바스크립트 작성하기

var xhr = new XMLHttpRequest();

var url = 'http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList'; /*URL*/
var queryParams = '?serviceKey=AsKsksTbcdg8cukGUyiMQU%2FawtOq%2BcmyZvZBfGoOZHhAHXweFUxP2W1ysiSuZ6Yh%2Bnsh2KIOC%2FNQDron%2BV9iBQ%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('5'); /**/
queryParams += '&' + encodeURIComponent('searchCondition3') + '=' + encodeURIComponent('2'); /**/
xhr.open('GET', url + queryParams);
xhr.onload = function () {
    console.log(xhr.response);
    let x2js = new X2JS();
    let json = x2js.xml_str2json(xhr.response);
    console.log(json);

    let items = json["ServiceResult"]["MsgBody"]["items"];
    for (let i = 0; i < items.length; i++) {
        let str = `<div class="card" data-reg-id = "${items[i]["regId"]}">
                    <div class="card-top">
                        <img class="card-img"
                            src="https://www.daejeon.go.kr/${items[i]["filePath"]}"
                            alt="">
                        <div class="card-state">${stateCd2Str(items[i]["adoptionStatusCd"])}</div>
                    </div>
                    <div class="card-bottom">
                        <span class="text-bold text-sub-title">${items[i]["species"]}</span>
                        <span class="text-sub">${(items[i]["gender"] == 1) ? "암컷" : "수컷"}</span>
                    </div>
                </div>`;
        document.querySelector(".card-box").innerHTML += str;
    }
};

xhr.send('');
// 입양상태 코드에 따른 문자열값 리턴
function stateCd2Str(cd) {
    if (cd == 1) {
        return "공고중";
    } else if (cd == 2) {
        return "입양가능";
    } else if (cd == 3) {
        return "입양예정"
    } else if (cd == 4) {
        return "입양완료"
    } else {
        return "주인반환"
    }
}

function goDetail() {
    let regId = event.currentTarget.dataset["regId"];
    open("./information-information.html?regId=" + regId);
}