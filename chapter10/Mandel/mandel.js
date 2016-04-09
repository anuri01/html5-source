/* 
 * mandel.js
 */

var numberOfWorkers = 8;
var workers = [];
var rowData;
var nextRow = 0;
var generation = 0;

window.onload = init;

function init() {
	setupGraphics();

	//
	// 캔버스를 클릭하면, 이벤트 핸들러가 호출됩니다.
	// 마우스 클릭 지점의 (x, y) 좌표가 든 이벤트 객체가 매개변수로 전달됩니다.
	// 이 값을 클릭 이벤트 핸들러에 넘깁니다.
	//
	canvas.onclick = function(event) {
		handleClick(event.clientX, event.clientY);
	};
	//
	// 브라우저 창 크기가 변경될 땐
	// 캔버스를 초기화 하고 워크를 재시작해야 합니다.
	//
	window.onresize = function() {
		resizeToWindow();
	};

	//
	// 모든 워커를 생성하고 메시지 핸들러를 설정합니다.
	// 	각 워커를 workers 배열에 추가합니다.
	//
	for (var i = 0; i < numberOfWorkers; i++) {
		var worker = new Worker("worker.js");

		worker.onmessage = function(event) {
			processWork(event.target, event.data)
		}

		worker.idle = true;
		workers.push(worker);
	}

	//
	// 워커를 시작합니다.
	//
	startWorkers();

}

//
// startWorkers
//	이 함수는 프랙털의 맨 위(row 0)에서부터 워커가 일하도록 워커를 초기화합니다.
// workers 배열에 든 모든 워커에 대해 루프를 돌려 각 워커에 한 행씩 계산하는 작업을 할당합니다.
//	워커의 계산은 먼저 해당 작업에 메시지를 전송하는 것으로 시작합니다.
//
function startWorkers() {
	generation++;
	nextRow = 0;
	for (var i = 0; i < workers.length; i++) {
		var worker = workers[i];
		if (worker.idle) {
			var task = createTask(nextRow);
			worker.idle = false;
			worker.postMessage(task);
			nextRow++;
		}
	}
} 

//
// processWork
// 	이것은 워커가 메시지를 결과와 함께 보내올 때 호출하는 함수입니다.
//	워커가 현재의 프랙털 생성 작업 중이라면
//	그 데이터 행을 그리고, 그렇지 않다면 그냥 데이터를 날려버립니다.
//	그 결과들을 사용한 후에는, 워커에 다른 행 계산을 시작하도록 할당합니다.
//    
function processWork(worker, workerResults) {
	if (workerResults.generation == generation) {
		drawRow(workerResults);
	}
	reassignWorker(worker);
}

//
// reassignWorker
//	이 함수는 놀고 있는 워커에게 다음 작업을 부여합니다.
//
function reassignWorker(worker) {
	var row = nextRow++;
	if (row >= canvas.height) {
		worker.idle = true;
	} else {
		var task = createTask(row);
		worker.idle = false;
		worker.postMessage(task);
	}
}


// handleClick
//	이 함수는 사용자가 클릭한 (x, y) 좌표를 받아서
// 그 매개변수들을 새 프랙털에 할당합니다.
//	배율 인자는 만델브로 경계의 새 크기를 설정합니다.
//	새 프랙털에는 현재 캔버스 크기의 가로세로 비가 들어 있습니다.
//	프랙털에 새 배율을 적용한 상태에서 워커를 시작합니다.
//
function handleClick(x, y) {
	var width = r_max - r_min;
	var height = i_min - i_max;
	var click_r = r_min + ((width * x) / canvas.width);
	var click_i = i_max + ((height * y) / canvas.height);

	var zoom = 8;

	r_min = click_r - width/zoom;
	r_max = click_r + width/zoom;
	i_max = click_i - height/zoom;
	i_min = click_i + height/zoom;

	startWorkers();
}

//
// resizeToWindow
//	사용자가 브라우저 창 크기를 변경하면
// 캔버스 크기를 바꾸고 프랙털 매개변수를 초기화(경계 크기 변경, 창의 바뀐 가로세로 비를 유지)하는
// 이 함수가 호출됩니다.
// 새로 바뀐 크기를 기준으로 새 프랙털을 계산하는 워커를 다시 시작합니다.
//
function resizeToWindow() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var width = ((i_max - i_min) * canvas.width / canvas.height);
	var r_mid = (r_max + r_min) / 2;
	r_min = r_mid - width/2;
	r_max = r_mid + width/2;
	rowData = ctx.createImageData(canvas.width, 1);

	startWorkers();
}
