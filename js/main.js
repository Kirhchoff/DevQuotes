var to;
function setNewQuote(quote) {
  clearTimeout(to);
  let cursor = "<span class=\"cursor\"></span>";
  let target = document.getElementById("quote");
  target.innerHTML = quote + cursor;
  let iter = 0;
  let printChar = function(){
    target.innerHTML = quote.slice(0, ++iter) + cursor;
    if(iter < quote.length)
      to = setTimeout(printChar, 17);
  }
  printChar();
}

function fallback() {
  setNewQuote("<h2>Quoter service is unfortunately unreachable... But here is a backoup quote for you anyway:</h2>" + getQuote());
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
    xmlHttp.send(null);
}

function updateQuote() {
  httpGetAsync("https://quotor.herokuapp.com/quote", setNewQuote);
}

window.onload = function() {
  updateQuote();
};
