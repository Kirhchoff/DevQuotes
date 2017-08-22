

var state = {};

const quoteHolder = document.getElementById("quote");
const authorHolder = document.getElementById("author");

//todo: refactor: encapsulate
var to;

function setupDynamicLinks(quote) {
  state.authorPage = quote.author.page;
}

function processQuoteFromService(quote) {
  setNewQuote(JSON.parse(quote));
}

function setNewQuote(quote) {
  setStatus("");
  state.quote = quote.text;
  state.author = " - " + quote.author.name;
  state.qid = quote.id;
  setupDynamicLinks(quote);
  clearTimeout(to);
  let cursor = "<span class=\"cursor\"></span>";

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
      authorHolder.innerHTML = state.author + cursor;
    }, state.author, authorHolder);
  }, "> " + state.quote, quoteHolder);
}

function setStatus(status) {
  let statusHolder = document.getElementById("status");
  statusHolder.innerHTML = status;
}

function fallback() {
  console.warn("Quote service unreachable");
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
  const quoterService = "https://quotor.herokuapp.com/quote";
  //const quoterService = "http://localhost:5000/quote";
  if (window.location.hash){
    httpGetAsync(processQuoteFromService, quoterService + "?q=" + window.location.hash.slice(1));
  } else {
    httpGetAsync(processQuoteFromService, quoterService);
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
  let next = document.getElementById("menu-next");
  next.addEventListener("click", ()=>{
    loadQuote();
  });
  let tweet = document.getElementById("menu-tweet");
  tweet.addEventListener("click", ()=>{
    const maxLen = 85
    const post = state.quote.length > maxLen + 3 ? state.quote.slice(0,maxLen) + "..." : state.quote;
    const uri = encodeURIComponent("https://quotor.herokuapp.com/quote?q=" + state.qid);
    window.open("https://twitter.com/intent/tweet?text=" + post + " &url=" + uri + "&hashtags=DevQuotes" );
  });
  let author = document.getElementById("menu-author");
  author.addEventListener("click", ()=>{
    if(state.authorPage) {
      window.open(state.authorPage, "_blank");
    }
  });
}

function setupTipjar() {
  let btnClose = document.getElementById("btn-close-tipjar");
  btnClose.addEventListener("click", ()=>{
    hideTipJar();
  })
}

function clearQuote() {
  quoteHolder.innerHTML = "";
  authorHolder.innerHTML = "";
  clearTimeout(to);
}

function loadQuote() {
  clearQuote();
  setStatus("Loading...");
  updateQuote();
}

window.onload = function() {
  loadQuote();
  setupMenu();
  setupTipjar();
};
