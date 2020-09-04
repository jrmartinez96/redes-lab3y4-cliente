### Para correr
```
npm install
npm start
```

### Links montados
Servidor (la red): https://lab3y4-redes-server.herokuapp.com/
Cliente (Nodo): https://lab3y4-redes-cliente.herokuapp.com/

### Repo de servidor (la red)
https://github.com/jrmartinez96/redes-lab3y4-server


### Protocolo utilizado
```
-------------------- RESPUESTAS DE SERVIDOR A CLIENTE (Lo que recibe el cliente) -------------------

- 'node-connect-complete' (cuando el nodo se conecta y resgistra correctamente en el servidor)
{
    id: "", // Id del nodo conectado
    nombre: "", // Nombre del nodo conectado
}

- 'receive-message' (cuando el nodo recibe un mensaje del servidor)
{
    idNodoOrigen: "", // Id del nodo origen que mando el mensaje
    idNodoDesde: clientId, // Id del nodo que esta enviando el mensaje
    idNodoDestinoFinal: "", // Id del nodo destino final
    mensaje: "", // Mensaje que se le quiere enviar
    extra: {} // Cualquier cosa que se desea pasar al receptor
}

- "error-msj" (cuando el servidor le manda un error al cliente)
{
    mensaje: ""
}

-------------------- RESPUESTAS DE CLIENTE A SERVIDOR (Lo que recibe el servidor) -------------------

- 'node-connect' (cuando un nodo se agrega a la red):
{
    nombre: "" // Nombre del nodo
}

- 'peso-vecino' (cuando se le asigna un peso entre vecinos)
{
    idNodo1: "", // Id del nodo 1
    idNodo2: "", // Id del nodo 2
    peso: 0, // Peso entre estos nodos
}

- 'send-message' (cuando se quiere enviar un mensaje a otro nodo)
{
    idNodoDestino: "", // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
    idNodoOrigen: "", // Id del nodo origen
    idNodoDestinoFinal: "", // Id del nodo destino final
    mensaje: "", // Mensaje que se le quiere enviar
    extra: {} // Cualquier cosa que se desea pasar al receptor
}
```