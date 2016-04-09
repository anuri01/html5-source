/* 
 * mandellib.js
 *
 *
 * ------ 사전 준비 전역변수 ---- 
 */
var canvas;
var ctx;

var i_max = 1.5;
var i_min = -1.5;
var r_min = -2.5;
var r_max = 1.5;

var max_iter = 1024;
var escape = 100;
var palette = [];


/* 
 * ------- 사전 준비 코드 --------
 *
 */

//
// 워커로 보내야 할 데이터를 포장
//
function createTask(row) {
	var task = {
		row: row,					// 작업 중인 행 번호
		width: rowData.width,  // 채워야 할 ImageData 객체의 너비
		generation: generation, // 작업 진도
		r_min: r_min,
		r_max: r_max,
		i: i_max + (i_min - i_max) * row / canvas.height,
		max_iter: max_iter,
		escape: escape
	};
	return task;
}
//
// 이 함수는 번호를 0에서 max_iter을 거쳐 256까지 일대일 대응시킨 후,
// (r, g, b) 값으로 팔레트를 채웁니다.
// 이로써 배열 안에서 서로 더 비슷한 색상이 서로 이웃하게 됩니다.
// 그리고 r, g, b 값을 각각 다른 비율로 늘여서 
// max_iter > 256인 스펙트럼을 채웁니다.
//
//
function makePalette() {
    function wrap(x) {
        x = ((x + 256) & 0x1ff) - 256;
        if (x < 0) x = -x;
        return x;
    }
    for (i = 0; i <= this.max_iter; i++) {
        palette.push([wrap(7*i), wrap(5*i), wrap(11*i)]);
    }
}

//
// drawRow 함수는 한 행에 대해 워커가 반환한 배열 안의 값들을 
// 팔레트를 이용해 색상에 일대일 대응시킵니다.
//
function drawRow(workerResults) {
    var values = workerResults.values;	// 워커가 반환하는 values 배열
    var pixelData = rowData.data;		// ImageData obj의 실제 픽셀
										// pixelData는 rowData.data로의 '참조'입니다.
										// 	따라서 pixelData가 변경되면 rowData.data도 따라서 변합니다!!!
    for (var i = 0; i < rowData.width; i++) {  // 해당 행의 각 픽셀마다 실행
		var red = i * 4;
		var green = i * 4 + 1;
		var blue = i * 4 + 2;
		var alpha = i * 4 + 3;

        pixelData[alpha] = 255; // 알파 값을 불투명하게 지정

		// values 배열에 음수가 들어 있으면 해당 색을 검은색으로 설정
        if (values[i] < 0) {
            pixelData[red] = pixelData[green] = pixelData[blue] = 0;
        } else {
			//
			// 워커가 반환한 values 배열에 든 숫자를 팔레트 색상에 일대일 대응시킴
			//
            var color = this.palette[values[i]];

			//
			// 각 색상에 rgb 구성요소가 들어 있으므로, r,g,b로 작업하려는 해당 픽셀의 rgb를 지정합시다.
			//
            pixelData[red] = color[0];
            pixelData[green] = color[1];
            pixelData[blue] = color[2];
        }
    }
	//
	// 해당 행을 캔버스 안에 다시 그림
	// workerData.row는 작업 중인 행 번호입니다.
	// rowData 에는 방금 업데이트한 데이터가 들어 있습니다!
	// 열 0에서부터 시작하므로, (x, y) = (0, row)입니다.
	//
    ctx.putImageData(this.rowData, 0, workerResults.row);
}


//
// setupGraphics 함수는 만델로브 계산에 사용될 변수의 몇몇 초깃값을 할당하고,
//	캔버스의 너비와 높이를 창의 너비와 높이로 설정합니다.
//
function setupGraphics() {

	canvas = document.getElementById("fractal");
	ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var width = ((i_max - i_min) * canvas.width / canvas.height);
	var r_mid = (r_max + r_min) / 2;
	r_min = r_mid - width/2;
	r_max = r_mid + width/2;

	rowData = ctx.createImageData(canvas.width, 1);

	makePalette();
}
