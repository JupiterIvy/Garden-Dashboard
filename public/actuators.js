import { MQTTService } from "./mqttService.js"; // Certifique-se de ter a classe MQTTService correta

const mqttStatus = document.querySelector(".status");
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
// Defina os tópicos para publicar mensagens de controle
const controlTopic1 = 'sihs3/atuador/umidadeSolo';
const controlTopic2 = 'sihs3/atuador/umidade';
const controlTopic3 = 'sihs3/atuador/temperatura';
const controlTopic4 = 'sihs3/jardim/atuador/umidadeSolo';

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
});
// Função para conectar ao broker MQTT e publicar mensagens
let mqttClient;  // Variável global para o cliente MQTT

// Inicializa a conexão com o MQTT ao carregar a página
window.addEventListener("load", () => {
  mqttClient = new MQTTService('ws://broker.hivemq.com:8000/mqtt', {
    onConnect: (message) => {
      console.log("Conectado:", message);
      mqttStatus.textContent = "Connected";
      // Subscribir aos tópicos de controle (caso necessário)
      mqttClient.subscribe(controlTopic1);
      mqttClient.subscribe(controlTopic2);
      mqttClient.subscribe(controlTopic3);
      mqttClient.subscribe(controlTopic4);
    },
    onMessage: (topic, message) => {
      console.log(`Recebido: ${message} do tópico: ${topic}`);
      // Processar mensagens, por exemplo, atualizar os boxes de sensores
      processSensorData(topic, message);
      // Sincronizar o estado dos botões com o Wokwi
      syncButtonState(topic, message);
    },
    onError: (error) => {
      console.log(`Error encountered :: ${error}`);
      mqttStatus.textContent = "Error";
    },
  });

  // Conectar ao broker MQTT
  mqttClient.connect();
});

// Função para publicar mensagem ao clicar no toggle
function controlRelay(topic, state) {
  const message = state ? 'ON' : 'OFF';
  mqttClient.publish(topic, message);
}

// Função para processar dados dos sensores e atualizar os boxes
function processSensorData(topic, message) {
  try {
    const data = JSON.parse(message.toString());

    // Exemplo de como atualizar os boxes com os dados recebidos
    if (topic === 'sihs3/sensor/umidade') {
      document.getElementById("humidity").textContent = `${data.valor} %`;
    } else if (topic === 'sihs3/sensor/temperatura') {
      document.getElementById("temperature").textContent = `${data.valor} °C`;
    } else if (topic === 'sihs3/sensor/umidadeSolo') {
      document.getElementById("soil").textContent = `${data.valor} %`;
    } else if (topic === 'sihs3/jardim/sensor/umidadeSolo') {
      document.getElementById("soil-garden").textContent = `${data.valor} %`;
    }
  } catch (error) {
    console.error("Erro ao processar dados do sensor:", error);
  }
}

// Função para sincronizar o estado dos botões com o Wokwi
function syncButtonState(topic, message) {
  const data = JSON.parse(message.toString());

  // Atualize o estado dos botões de controle baseados na condição do Wokwi
  if (topic === controlTopic1) {
    const toggle = document.getElementById("relay1-toggle");
    console.log("AAAA", toggle)
    if (toggle) {
      toggle.checked = data.valor === "ON";  // Altere o estado do botão conforme a condição no Wokwi
    }
  } else if (topic === controlTopic2) {
    const toggle = document.getElementById("relay2-toggle");
    if (toggle) {
      toggle.checked = data.valor === "ON";
    }
  } else if (topic === controlTopic3) {
    const toggle = document.getElementById("relay3-toggle");
    if (toggle) {
      toggle.checked = data.valor === "ON";
    }
  }
  else if (topic === controlTopic4) {
    const toggle = document.getElementById("relay4-toggle");
    if (toggle) {
      toggle.checked = data.valor === "ON";
    }
  }
}

// Lógica para capturar os eventos de mudança nos toggles
document.addEventListener("DOMContentLoaded", () => {
  const actuators = [
    { id: "relay1-toggle", topic: controlTopic1 },
    { id: "relay2-toggle", topic: controlTopic2 },
    { id: "relay3-toggle", topic: controlTopic3 },
    { id: "relay4-toggle", topic: controlTopic4 },
  ];

  actuators.forEach((actuator) => {
    const toggle = document.getElementById(actuator.id);
    toggle.addEventListener("change", (event) => {
      const state = event.target.checked ? 'ON' : 'OFF';
      console.log(`${actuator.id} is turned ${state}`);
      controlRelay(actuator.topic, event.target.checked); // Publica a mensagem MQTT
    });
  });
});
