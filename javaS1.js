// counts the number of divs created
function increment() {
  increment.n = increment.n || 0;
  return ++increment.n;
}

// output has been assigned previously
function toggleOrCheckIfFunctionCall(newValue) {
  if (newValue != undefined || newValue != null) {
    isFunctionCall = newValue || false;
  }
  return isFunctionCall;
}

function input() {
  cc = increment();
  console.log("cc = " + cc);
  var input = document.createElement("div");
  input.setAttribute("id", "input" + cc);
  input.setAttribute("class", "input");
  console.log("input" + cc);
  input.setAttribute("contenteditable", "true");
  input.setAttribute("onkeypress", "parse(event, this)");
  document.getElementById('table').appendChild(input);
  input.focus();
}

function output() {
  var output = document.createElement("div");
  output.setAttribute("id", "output" + cc);
  output.setAttribute("class", "output");
  console.log("output" + cc);
  output.setAttribute("contenteditable", "false");
  document.getElementById('table').appendChild(output);
}

function parse(e1, e2) {
  if (e1.keyCode == 13 && !e1.shiftKey) {
    try {
      event.preventDefault();
      toggleOrCheckIfFunctionCall(false);
      inId = e2.id;
      var w = parseInt(inId.substring(5), 10) + 1
      outId = "output" + inId.substring(5);
      var inId2 = "input" + w;
      if (!document.getElementById(outId)) { output(); input(); } else { document.getElementById(inId2).focus(); };
      var inz = document.getElementById(inId).innerText;
      document.getElementById(outId).innerHTML = eval(inz);
    }
    catch (err) {
      console.log("err = " + err);
      console.log("error = " + outId);
      document.getElementById(outId).innerHTML = err;
    }
  }
}

// ticker symbols for the 100 crypto currencies with the largest market cap
function ticker() {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var urlA = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD&api_key=" + ApiKey;

  var result = null;

  $.ajax({
    url: urlA,
    async: false,   // makes a synchronous data call to cryptocompare's api
    dataType: "json",
    success: function (data) { result = data; }
  });

  var y = result.Data;
  var A = [];
  for (var i = 0; i < y.length; i++) {
    A.push([y[i].CoinInfo.Name]);
  }
  // console.log(A);
  return A;
}

// converts a unix timestamp to a date string  
function time(w) {
  var MyDate = new Date(w * 1000);
  var MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
  return JSON.stringify(MyDateString);
}


// historial crypto currency price data for a specified ticker symbol string
function crypto1(t) {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var urlA = "https://min-api.cryptocompare.com/data/histoday?fsym=" + t + "&tsym=USD&limit=1000&api_key=" + ApiKey;

  var result = null;

  $.ajax({
    url: urlA,
    async: false,   // makes a synchrously data call to cryptocompare
    dataType: "json",
    success: function (data) { result = data; }
  });

  var y = result.Data;
  var D1 = [];
  var D2 = [];

  for (var i = 0; i < y.length; i++) {
    D1.push(time(y[i].time));
    D2.push(y[i].close);
  }
  // console.log(D2);
  return [D1, D2];
}



// fucked up
// crypto price data for multiple crypto currencies
function crypto2() {
  var x = ticker().slice(0, 50);
  console.log("x = " + x);
  console.log("ticker length = " + x.length);

  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var urlA = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + x + "&tsyms=USD&limit=300&api_key=" + ApiKey;

  // var urlA = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + x + "&tsyms=USD&limit=300";
  // var result = null;

  $.ajax({
    url: urlA,
    async: false,   // makes a synchrously data call to cryptocompare
    dataType: "json",
    success: function (data) { result = data; }
  });

  var y = result;
  console.log("y = " + JSON.stringify(y));
  console.log("y.BTC.USD = " + y.BTC.USD);
  console.log("rght = " + x[0]);

  var D1 = [];
  for (var i = 0; i < 40; i++) {
    D1.push(y.x[i].USD);
  }
  console.log("data = " + D1);
  return D1;
}


// crypto price data for multiple crypto currencies
function crypto3() {
  var x = ticker().slice(0, 60);
  console.log("x = " + x);
  console.log("ticker length = " + x.length);

  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var urlA = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + x + "&tsyms=USD&api_key=" + ApiKey;
  var result = null;

  $.ajax({
    url: urlA,
    async: false, // makes a synchrously data call to cryptocompare
    dataType: "json",
    success: function (data) {
      result = data;
    }
  });

  console.log("result = " + JSON.stringify(result));

  const D1 = Object.keys(result).map(key => result[key]?.["USD"])
  return matrix([x, D1]);
}


