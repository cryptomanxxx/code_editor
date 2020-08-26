// counts the number of divs created
function increment() {
increment.n = increment.n || 0;
return ++increment.n;
}

function x() {
var cc = increment() ;
var text = document.createElement("div");
text.setAttribute("id", "text" + cc);
text.setAttribute("class", "text");
console.log("text" + cc);
text.setAttribute("contenteditable", "true");
text.innerHTML = "Text-" + cc;
text.onclick = function() {if(text.innerHTML=="Text-" + cc){text.innerHTML="";}};
document.getElementById('table').appendChild(text);
text.focus();

var code = document.createElement("div");
code.setAttribute("id", "code" + cc);
code.setAttribute("class", "code");
console.log("code" + cc);
code.setAttribute("contenteditable", "true");
code.innerHTML = "Code-" + cc;
code.onclick = function() {if(code.innerHTML=="Code-" + cc){code.innerHTML="";}};
code.setAttribute("onkeypress", "parse(event, this)");
document.getElementById('table').appendChild(code);

var output = document.createElement("div");
output.setAttribute("id", "output" + cc);
output.setAttribute("class", "output");
console.log("output" + cc);
output.setAttribute("contenteditable", "false");
output.innerHTML = "Output-" + cc;
document.getElementById('table').appendChild(output);
}
  
function parse(e1, e2) {
if (e1.keyCode == 13) { // keycode for enter 
event.preventDefault();
inId = e2.id;
outId = "output" + inId.substring(4);
console.log("inId = " + inId);
console.log("outId = "+ outId);
var inz = document.getElementById(inId).innerText;
var result = eval(inz);
document.getElementById(outId).innerHTML = result;
}
}
