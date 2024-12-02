import { MQTTService } from "./mqttService"; // Certifique-se de ter a classe MQTTService correta

// Identifique os elementos de controle dos atuadores
const relay1OnButton = document.getElementById('relay1-on');
const relay1OffButton = document.getElementById('relay1-off');
const relay2OnButton = document.getElementById('relay2-on');
const relay2OffButton = document.getElementById('relay2-off');
const relay3OnButton = document.getElementById('relay3-on');
const relay3OffButton = document.getElementById('relay3-off');

// Defina o tópico para publicar mensagens de controle
const controlTopic1 = 'sihs3/actuators/relay1';
const controlTopic2 = 'sihs3/actuators/relay2';
const controlTopic3 = 'sihs3/actuators/relay3';

// Função para conectar ao broker MQTT e publicar mensagens
const mqttClient = new MQTTService('ws://broker.hivemq.com:8000/mqtt', {
  onConnect: (message) => {
    console.log(message);
    // Conectar aos tópicos de controle (caso necessário)
  },
  onMessage: (topic, message) => {
    console.log(`Received message: ${message} from topic: ${topic}`);
    // Processar as mensagens, caso seja necessário.
  },
});

// Conecte-se ao MQTT broker
mqttClient.connect();

// Função para publicar mensagem ao clicar em um botão de ON
function controlRelay(topic, state) {
  const message = state ? 'ON' : 'OFF';
  mqttClient.publish(topic, message);
}

// Eventos dos botões de controle
relay1OnButton.addEventListener('click', () => controlRelay(controlTopic1, true));
relay1OffButton.addEventListener('click', () => controlRelay(controlTopic1, false));

relay2OnButton.addEventListener('click', () => controlRelay(controlTopic2, true));
relay2OffButton.addEventListener('click', () => controlRelay(controlTopic2, false));

relay3OnButton.addEventListener('click', () => controlRelay(controlTopic3, true));
relay3OffButton.addEventListener('click', () => controlRelay(controlTopic3, false));
