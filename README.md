## SIHS
Project made for *academic purposes only*.

## How to run
You should have Node.js installed in your workstation 

Clone the repository  
``` git clone https://github.com/JupiterIvy/garden-dashboard.git ```  
``` cd garden-dashboard ``` 

Rename the .env.local to .env  
``` mv .env.local .env ```  

Edit the .env and set the MQTT broker URL that you are using  
```
NAME=SIHS
DASHBOARD_TITLE=MQTT DASHBOARD
MQTT_BROKER=ws://broker.hivemq.com:8000/mqtt
MQTT_TOPICS=sihs3/sensor/umidade,sihs3/sensor/temperatura,sihs3/sensor/umidadeSolo
```  

Install the dependencies and run the project
``` npm install && npm run dev ```
