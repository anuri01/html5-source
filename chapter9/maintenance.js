/* maintenance.js - 자가 점검용 스크립트 파일 */

window.onload = function() {
	var clearButton = document.getElementById("clear_button");
	clearButton.onclick = clearStorage;
}

function clearStorage() {
	localStorage.clear();
}
