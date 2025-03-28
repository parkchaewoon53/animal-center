let params = new URLSearchParams(location.search);

let regId = params.get("regId");
console.log(regId);

let xhr = new XMLHttpRequest();

let url = "http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList";

let query = "?serviceKey=AsKsksTbcdg8cukGUyiMQU%2FawtOq%2BcmyZvZBfGoOZHhAHXweFUxP2W1ysiSuZ6Yh%2Bnsh2KIOC%2FNQDron%2BV9iBQ%3D%3D";
query += "&returnType=JSON";
query += "&numOfRows=10";
query += "&pageNo=1";
query += "&regId=" + regId;

xhr.open("GET", url + query);

xhr.onload = () => {
    console.log(xhr.response);
    let x2js = new X2JS();
    let json = x2js.xml_str2json(xhr.response);
    console.log(json);

    let items = json.ServiceResult.MsgBody.items;
    console.log(items);

    document.getElementById("animal-img").innerHTML = `<img src="https://www.daejeon.go.kr/${items["filePath"]}">`;

    let cardBox = document.querySelector(".animal-introduce-box-right");
    cardBox.innerHTML = "";
        let str = `<div class="animal-introduce-right">${(items["regId"])}</div>
                    <div class="animal-introduce-right">${numbering(items["regId"])}</div>
                    <div class="animal-introduce-right">${stateCd2Str(items["adoptionStatusCd"])}</div>
                    <div class="animal-introduce-right">${gugu(items["gu"])}</div>
                    <div class="animal-introduce-right">${classification(items["classification"])}</div>
                    <div class="animal-introduce-right">${(items["species"])}</div>
                    <div class="animal-introduce-right">${genders(items["gender"])}</div>
                    <div class="animal-introduce-right">${(items["foundPlace"])}</div>
                    <div class="animal-introduce-right">${(items["rescueDate"])}</div>
                    <div class="animal-introduce-right">${(items["age"])}</div>
                    <div class="animal-introduce-right">${(items["weight"])}</div>
                    <div class="animal-introduce-right">${(items["hairColor"])}</div>
                    <div class="animal-introduce-right2">${(items["memo"])}</div>`;
        cardBox.innerHTML += str;
    }

xhr.send();

function numbering(number){
    const parts = number.split('-');
    const year = `20${parts[0]}`;
    const paddedNumber = parts[2].padStart(5, '0');
    return `${year}-${parts[1]}-${paddedNumber}`;
}

function stateCd2Str(cd) {
    if (cd == 1) return "공고중";
    if (cd == 2) return "입양가능";
    if (cd == 3) return "입양예정";
    if (cd == 4) return "입양완료";
    return "주인반환";
}

function gugu(gu) {
    if (gu == 1) return "동구";
    if (gu == 2) return "중구";
    if (gu == 3) return "서구";
    if (gu == 4) return "유성구";
    return "대덕구";
}

function classification(cf) {
    if (cf == 1) return "개";
    if (cf == 2) return "고양이";
    return "기타동물";
}

function genders(ge) {
    if (ge == 1) return "암컷";
    if (ge == 2) return "수컷";
    return "미상";
}


