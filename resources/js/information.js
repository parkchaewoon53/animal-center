var currentPage = 1;
var numOfRows = 9;
var finalPage = 0;

function fetchData(pageNo, filters = {}) {
    var xhr = new XMLHttpRequest();
    var url = 'https://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList';
    var queryParams = '?serviceKey=AsKsksTbcdg8cukGUyiMQU%2FawtOq%2BcmyZvZBfGoOZHhAHXweFUxP2W1ysiSuZ6Yh%2Bnsh2KIOC%2FNQDron%2BV9iBQ%3D%3D';
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pageNo);
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(numOfRows);

    if (filters.searchCondition) {
        queryParams += '&' + encodeURIComponent('searchCondition') + '=' + encodeURIComponent(filters.searchCondition);
    }
    if (filters.searchCondition3) {
        queryParams += '&' + encodeURIComponent('searchCondition3') + '=' + encodeURIComponent(filters.searchCondition3);
    }
    if (filters.searchCondition2) {
        queryParams += '&' + encodeURIComponent('searchCondition2') + '=' + encodeURIComponent(filters.searchCondition2);
    }
    if (filters.gubun) {
        queryParams += '&' + encodeURIComponent('gubun') + '=' + encodeURIComponent(filters.gubun);
    }
    if (filters.searchType && filters.keyword) {
        queryParams += '&' + encodeURIComponent(filters.searchType) + '=' + encodeURIComponent(filters.keyword);
    }

    xhr.open('GET', url + queryParams);
    xhr.onload = function () {
        console.log(xhr.response);
        let x2js = new X2JS();
        let json = x2js.xml_str2json(xhr.response);
        console.log(json);

        if (json.ServiceResult && json.ServiceResult.MsgBody && json.ServiceResult.MsgBody.items) {
            let items = json["ServiceResult"]["MsgBody"]["items"];
            let cardBox = document.querySelector(".card-box");
            cardBox.innerHTML = "";
            for (let i = 0; i < items.length; i++) {
                let str = `<div class="card" data-regId="${items[i]["regId"]}" onclick="goDetail(event)">
                                <div class="card-top">
                                    <span class="card-state ${getStateClass(items[i]['adoptionStatusCd'])}">
                                    ${stateCd2Str(items[i]['adoptionStatusCd'])}</span>
                                    <img class="card-img" src="https://www.daejeon.go.kr/${items[i]["filePath"]}
                                    " alt="">
                                </div>
                                <div class="card-bottom">
                                    <span class="text-bold text-sub-title">${items[i]["species"]} | 
                                        <span class="text-sub">${stateGender(items[i]["gender"])}</span>
                                    </span> 
                                    <span class="text-sub-title">관리번호 : ${items[i]["regId"]}</span>
                                </div>
                            </div>`;
                cardBox.innerHTML += str;
            }
            let totalCount = json.ServiceResult.msgHeader.totalCount;
            finalPage = Math.ceil(totalCount / numOfRows);
            drawPage();
        } else {
            let cardBox = document.querySelector(".card-box");
            cardBox.innerHTML = "<p>검색 결과가 없습니다.</p>";
            finalPage = 0;
            drawPage();
        }
    };
    xhr.send('');
}

function goPage(no, filters = {}) {
    currentPage = no;
    fetchData(currentPage, filters);
}

function drawPage() {
    let startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    let lastPage = Math.min(startPage + 9, finalPage);

    let pagingBox = document.querySelector(".paging-box");
    pagingBox.innerHTML = "";

    pagingBox.innerHTML += `<a href="javascript:goFirst()">&lt;&lt;</a>`;
    pagingBox.innerHTML += `<a href="javascript:previous()">&lt;</a>`;

    for (let i = startPage; i <= lastPage; i++) {
        let str = `<a href="javascript:goPage(${i}, getFilters())">${i}</a>`;
        if (i === currentPage) {
            str = `<a href="#" class="active">${i}</a>`;
        }
        pagingBox.innerHTML += str;
    }

    pagingBox.innerHTML += `<a href="javascript:next()">&gt;</a>`;
    pagingBox.innerHTML += `<a href="javascript:goLast()">&gt;&gt;</a>`;
}

