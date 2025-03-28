    let xhr = new XMLHttpRequest();

    xhr.open("GET", "./shop_data (1).xlsx");

    xhr.responseType = "arraybuffer";

    xhr.onload = () => {
        console.log(xhr.response);
        let uint = new Uint8Array(xhr.response);
        let excel = XLSX.read(uint, { type: "array" });
        let sheet = excel.Sheets[excel.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet);

        console.log(json);
        for (var i = 0; i < json.length; i++) {
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(json[i]["Latitude"], json[i]["Longitude"]),
                title: json[i]["name"],
                image: markerImage
            });
            markerArray.push(marker);
        }
        clusterer.addMarkers(markerArray);
    }

    xhr.send();
    var mapContainer = document.getElementById('map');
    let mapOption = {
        center: new kakao.maps.LatLng(36.326473, 127.408140),
        level: 4
    };

    var map = new kakao.maps.Map(mapContainer, mapOption);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 6
    });
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    var imageSize = new kakao.maps.Size(24, 35);
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    let markerArray = [];

