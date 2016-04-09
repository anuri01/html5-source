//
// 핑퐁 워커
//
onmessage = pingpong;

function pingpong(event) {
	if (event.data == "ping") {
		postMessage("pong");
	}
	else {
		// 고의로 에러를 발생시킴!
		1/x;
	}
}

