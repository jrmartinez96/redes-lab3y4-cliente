/**
 * @param {any} socket - El socket del cliente
 * @param {Array} nodos - Nodos y sus vecinos actuales
 * @param {string} id - Id del nodo actual
 * @param {string} idEnviar - Id del nodo al que se le desea enviar el mensaje
 * @param {string} idOrigen - Id del nodo origen
 * @param {string} mensaje - El mensaje que se desea enviar
 * @param {string} onSendMessage - Funcion que se llama al enviar el mensaje
 */
export const lsr = (socket, nodos, id, idEnviar, idOrigen, mensaje, onSendMessage) => {
    // Obtener nombre de los nodos
    let nombreOrigen = "";
    let nombreDestinoFinal = ""
    nodos.forEach(nodo => {
        if (nodo.id === idOrigen) {
            nombreOrigen = nodo.nombre
        }
        if (nodo.id === idEnviar) {
            nombreDestinoFinal = nodo.nombre
        }
    })




    // TODO: Implementar algoritmo para decidir a quien enviarle el mensaje

    socket.emit('send-message', {
        idNodoDestino: idEnviar, // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
        idNodoOrigen: idOrigen, // Id del nodo origen
        idNodoDestinoFinal: idEnviar, // Id del nodo destino final
        mensaje: mensaje, // Mensaje que se le quiere enviar
    })


    // Despues de mandar el mensaje
    onSendMessage(`Se envió el mensaje de origen ${nombreOrigen} hacia ${nombreDestinoFinal}`);
}

/**
 * parametro nodos viene en una lista con el siguiente formato:
[
    {
        id: "", // Id del nodo
        nombre: "", // Nombre del nodo
        vecinos: [
            {
                nodo: {
                    id: "", // Id del nodo vecino
                    nombre: "" // Nombre del nodo vecino
                },
                peso: 0 // Peso que tiene con el nodo vecino
            }
        ]
    },
    {
        id: "", // Id del nodo
        nombre: "", // Nombre del nodo
        vecinos: [
            {
                nodo: {
                    id: "", // Id del nodo vecino
                    nombre: "" // Nombre del nodo vecino
                },
                peso: 0 // Peso que tiene con el nodo vecino
            }
        ]
    }
]
 */