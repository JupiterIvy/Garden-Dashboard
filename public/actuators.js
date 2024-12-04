import { MQTTService } from "./mqttService"; // Certifique-se de ter a classe MQTTService correta

// Defina os tópicos para publicar mensagens de controle
const controlTopic1 = 'sihs3/atuador/umidadeSolo';
const controlTopic2 = 'sihs3/atuador/umidade';
const controlTopic3 = 'sihs3/atuador/temperatura';

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

// Função para publicar mensagem ao clicar no toggle
function controlRelay(topic, state) {
  const message = state ? 'ON' : 'OFF';
  mqttClient.publish(topic, message);
}

// Lógica para capturar os eventos de mudança nos toggles
document.addEventListener("DOMContentLoaded", () => {
  const actuators = [
    { id: "relay1-toggle", topic: controlTopic1 },
    { id: "relay2-toggle", topic: controlTopic2 },
    { id: "relay3-toggle", topic: controlTopic3 },
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
