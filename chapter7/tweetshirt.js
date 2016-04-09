	/* tweetshirt.js */

window.onload = function() {
	var button = document.getElementById("previewButton");
	button.onclick = previewHandler;

	// 이스터에그 호출
	makeImage();
}

function previewHandler() {
	var canvas = document.getElementById("tshirtCanvas");
	var context = canvas.getContext("2d");

	fillBackgroundColor(canvas, context);

	var selectObj = document.getElementById("shape");
	var index = selectObj.selectedIndex;
	var shape = selectObj[index].value;

	if (shape == "squares") {
		for (var squares = 0; squares < 20; squares++) {
			drawSquare(canvas, context);
		}
	}
	else if (shape == "circles") {
		for (var circles = 0; circles < 20; circles++) {
			drawCircle(canvas, context);
		}
	}
	drawText(canvas, context);
	drawBird(canvas, context);
}

// 배경색을 칠하는 함수
function fillBackgroundColor(canvas, context) {
	var selectObj = document.getElementById("backgroundColor");
	var index = selectObj.selectedIndex;
	var bgColor = selectObj[index].value;

	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

}

// 랜덤 위치에 사각형을 그리는 함수
function drawSquare(canvas, context) {
	var w = Math.floor(Math.random() * 40);    
	var x = Math.floor(Math.random() * canvas.width);
	var y = Math.floor(Math.random() * canvas.height);

	// 트위터의 파란색을 칠하기 위해
	// 이 fillStyle 속성을 대신 사용함
	//context.fillStyle = "rgb(0, 173, 239)";
	context.fillStyle = "lightblue";
	context.fillRect(x, y, w, w);
}

// 랜덤 위치에 원을 그리는 함수
function drawCircle(canvas, context) {
	var radius = Math.floor(Math.random() * 40);
	var x = Math.floor(Math.random() * canvas.width);
	var y = Math.floor(Math.random() * canvas.height);

	context.beginPath();
	context.arc(x, y, radius, 0, degreesToRadians(360), true);

	// 트위터의 파란색을 칠하기 위해
	// 이 fillStyle 속성을 대신 사용함
	//context.fillStyle = "rgb(0, 173, 239)";
	context.fillStyle = "lightblue";
	context.fill();
}

// 트윗을 포함한 모든 텍스트를 그리는 함수
function drawText(canvas, context) {
	var selectObj = document.getElementById("foregroundColor");
	var index = selectObj.selectedIndex;
	var fgColor = selectObj[index].value;

	context.fillStyle = fgColor;
	context.font = "bold 1em 고딕";
	context.textAlign = "left";
	context.fillText("이 트윗을 봅니다", 20, 40);


	// 트윗 그리기!
	selectObj = document.getElementById("tweets");
	index = selectObj.selectedIndex;
	var tweet = selectObj[index].value;
	context.font = "italic 1.2em 명조";
	context.fillText(tweet, 30, 100);

	// splitIntoLines 함수를 실행해서 보다 긴 트윗을 처리하려면, 
	// 다음 코드의 주석 처리를 해제하고 
	// 바로 위의 context.fillText 행을 주석 처리하세요.
/*
	if (tweet.length > 60) {
		var tweetLines = splitIntoLines(tweet);
		for (var i = 0; i < tweetLines.length; i++) {
			context.fillText(tweetLines[i], 30, 70+(i*25));
		}
	}
	else {
		context.fillText(tweet, 30, 100);
	}
*/

	context.font = "bold 1em 고딕";
	context.textAlign = "right";
	context.fillText("이 허름한 티셔츠밖에 없었어요 !", 
		canvas.width-20, canvas.height-40);
}

// 트위터 새 이미지를 그리는 함수
function drawBird(canvas, context) {
	var twitterBird = new Image();
	twitterBird.src = "twitterBird.png";
	twitterBird.onload = function() {
		context.drawImage(twitterBird, 20, 120, 70, 70);
	};

}

function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}


function updateTweets(tweets) {
	var tweetsSelection = document.getElementById("tweets");

	// tweets 메뉴에 모든 트윗을 추가
	for (var i = 0; i < tweets.length; i++) {
		tweet = tweets[i];

		// 옵션 생성
		var option = document.createElement("option");
		option.text = tweet.text;

		// 옵션에 장애가 생기지 않게 트윗에서 모든 종류의 따옴표를 제거
		option.value = tweet.text.replace("\"", "'");

		// 선택할 옵션 추가
		tweetsSelection.options.add(option);
    }
	// 맨 위의 트윗을 선택된 상태로 만듬
	tweetsSelection.selectedIndex = 0;
}


// 한 개의 긴 문자열을 60문자가 넘지 않는 여러 행으로 분리하고,
// 그 행들로 구성된 배열을 반환
function splitIntoLines(str) {
	var strs = new Array();
	var space = str.indexOf(' ', 60);
	strs[0] = str.substring(0, space);
	strs[1] = str.substring(space+1);
	if (strs[1].length > 60) {
		space = strs[1].indexOf(' ', 60);
		strs[1] = strs[1].substring(space+1);
		strs[2] = strs[1].substring(0, space);
	}
	return strs;
}

// 이스터에그(숨겨놓은 비장의) 함수
function makeImage() {
	var canvas = document.getElementById("tshirtCanvas");
	canvas.onclick = function () {
		window.location = canvas.toDataURL('image/png');
	};
}
