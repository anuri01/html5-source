/*
 * workerlib.js
 *
 */

/* -------- 사전 준비 코드: 워커 ------- */

//
// 한 행의 프랙탈을 계산
// 관리 코드로 반환되는 값 배열엔 그 행의 각 픽셀의 번호가 들어 있습니다.
// 
function computeRow(task) {
	var iter = 0;
	var c_i = task.i;
	var max_iter = task.max_iter;
	var escape = task.escape * task.escape;
	task.values = [];
	for (var i = 0; i < task.width; i++) {
		var c_r = task.r_min + (task.r_max - task.r_min) * i / task.width;
		var z_r = 0, z_i = 0;

		for (iter = 0; z_r*z_r + z_i*z_i < escape && iter < max_iter; iter++) {
			// z -> z^2 + c
			var tmp = z_r*z_r - z_i*z_i + c_r;
			z_i = 2 * z_r * z_i + c_i;
			z_r = tmp;
		}
		if (iter == max_iter) {
			iter = -1;
		}
		task.values.push(iter);
	}
	return task;
}
