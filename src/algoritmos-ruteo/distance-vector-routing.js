/**
 * @param {any} socket - El socket del cliente
 * @param {Array} nodos - Nodos y sus vecinos actuales
 * @param {string} id - Id del nodo actual
 * @param {string} idEnviar - Id del nodo al que se le desea enviar el mensaje
 * @param {string} idOrigen - Id del nodo origen
 * @param {string} mensaje - El mensaje que se desea enviar
 * @param {any} extra - Data extra que manda el emisor, si no existe se debe colocar null
 */
export const dvr = (socket, nodos, id, idEnviar, idOrigen, mensaje, onSendMessage, extra) => {
    extra = extra || null;

    let aristas = extra.aristas;
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

    let distances = {}; //LISTA QUE GUARDA LAS DISTANCIAS ENTRE LOS PARENTS.
    let parents = {}; // LISTA QUE ALMACENA LOS ID DE LOS NODOS DE LA RUTA MAS CORTA.
    let c;

    // TODO: Implementar algoritmo para decidir a quien enviarle el mensaje
    if (extra.done === false){


            for (let i = 0; i < nodos.length; i += 1) { //EN ESTE CICLO SE INICIALIZAN LAS LISTAS ANTERIORMENTE MENCIONADAS...
                distances[nodos[i].id] = Infinity;      //... A DISTANCES SE LE ASIGNA EL VALOR INFINITO YA QUE SE DESCONOCE LA DISTANCIA.
                parents[nodos[i].id] = null;            //... A PARENTS SE LE ASIGNA EL VALOR NULL YA QUE SE DESCONOCE LOS NODOS DEL CAMINO.
            }
            distances[idOrigen] = 0; //LA DISTANCIA DEL NODO ORIGEN SIEMPRE ES 0.
            
            for (let i = 0; i < nodos.length - 1; i += 1) { //EN ESTE ALGORITMO SE ANALIZAN LAS DISTANCIAS ENTRE NODOS DESDE EL NODO ORIGEN HASTA EL NODO DESTINO.
                for (var j = 0; j < aristas.length; j += 1) {
                    c = aristas[j];
                    if (distances[c.from.id] + c.peso < distances[c.to.id]) { //SE COMPARAN LAS DISTANCIAS ENTRE LOS NODOS VECINOS.
                        distances[c.to.id] = distances[c.from.id] + c.peso; //SE GUARDA LA MENOR DISTANCIA ENTRE NODOS.
                        parents[c.to.from] = c.to.id; //SE ALMACENA EL ID DEL NODO QUE PRECEDE AL ANTERIOR, EL ORIGEN O EL SUBORIGEN.
                    }
                }
            }

            for (let i = 0; i < aristas.length; i += 1) { //EN ESTE ALGORITMO SE VERIFICA SI EL GRAFO TIENE CICLOS NEGATIVOS.
                c = aristas[i];
                if (distances[c.from.id] + c.peso < distances[c.to.id]) {
                    onSendMessage('El grafo tiene un ciclo negativo.');
                }
            }
            
            parents.reverse();

            socket.emit('send-message', {
                idNodoDestino: parents[idOrigen], // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
                idNodoOrigen: idOrigen, // Id del nodo origen
                idNodoDestinoFinal: idEnviar, // Id del nodo destino final
                mensaje: mensaje, // Mensaje que se le quiere enviar
                extra: {parents: parents, done: true, counter: 0}, //PARAMETROS EXTRA QUE SIRVEN PARA LA SIGUIENTE NODO.
            })
            // Despues de mandar el mensaje
            onSendMessage(`Se envió el mensaje de origen ${idOrigen} hacia ${parents[idOrigen]}`);
        } else {
            if (extra.counter <= extra.parents.length){
                let counter = extra.counter + 1;
                socket.emit('send-message', {
                    idNodoDestino: extra.parents[idOrigen], // Id del nodo al que se le quiere mandar el mensaje dentro de la red (el intermedio)
                    idNodoOrigen: idOrigen, // Id del nodo origen
                    idNodoDestinoFinal: idEnviar, // Id del nodo destino final
                    mensaje: mensaje, // Mensaje que se le quiere enviar
                    extra: {parents: parents, done: true, counter: counter}, //PARAMETROS EXTRA QUE SIRVEN PARA LA SIGUIENTE NODO.
                })
            }
            // Despues de mandar el mensaje
            onSendMessage(`Se envió el mensaje de origen ${idOrigen} hacia ${extra.parents[idOrigen]}`);
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