/* mightygumball.js */
/*
 * JSON 파일의 내용을 Ajax로 가져옴
 *
 */

window.onload = init;

function init() {
	getSales();
}

//
// 이 함수는 XMLHttpRequest Level 1로 작성한 것이므로,
// IE, 오페라, 사파리 구 버전, 파이어폭스 구 버전, 크롬 구 버전 등을 사용한다면
// 이것 대신 아래의 Level 2로 작성한 코드를 사용해야 합니다.
//
function getSales_XHRv1() {
	// 아래 지정한 URL을 sales.json 파일을 넣은 경로로 변경하세요!
	var url = "sales.json";
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			updateSales(request.responseText);
		}
	};
	request.send(null);
}

//
// XMLHttpRequest Level 2로 작성한 코드 (파이어폭스, 사파리, 크롬 최근 버전에 구현되었습니다)
// 과정을 확인하고 onreadystatechange를 검사할 필요 없이 onload 이벤트 핸들러로 load 이벤트를 검사할 수 있습니다.
//
function getSales() {
	// 아래 지정한 URL을 sales.json 파일을 넣은 경로로 변경하세요!
	var url = "sales.json";
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			updateSales(request.responseText);
		}
	};
	request.send(null);
}

function updateSales(responseText) {
	var salesDiv = document.getElementById("sales");
	var sales = JSON.parse(responseText);
	for (var i = 0; i < sales.length; i++) {
		var sale = sales[i];
		var div = document.createElement("div");
		div.setAttribute("class", "saleItem");
		div.innerHTML = sale.name + "에서 검볼을 " + sale.sales + "개 팔았습니다";
		salesDiv.appendChild(div);
	}
}

