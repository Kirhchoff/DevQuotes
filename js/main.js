

var state = {};

const quoteHolder = document.getElementById("quote");
const authorHolder = document.getElementById("author");

//todo: refactor: encapsulate
var to;

function processQuoteFromService(quote) {
  setNewQuote(JSON.parse(quote));
}

function setNewQuote(quote) {
  setStatus("");
  state.quote = quote.text;
  state.author = quote.author;
  state.qid = quote.id;
  state.source = {type: quote.source.type, url: quote.source.url, name: quote.source.name, img: quote.source.img};
  state.additionalInfo = quote.additionalInfo;
  window.location.hash = state.qid;
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
    let authorStr = " - " + state.author.name;
    printCharByChar(()=>{
      authorHolder.innerHTML = authorStr + cursor;
    }, authorStr, authorHolder);
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

function showAbout(){
  fillupAbout();
  let tipJar = document.getElementById("about-quote");
  tipJar.style.display = "block";
}

function hideAbout(){
  let tipJar = document.getElementById("about-quote");
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
  let about = document.getElementById("menu-about");
  about.addEventListener("click", ()=>{
    showAbout();
  });
  let quoteText = document.getElementById("quote");
  quote.addEventListener("click", ()=>{
    showAbout();
  });
  let suggest = document.getElementById("menu-suggest");
  suggest.addEventListener("click", ()=>{
    showNewQuoteForm();
  });
  let next = document.getElementById("menu-next");
  next.addEventListener("click", ()=>{
    window.location.hash = "";
    loadQuote();
  });
  let tweet = document.getElementById("menu-tweet");
  tweet.addEventListener("click", ()=>{
    const maxLen = 85
    const post = state.quote.length > maxLen + 3 ? state.quote.slice(0,maxLen) + "..." : state.quote;
    const uri = encodeURIComponent(window.location.href + "#" + state.qid);
    window.open("https://twitter.com/intent/tweet?text=" + post + "&url=" + uri + "&hashtags=DevQuotes" );
  });
  let author = document.getElementById("menu-author");
  author.addEventListener("click", ()=>{
    if(state.authorPage) {
      window.open(state.authorPage, "_blank");
    }
  });
}

function setupTipjar() {
  let btnCloseList = document.getElementsByClassName("btn-close-tipjar");
  for(let i = 0; i < btnCloseList.length; i++){
    btnCloseList[i].addEventListener("click", ()=>{
      hideTipJar();
    });
  }
}

function setupAbout() {
  let btnCloseList = document.getElementsByClassName("btn-close-about");
  for(let i = 0; i < btnCloseList.length; i++){
    btnCloseList[i].addEventListener("click", ()=>{
      hideAbout();
    });
  }
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

function setupDialogs() {
  setupTipjar();
  setupAbout();
}

function fillupAbout() {
  let source = document.getElementById('about-source');
  let sourceType = document.getElementById('about-source-type');
  let author = document.getElementById('about-author');
  sourceType.innerHTML = '<a href="' + state.source.url + '">' + state.source.type + "</a>";
  author.innerHTML = '<a href="' + state.author.page + '">' + state.author.name + "</a>";
  source.innerHTML = '<a href="' + state.source.url + '">' + state.source.name + "</a>";
  let image = document.getElementById("about-img");
  if (state.source.img != undefined && state.source.img.length > 3) {
    let imageLink = document.getElementById("about-img-link");
    image.style.display = "block";
    image.src = state.source.img;
    image.alt = state.source.name;
    imageLink.href = state.source.url;
  } else {
    image.style.display = "none";
  }
  if (state.additionalInfo != undefined) {
    let additional = document.getElementById('about-additional');
    additional.innerHTML = state.additionalInfo;
  }
}

window.onload = function() {
  loadQuote();
  setupMenu();
  setupDialogs();
};