// plots a given data array z 
function plot1(z) {
  document.getElementById(outId).innerHTML = "";
  console.log("z[0].length = " + z[0].length);

  if (z[0].length == undefined) { // if only one row with price
    var yy = z;
    var xx = [];
    for (var i = 0; i <= yy.length; i++) { xx[i] = JSON.stringify(i); }
  } else {
    var xx = z[0]; // first row date
    var yy = z[1]; // second row price      
  }
  var data = [{
    x: xx,
    y: yy,
    type: 'scatter',
    line: { color: 'green', width: 2 }
  }];
  var layout =
  {
    width: 950,
    height: 290,
    paper_bgcolor: 'lightblue',
    plot_bgcolor: 'lightblue',
    margin: { l: 60, b: 90, r: 20, t: 20 },
    xaxis: { title: 'x-axis', titlefont: { family: 'Courier New, monospace', size: 14, color: 'black' } },
    xaxis: { tickmode: "auto", tickangle: 45 },
    yaxis: { title: 'y-axis', titlefont: { family: 'Courier New, monospace', size: 14, color: 'black' } },
    xaxis: { tickfont: { size: 10, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' },
    yaxis: { tickfont: { size: 10, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' }
  };
  toggleOrCheckIfFunctionCall(true);
  Plotly.newPlot(outId, data, layout, { displayModeBar: false, staticPlot: true });
}

// plots a given data array z 
function plot2(z) {
  document.getElementById(outId).innerHTML = "";
  var yy = z;
  var xx = [];
  for (var i = 0; i <= yy.length; i++) {
    xx[i] = JSON.stringify(i);
  }
  var data = [{
    x: xx,
    y: yy,
    type: 'scatter',
    line: { color: 'green', width: 2 }
  }];
  var layout =
  {
    width: 950,
    height: 300,
    paper_bgcolor: 'lightblue',
    plot_bgcolor: 'lightblue',
    margin: { l: 60, b: 60, r: 20, t: 20 },
    xaxis: { title: 'x-axis', titlefont: { family: 'Courier New, monospace', size: 18, color: 'black' } },
    yaxis: { title: 'y-axis', titlefont: { family: 'Courier New, monospace', size: 18, color: 'black' } },
    xaxis: { tickfont: { size: 12, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' },
    yaxis: { tickfont: { size: 12, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' }
  };
  toggleOrCheckIfFunctionCall(true);
  Plotly.newPlot(outId, data, layout, { displayModeBar: false, staticPlot: true });
}

// first difference of an array (r = return )
function r(a) {
  var r = [];
  for (i = 1; i < a.length; i++) {
    r.push(a[i] - a[i - 1]);
  }
  return r;
}

// percentage difference of an array ( rr = % return )
function rr(a) {
  var r = [];
  for (i = 1; i < a.length; i++) {
    r.push((a[i] - a[i - 1]) / a[i - 1]);
  }
  return r;
}

// an array with data from a to b
function seq(a, b) {
  var data = Array.from(Array(1), () => new Array(b - a + 1));
  // the benefit from creating array this way is a.length = number of rows and a[0].length = number of columns  
  for (var i = 0; i < data[0].length; i++) {
    data[0][i] = a + i;
  }
  return matrix(data);
}

// a random numbers between -1 and 1 with dimensions n1 and n2 and expected value e
function rand(n1, n2, e) {
  if (e == undefined) { e = 0; }
  if (n1 == undefined && n2 == undefined) { return Math.random() * 2 - 1; }
  var data = Array.from(Array(n1), () => new Array(n2));
  // benefit from creating array this way is a.length = number of rows and a[0].length = number of columns 
  for (var i = 0; i < n1; i++) {
    for (var j = 0; j < n2; j++) {
      data[i][j] = e + Math.random() * 2 - 1;
    }
  }
  return round(data, 10);
}

// rounds a number, a 1D or a 2D array array x to z decimal points
function round(x, z) {
  if (z == undefined) { z = 2; }
  console.log("type of = " + typeof (x));
  if (typeof (x) == "number") { x = x.toFixed(z) }
  else if (x[0].length == undefined) { // 1D array
    for (var i = 0; i < x.length; i++) {
      x[i] = parseFloat(x[i].toFixed(z));
    }
  } else
    for (var i = 0; i < x.length; i++) { // 2D array 
      for (var j = 0; j < x[0].length; j++) {
        x[i][j] = parseFloat(x[i][j].toFixed(z));
      }
    }
  return x;
}

// creates an array from the functions's parameters 
function array() {
  n = arguments.length;
  console.log("n = " + n);
  var data = Array.from(Array(1), () => new Array(n));
  // the benefit from creating array this way is a.length = number of rows and a[0].length = number of columns  
  for (var i = 0; i < n; i++) { data[0][i] = arguments[i]; }
  return matrix(data);
}

// an array with a random walk with expected value ex 
function rw(n, ex) {
  if (ex == undefined) { ex = 0; }
  var x = [];
  x[0] = 100;
  for (var i = 1; i < n; i++) {
    x[i] = ex + x[i - 1] + Math.random() * 2 - 1;
  }
  var xx = round(x, 2);
  console.log(xx);
  return xx;
}

// counts the number of elements b in a given array a
function count(a, b) {
  if (b == undefined) {
    var count = a.length;
  } else {
    var count = 0;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] == b)
        count++;
    }
  }
  return count;
}