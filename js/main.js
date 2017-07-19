
function setNewQuote(quote) {
  let target = document.getElementById("quote");
  target.innerHTML = quote;
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  target.style.backgroundColor = "rgb("+r+","+g+","+b+")";

  var isColorLight = function (r, g, b) {
    // Counting the perceptive luminance
    // human eye favors green color...
    var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return (a < 0.5);
  }

  target.style.color = isColorLight(r,g,b) ? "black" : "white";
}

function fallback() {
  setNewQuote("<h2>Quoter service unreachable... But here is a quote for you anyway:</h2>"+getQuote());
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.onerror = fallback;
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Origin", "Bar");
    xmlHttp.send(null);
}

function updateQuote() {
  httpGetAsync("https://quotor.herokuapp.com/quote", setNewQuote);
}

window.onload = function() {
  document.getElementById("gen_quote").onclick = updateQuote;
  updateQuote();
};
