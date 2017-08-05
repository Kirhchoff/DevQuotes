var to;
var state = {};

function setNewQuote(quote) {
  setStatus("");
  state.quote = quote;
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

function setStatus(status) {
  let statusHolder = document.getElementById("status");
  statusHolder.innerHTML = status;
}

function fallback() {
  setNewQuote(getQuote());
  setStatus("Quoter service is unfortunately unreachable... But here is a backup quote for you anyway:");
}

function httpGetAsync(callback, theUrl)
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
  state.quote = "";
  if (window.location.hash){
    httpGetAsync(setNewQuote, "https://quotor.herokuapp.com/quote?q=" + window.location.hash.slice(1));
  } else {
    httpGetAsync(setNewQuote, "https://quotor.herokuapp.com/quote");
  }
}

function showTipJar(){
  let tipJar = document.getElementById("tipjar");
  tipJar.style.display = "block";
}

function hideTipJar(){
  let tipJar = document.getElementById("tipjar");
  tipJar.style.display = "none";
}

function showNewQuoteForm() {
  console.log("New quote form");
}

function setupMenu() {
  let tipJar = document.getElementById("menu-tips");
  tipJar.addEventListener("click", ()=>{
    showTipJar();
  });
  let suggest = document.getElementById("menu-suggest");
  suggest.addEventListener("click", ()=>{
    showNewQuoteForm();
  });
  let tweet = document.getElementById("menu-tweet");
  tweet.addEventListener("click", ()=>{
    window.open("https://twitter.com/intent/tweet?text="+state.quote);
  });
}

function setupTipjar() {
  let btnClose = document.getElementById("btn-close-tipjar");
  btnClose.addEventListener("click", ()=>{
    hideTipJar();
  })
}

window.onload = function() {
  setStatus("Loading...");
  updateQuote();
  setupMenu();
  setupTipjar();
};
