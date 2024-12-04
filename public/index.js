// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
const temperatureHistoryDiv = document.getElementById("temperature-history");
const humidityHistoryDiv = document.getElementById("humidity-history");
const soilHistoryDiv = document.getElementById("soil-history");
const soilGardenHistoryDiv = document.getElementById("soil-garden-history");

const temperatureGaugeDiv = document.getElementById("temperature-gauge");
const humidityGaugeDiv = document.getElementById("humidity-gauge");
const soilGaugeDiv = document.getElementById("soil-gauge");
const soilGardenGaugeDiv = document.getElementById("soil-garden-gauge");

const historyCharts = [
  temperatureHistoryDiv,
  humidityHistoryDiv,
  soilHistoryDiv,
  soilGardenGaugeDiv
];

const gaugeCharts = [
  temperatureGaugeDiv,
  humidityGaugeDiv,
  soilGaugeDiv,
  soilGardenHistoryDiv
];

// History Data
var temperatureTrace = {
  x: [],
  y: [],
  name: "Temperature",
  mode: "lines+markers",
  type: "line",
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Humidity",
  mode: "lines+markers",
  type: "line",
};
var soilTrace = {
  x: [],
  y: [],
  name: "Soil",
  mode: "lines+markers",
  type: "line",
};
var soilGardenTrace = {
  x: [],
  y: [],
  name: "SoilGarden",
  mode: "lines+markers",
  type: "line",
};

var temperatureLayout = {
  autosize: true,
  title: {
    text: "Temperature",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var humidityLayout = {
  autosize: true,
  title: {
    text: "Humidity",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var soilLayout = {
  autosize: true,
  title: {
    text: "Soil",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var soilGardenLayout = {
  autosize: true,
  title: {
    text: "SoilGarden",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    temperatureHistoryDiv,
    [temperatureTrace],
    temperatureLayout,
    config
  );
  Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
  Plotly.newPlot(soilHistoryDiv, [soilTrace], soilLayout, config);
  Plotly.newPlot(soilGardenHistoryDiv, [soilGardenTrace], soilGardenLayout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Temperature" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var humidityData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Humidity" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var soilData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Soil" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var soilGardenData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "SoilGarden" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout);
Plotly.newPlot(humidityGaugeDiv, humidityData, layout);
Plotly.newPlot(soilGaugeDiv, soilData, layout);
Plotly.newPlot(soilGardenGaugeDiv, soilGardenData, layout);

// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];
// Soil
let newSoilXArray = [];
let newSoilYArray = [];

let newSoilGardenXArray = [];
let newSoilGardenYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let temperature = lastTemperature !== null ? lastTemperature : "-";
  let humidity = lastHumidity !== null ? lastHumidity : "-";
  let soil = jsonResponse.umidadeSolo
    ? Number(jsonResponse.umidadeSolo).toFixed(2)
    : 0;
  let soilGarden = jsonResponse.umidadeSoloJardim
  ? Number(jsonResponse.umidadeSoloJardim).toFixed(2)
  : 0;

  updateBoxes(temperature, humidity, soil, soilGarden);

  updateGauge(temperature, humidity, soil, soilGarden);

  // Update Temperature Line Chart
  updateCharts(
    temperatureHistoryDiv,
    newTempXArray,
    newTempYArray,
    temperature
  );
  // Update Humidity Line Chart
  updateCharts(
    humidityHistoryDiv,
    newHumidityXArray,
    newHumidityYArray,
    humidity
  );
  // Update Soil Line Chart
  updateCharts(
    soilHistoryDiv,
    newSoilXArray,
    newSoilYArray,
    soil
  );


  updateCharts(
    soilGardenHistoryDiv,
    newSoilGardenXArray,
    newSoilGardenYArray,
    soilGarden
  );
}

function updateBoxes(temperature, humidity, soil, soilGarden) {
  let temperatureDiv = document.getElementById("temperature");
  let humidityDiv = document.getElementById("humidity");
  let soilDiv = document.getElementById("soil");
  let soilGardenDiv = document.getElementById("soil-garden");

  temperatureDiv.innerHTML = temperature + " C";
  humidityDiv.innerHTML = humidity + " %";
  soilDiv.innerHTML = soil + " %";
  soilGardenDiv.innerHTML = soilGarden + " %";
}

function updateGauge(temperature, humidity, soil, soilGarden) {
  var temperature_update = {
    value: temperature,
  };
  var humidity_update = {
    value: humidity,
  };
  var soil_update = {
    value: soil,
  };
  var soil_garden_update = {
    value: soilGarden,
  };
  Plotly.update(temperatureGaugeDiv, temperature_update);
  Plotly.update(humidityGaugeDiv, humidity_update);
  Plotly.update(soilGaugeDiv, soil_update);
  Plotly.update(soilGardenGaugeDiv, soil_garden_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  const data_update = { x: [xArray], y: [yArray] };
  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}
/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}

let lastTemperature = null;
let lastHumidity = null;
let lastSoil = null;
let lastGardenSoil = null;

function onMessage(topic, message) {
  try {
    // Converte a mensagem para string e depois para JSON
    var stringResponse = message.toString();
    var messageResponse = JSON.parse(stringResponse);
    
    // Cria um objeto para simular a estrutura anterior
    var sensorData = {};

    // Verifica o tópico e adiciona os dados ao objeto `sensorData`
    if (topic === "sihs3/sensor/umidade") {
      lastHumidity = Number(messageResponse.valor).toFixed(2);
    } else if (topic === "sihs3/sensor/temperatura") {
      lastTemperature = Number(messageResponse.valor).toFixed(2);
    } else if (topic === "sihs3/sensor/umidadeSolo") {
      lastSoil = Number(messageResponse.valor).toFixed(2);
    } else if (topic === "sihs3/jardim/sensor/umidadeSolo") {
      lastGardenSoil = Number(messageResponse.valor).toFixed(2);
    }
    console.log("AAA", messageResponse)
    // Agora, com os dados organizados no objeto, chamamos a função updateSensorReadings
    updateSensorReadings({
      temperatura: lastTemperature,
      umidade: lastHumidity,
      umidadeSolo: lastSoil,
      umidadeSoloJardim: lastGardenSoil
    });
    sendNotifications(lastTemperature)

  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
}

function sendNotifications(temperature) {
  if (temperature > 40) {
    // Enviar a solicitação de notificação para o back-end
    fetch('/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperatura: temperature })
    })
    .then(response => response.json())
    .then(data => console.log('Notificação enviada com sucesso', data))
    .catch(error => console.error('Erro ao enviar notificação:', error));
  }
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopics);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}

function initializeMQTTConnection(mqttServer, mqttTopics) {
  console.log(`Initializing connection to :: ${mqttServer}`);

  const fnCallbacks = { onConnect, onMessage, onError, onClose };

  const mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  // Subscribing to all provided topics
  mqttTopics.forEach((topic) => {
    console.log(`Subscribing to topic: ${topic}`);
    mqttService.subscribe(topic);
  });
}
