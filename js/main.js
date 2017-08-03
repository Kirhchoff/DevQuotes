var to;
function setNewQuote(quote) {
  let author = " - Author";
  clearTimeout(to);
  let cursor = "<span class=\"cursor\"></span>";
  let quoteHolder = document.getElementById("quote");
  let authorHolder = document.getElementById("author");
  let printCharByChar = function(callback, message, target, iter = 0){
    target.innerHTML = message.slice(0, ++iter) + cursor;
    if(iter < message.length)
      to = setTimeout(printCharByChar.bind(this, callback, message, target, iter), 17);
    else {
      target.innerHTML = message;
      callback();
    }
  }
  printCharByChar(()=>{
    printCharByChar(()=>{
      authorHolder.innerHTML = author + cursor;
    }, author, authorHolder);
    authorHolder.innerHTML = author + cursor;
  }, "> " + quote, quoteHolder);
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

function setupMenu() {
  //todo: handle mouse events on menu
}

window.onload = function() {
  updateQuote();
  setupMenu();
};
