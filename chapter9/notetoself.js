/* notetoself.js
 *
 * 스티키 노트 앱이 된 후의 제1차 버전
 * length를 이용해 새 스티키 노트 id를 생성함
 */

window.onload = init;

function init() {
	var button = document.getElementById("add_button");
	button.onclick = createSticky;

	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.substring(0, 6) == "sticky") {
			var value = localStorage.getItem(key);
			addStickyToDOM(value);
		}
	}
}

function createSticky() {
	var value = document.getElementById("note_text").value;
	var key = "sticky_" + localStorage.length;
	localStorage.setItem(key, value);
	
	addStickyToDOM(value);
}


function addStickyToDOM(value) {
	var stickies = document.getElementById("stickies");
	var sticky = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("class", "sticky");
	span.innerHTML = value;
	sticky.appendChild(span);
	stickies.appendChild(sticky);
}

function clearStickyNotes() {
	localStorage.clear();
	var stickyList = document.getElementById("stickies");
	var stickies = stickyList.childNodes;
	for (var i = stickies.length-1; i >= 0; i--) {
		stickyList.removeChild(stickies[i]);
	}
}