function next() {
    currentPage = Math.min(Math.floor((currentPage - 1) / 10) * 10 + 11, finalPage);
    fetchData(currentPage, getFilters());
}

function previous() {
    currentPage = Math.max(Math.floor((currentPage - 1) / 10) * 10, 1);
    fetchData(currentPage, getFilters());
}

function goLast() {
    currentPage = finalPage;
    fetchData(currentPage, getFilters());
}

function goFirst() {
    currentPage = 1;
    fetchData(currentPage, getFilters());
}

function getStateClass(cd) {
    if (cd == 1) return "state-notice";
    if (cd == 2) return "state-available";
    if (cd == 3) return "state-reserved";
    if (cd == 4) return "state-adopted";
    return "state-returned";
}

function stateCd2Str(cd) {
    if (cd == 1) return "공고중";
    if (cd == 2) return "입양가능";
    if (cd == 3) return "입양예정";
    if (cd == 4) return "입양완료";
    return "주인반환";
}

function stateGender(sg) {
    if (sg == 1) return "암컷";
    if (sg == 2) return "수컷";
    return "미상";
}

function goDetail(event) {
    let card = event.target.closest(".card");
    let regId = card.dataset.regId;
    if (!regId) {
        regId = card.getAttribute("data-regId");
    }
    console.log("Final regId:", regId);

    open("./information-information.html?regId=" + regId);
}

function getFilters() {
    return {
        searchCondition: document.getElementById("searchConditionFilter").value,
        searchCondition3: document.getElementById("searchCondition3Filter").value,
        searchCondition2: document.getElementById("searchCondition2Filter").value,
        gubun: document.getElementById("gubunFilter").value,
        searchType: document.getElementById("searchType").value,
        keyword: document.getElementById("inputKeyword").value
    };
}

document.getElementById("searchBtn").addEventListener("click", function () {
    currentPage = 1;
    fetchData(currentPage, getFilters());
});

fetchData(currentPage);

document.querySelectorAll(".species-card").forEach(card => {
    card.addEventListener("click", function () {
        document.getElementById("searchConditionFilter").value = "";
        document.getElementById("searchCondition3Filter").value = "";

        document.querySelectorAll(".species-card").forEach(c => c.classList.remove("active"));

        this.classList.add("active");

        let filterId = this.dataset.id;
        let filterValue = this.dataset.value;

        if (filterId && filterValue) {
            let selectElement = document.getElementById(filterId);
            if (selectElement) {
                selectElement.value = filterValue;
            }
        }

        currentPage = 1;
        fetchData(currentPage, getFilters());
    });
});

function downloadExcel() {
    var xhr = new XMLHttpRequest();
    var url = 'https://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList';
    var queryParams = '?serviceKey=AsKsksTbcdg8cukGUyiMQU%2FawtOq%2BcmyZvZBfGoOZHhAHXweFUxP2W1ysiSuZ6Yh%2Bnsh2KIOC%2FNQDron%2BV9iBQ%3D%3D';
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(1);
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(100000);

    xhr.open('GET', url + queryParams);
    xhr.onload = function () {
        let x2js = new X2JS();
        let json = x2js.xml_str2json(xhr.response);

        if (json.ServiceResult && json.ServiceResult.MsgBody && json.ServiceResult.MsgBody.items) {
            let items = json.ServiceResult.MsgBody.items;
            let data = [["공고번호", "종류", "성별", "입양 상태", "이미지 링크"]];

            items.forEach(item => {
                data.push([
                    item.regId,
                    item.species,
                    stateGender(item.gender),
                    stateCd2Str(item.adoptionStatusCd),
                    `https://www.daejeon.go.kr/${item.filePath}`
                ]);
            });

            let ws = XLSX.utils.aoa_to_sheet(data);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Animal Data");

            XLSX.writeFile(wb, "animal_data.xlsx");
        } else {
            alert("다운로드할 데이터가 없습니다.");
        }
    };
    xhr.send();
}

document.getElementById("downloadExcelBtn").addEventListener("click", downloadExcel);
