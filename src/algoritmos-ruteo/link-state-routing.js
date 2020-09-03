/**
 * @param {any} socket - El socket del cliente
 * @param {Array} nodos - Nodos y sus vecinos actuales
 * @param {string} id - Id del nodo actual
 * @param {string} idEnviar - Id del nodo al que se le desea enviar el mensaje
 * @param {string} idOrigen - Id del nodo origen
 * @param {string} mensaje - El mensaje que se desea enviar
 * @param {any} extra - Data extra que manda el emisor, si no existe se debe colocar null
 */

 
export const lsr = (socket, nodos, id, idEnviar, idOrigen, mensaje, onSendMessage, extra) => {
    extra = extra || null;

    // ---------------- Obtener info de los nodos
    let currentNodo = {};
    let nombreOrigen = "";
    let nombreDestinoFinal = ""

    nodos.forEach(nodo => {
        if (nodo.id === id) {
            currentNodo = nodo;
        }
        if (nodo.id === idOrigen) {
            nombreOrigen = nodo.nombre
        }
        if (nodo.id === idEnviar) {
            nombreDestinoFinal = nodo.nombre
        }
    })

    // ---------------- Implementacion de algoritmo
    if (extra === null) { // Si el nodo actual es el nodo origen
        // Enviar mensaje a todos los nodos vecinos del nodo actual
        let canSend = false;

        currentNodo.vecinos.forEach(vecino => {
            canSend = true;
            socket.emit('send-message', {
                idNodoDestino: vecino.nodo.id, // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
                idNodoOrigen: id, // Id del nodo origen
                idNodoDestinoFinal: idEnviar, // Id del nodo destino final
                mensaje: mensaje, // Mensaje que se le quiere enviar
                extra: {
                    algoritmo: 'link-state-routing',
                    saltosRecorridos: 1,
                    distancia: parseInt(vecino.peso),
                    nodosUsados: [{id: currentNodo.id, nombre: currentNodo.nombre}]
                }
            });
            onSendMessage(`Utilizando LSR se envió el mensaje de origen ${currentNodo.nombre} hacia ${vecino.nodo.nombre} que tiene destino final ${nombreDestinoFinal}.`);
        })

        if (!canSend) {
            onSendMessage('No existen vecino al que se le pueda enviar el mensaje.')
        }
    } else {
        if (extra.saltosRecorridos && extra.distancia && extra.nodosUsados) {
            let idsNodosRecorridos = extra.nodosUsados.map(nodoUsado => nodoUsado.id);
            let canSend = false;

            currentNodo.vecinos.forEach(vecino => {
                if (!idsNodosRecorridos.includes(vecino.nodo.id)) {
                    canSend = true;
                    socket.emit('send-message', {
                        idNodoDestino: vecino.nodo.id, // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
                        idNodoOrigen: idOrigen, // Id del nodo origen
                        idNodoDestinoFinal: idEnviar, // Id del nodo destino final
                        mensaje: mensaje, // Mensaje que se le quiere enviar
                        extra: {
                            algoritmo: 'link-state-routing',
                            saltosRecorridos: parseInt(extra.saltosRecorridos) + 1,
                            distancia: parseInt(extra.distancia) + parseInt(vecino.peso),
                            nodosUsados: [...extra.nodosUsados, {id: currentNodo.id, nombre: currentNodo.nombre}]
                        }
                    });
                    onSendMessage(`Utilizando LSR se envió el mensaje de origen ${nombreOrigen} hacia ${vecino.nodo.nombre} que tiene destino final ${nombreDestinoFinal}.`);
                }
            });

            if (!canSend) {
                onSendMessage('No existen vecino al que se le pueda enviar el mensaje.')
            }
        } else {
            onSendMessage('No se cuenta con la información necesaria para enviar el mensaje utilizando LSR.')
        }
    }
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
