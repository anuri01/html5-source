/* quote.js */

var quotes = ["난 삶이 장난이 아니길 바랍니다. 왜냐하면 저는 장난에 익숙지 않거든요.",
              "모든 터널의 끝엔 밝은 출구가 있게 마련이라지만, 그래도 삶이 열차는 아니라면 좋겠어요!",
              "여러분은 첫눈에 반하든지 아니면 스쳐 지나가게 된다는 이야기를 믿나요?"];

function postAQuote() {
	var index = Math.floor(Math.random() * quotes.length);
	postMessage(quotes[index]);
}
postAQuote();
setInterval(postAQuote, 3000);

