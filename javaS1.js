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
  output.setAttribute("contenteditable", "true");
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

            console.log("Command entered:", inz); // Log the command entered

            // Evaluate the command
            if (inz.includes('forecastTimeSeries')) {
                forecastTimeSeries(inputData, outputData, inputForPrediction, function(result, error) {
                    if (error) {
                        console.error("An error occurred:", error);
                        document.getElementById(outId).innerHTML = error;
                    } else {
                        console.log("Evaluated result:", result); // Log the evaluated result
                        document.getElementById(outId).innerHTML = result;
                    }
                });
            } else if (inz.includes('plot')) {
                var result = eval(inz);
                console.log("Evaluated result:", result); // Log the evaluated result
                if (result !== undefined) {
                    plot(result);
                } else {
                    console.error("Error: Plot data is undefined.");
                }
            } else {
                var result = eval(inz);
                console.log("Evaluated result:", result); // Log the evaluated result
                if (result instanceof HTMLElement) {
                    document.getElementById(outId).innerHTML = result.outerHTML;
                } else {
                    document.getElementById(outId).innerHTML = result;
                }
            }
        } catch (err) {
            console.log("Error:", err);
            console.log("Error in output:", outId);
            document.getElementById(outId).innerHTML = err;
        }
    }
}

function matrix(z){
if(z===undefined || z===null){
console.error("Error: Input array is undefined or null.");
return; // exit the function early
}
  var table = document.createElement('table');
  table.setAttribute("class", "matrix");
  var tableBody = document.createElement('tbody');

  if (z[0].length == undefined) { // 1D array 
    var row = document.createElement("tr");
    tableBody.appendChild(row);
    for (var i = 0; i < z.length; i++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(z[i]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
  } else { // 2D array 
    z.forEach(function (rowData) {
      var row = document.createElement('tr');
      rowData.forEach(function (cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
  }

  table.appendChild(tableBody);
  return table;
}


// Define the forecastTimeSeries function
function forecastTimeSeries(inputData, outputData, inputForPrediction, callback) {
    // Check if inputData, outputData, and inputForPrediction are provided
    if (!inputData || !outputData || !inputForPrediction) {
        console.error("Input data, output data, or input for prediction is missing.");
        return;
    }

    // Convert input and output data to tensors
    const inputTensor = tf.tensor2d(inputData);
    const outputTensor = tf.tensor2d(outputData);
    const inputTensorForPrediction = tf.tensor2d([inputForPrediction]);

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [inputData[0].length], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    // Compile the model
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Train the model asynchronously
    model.fit(inputTensor, outputTensor, { epochs: 100 })
        .then(() => {
            // Make prediction asynchronously
            const outputTensorForPrediction = model.predict(inputTensorForPrediction);
            const output = outputTensorForPrediction.dataSync()[0];
            console.log('Forecast:', output);
            callback(output);
        })
        .catch((error) => {
            console.error("An error occurred during training or prediction:", error);
            callback(undefined, error);
        });
}

function plot(data) {
  if (!data || !Array.isArray(data)) {
    console.error("Error: Data format is invalid.");
    return;
  }

  try {
    document.getElementById(outId).innerHTML = "";

    // Initialize arrays to store parsed data
    const xx = [];
    const yy = [];
    const colors = ['green', 'blue', 'red', 'orange', 'purple']; // Define an array of colors
    var plotData = []; // Define plotData array

    // Parse each data object
    data.forEach((series, index) => {
      // Extract dates and closing prices from the series
      const dates = series.dates;
      const closingPrices = series.closingPrices;

      // Populate xx with index and yy with closing prices array
      yy.push(closingPrices);

      // Generate dummy index for xx
      xx.push(Array(closingPrices.length).fill().map((_, i) => i));

      // Assign color to the series
      const color = colors[index % colors.length]; // Cycle through colors array
      const seriesData = {
        x: xx[index],
        y: yy[index],
        type: 'scatter',
        line: { color: color, width: 2 },
        name: 'Series ' + (index + 1) // Optional: Assign a name for each series
      };
      plotData.push(seriesData);
    });

    var layout = {
      width: 950,
      height: 290,
      paper_bgcolor: 'lightblue',
      plot_bgcolor: 'lightblue',
      margin: { l: 60, b: 90, r: 20, t: 20 },
      xaxis: {
        title: 'x-axis',
        titlefont: { family: 'Courier New, monospace', size: 14, color: 'black' },
        tickmode: "auto",
        tickangle: 90,
        tickfont: { size: 10, color: 'black' },
        showgrid: true,
        gridcolor: 'black',
        linecolor: 'black'
      },
      yaxis: {
        title: 'y-axis',
        titlefont: { family: 'Courier New, monospace', size: 14, color: 'black' },
        tickfont: { size: 10, color: 'black' },
        showgrid: true,
        gridcolor: 'black',
        linecolor: 'black'
      }
    };

    Plotly.newPlot(outId, plotData, layout, { displayModeBar: false, staticPlot: true });
  } catch (error) {
    console.error("Error occurred while plotting:", error);
  }
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
    async: false, // Making the call synchronous
    dataType: "json",
    success: function(data) {
      result = data;
    },
    error: function(xhr, status, error) {
      console.error("Error fetching crypto data:", error);
    }
  });

  var y = result.Data;
  var D1 = [];
  var D2 = [];

  for (var i = 0; i < y.length; i++) {
    D1.push(time(y[i].time));
    D2.push(y[i].close);
  }
  return [D1,D2];
}

// historial crypto currency price data for specified ticker symbols
function crypto2(...tickers) {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var baseUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=";
  var dataArray = [];

  tickers.forEach(function(ticker, index) {
    var url = baseUrl + ticker + "&tsym=USD&limit=1000&api_key=" + ApiKey;
    $.ajax({
      url: url,
      async: false, // Making the call synchronous
      dataType: "json",
      success: function(data) {
        var dates = [];
        var closingPrices = [];
        data.Data.forEach(function(item) {
          dates.push(time(item.time));
          closingPrices.push(item.close);
        });
        var cryptoData = { ticker: ticker, dates: dates, closingPrices: closingPrices };
        dataArray.push(cryptoData);
      },
      error: function(xhr, status, error) {
        console.error("Error fetching crypto data for " + ticker + ":", error);
      }
    });
  });

  // Format the dataArray into a string
  var formattedData = dataArray.map(function(item) {
    return "Ticker: " + item.ticker + ", Dates: " + item.dates.join(", ") + ", Closing Prices: " + item.closingPrices.join(", ");
  }).join("\n");

  // Return the formatted data string
  return formattedData;
}

// function to get closing prices for multiple crypto currency tickers
function crypto3(...tickers) {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var baseUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=";
  var dataArray = [];

  tickers.forEach(function(ticker, index) {
    var url = baseUrl + ticker + "&tsym=USD&limit=1000&api_key=" + ApiKey;
    $.ajax({
      url: url,
      async: false, // Making the call synchronous
      dataType: "json",
      success: function(data) {
        var dates = [];
        var closingPrices = [];
        data.Data.forEach(function(item) {
          dates.push(time(item.time));
          closingPrices.push(item.close);
        });
        var cryptoData = { ticker: ticker, dates: dates, closingPrices: closingPrices };
        dataArray.push(cryptoData);
      },
      error: function(xhr, status, error) {
        console.error("Error fetching crypto data for " + ticker + ":", error);
      }
    });
  });
    
  console.log("DataArray = ", dataArray);
  // Return the dataArray containing the formatted data
  return dataArray;
}


function crypto4(tickers) {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var baseUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=";
  var dataArray = [];

  var tickersArray = tickers.split(","); // Split the comma-separated string into an array of ticker symbols

  tickersArray.forEach(function(ticker, index) {
    var url = baseUrl + ticker + "&tsym=USD&limit=1000&api_key=" + ApiKey;
    $.ajax({
      url: url,
      async: false, // Making the call synchronous
      dataType: "json",
      success: function(data) {
        var dates = [];
        var closingPrices = [];
        data.Data.forEach(function(item) {
          dates.push(time(item.time));
          closingPrices.push(item.close);
        });
        var cryptoData = { ticker: ticker, dates: dates, closingPrices: closingPrices };
        dataArray.push(cryptoData);
      },
      error: function(xhr, status, error) {
        console.error("Error fetching crypto data for " + ticker + ":", error);
      }
    });
  });

  return dataArray;
}


function ticker() {
  var ApiKey = "ddd85b386e1a7c889e468a4933f75f22f52b0755b747bdb637ab39c88a3bc19b";
  var urlA = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD&api_key=" + ApiKey;
  var result = null;

  $.ajax({
    url: urlA,
    async: false,
    dataType: "json",
    success: function (data) { result = data; }
  });

  var y = result.Data;
  var A = [];
  for (var i = 0; i < y.length; i++) {
    A.push(y[i].CoinInfo.Name);
  }
  return A.join(","); // Join the ticker symbols into a single string
}


function formatCryptoData(data) {
    var formattedData = [];

    // Add headers
    formattedData.push(["Dates"]);

    // Extract unique tickers
    var tickers = data.map(crypto => crypto.ticker);
    var uniqueTickers = [...new Set(tickers)];

    // Add closing prices for each ticker
    uniqueTickers.forEach(ticker => {
        formattedData[0].push(ticker + " Closing Price");
    });

    // Combine closing prices for all tickers
    for (var i = 0; i < data[0].dates.length; i++) {
        var rowData = [data[0].dates[i]];

        uniqueTickers.forEach(ticker => {
            var tickerData = data.find(crypto => crypto.ticker === ticker);
            rowData.push(tickerData ? tickerData.closingPrices[i] : null);
        });

        formattedData.push(rowData);
    }

    return formattedData;
}

