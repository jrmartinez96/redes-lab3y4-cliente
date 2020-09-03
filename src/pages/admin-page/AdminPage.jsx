import React from 'react'
import './admin.css'
import { Graph } from "react-d3-graph";

class AdminPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedNodo: "",
            selectedNodo2: "",
            vecinosInput: [],
            peso: 0,
        }
    }

    onChangePeso = () => {
        if (this.state.selectedNodo !== "" && this.state.selectedNodo2 !== "") {
            const { socket } = this.props;
            socket.emit('peso-vecino', {
                idNodo1: this.state.selectedNodo, // Id del nodo 1
                idNodo2: this.state.selectedNodo2, // Id del nodo 2
                peso: this.state.peso, // Peso entre estos nodos
            })
        }
    }

    render() {
        // -------------- Peso conf --------------
        let peso = 0;
        let indexNodo1 = -1;

        this.props.nodos.forEach((nodo, index) => {
            if (nodo.id === this.state.selectedNodo) {
                indexNodo1 = index;
            }
        })

        if (indexNodo1 !== -1) {
            const nodo1 = this.props.nodos[indexNodo1];

            nodo1.vecinos.forEach((data, index) => {
                if (data.nodo.id === this.state.selectedNodo2) {
                    peso = data.peso
                }
            })


        }

        // -------------- Graph conf --------------
        const nodes = this.props.nodos.map(nodo => ({id: nodo.id, nombre: nodo.nombre}));
        let links = []

        this.props.nodos.forEach(nodo => {
            nodo.vecinos.forEach(vecino => {
                let hasLink = false;
                links.forEach(link => {
                    if (link.source === vecino.nodo.id && link.target === nodo.id) {
                        hasLink = true
                    }
                })
                if (!hasLink) {
                    links = [...links, {source: nodo.id, target: vecino.nodo.id, peso: vecino.peso}]
                }
            })
        })

        const data = {
            nodes: nodes,
            links: links
        }

        return (
            <div className="admin-page">
                <div className="weight-conf-container">
                    <div className="change-weight">
                        <button onClick={this.props.onRegresar}>Regresar</button>
                        <h2>Peso</h2>
                        <label>Nodo seleccionado 1: </label>
                        <select onChange={(e) => {this.setState({selectedNodo: e.target.value})
                        }}>
                            <option value={""}>---</option>
                            {
                                this.props.nodos.map((nodo, index) => {
                                    return (
                                        <option key={index} value={nodo.id}>{nodo.nombre}</option>
                                    )
                                })
                            }
                        </select>
                        <br/>
                        <label>Nodo seleccionado 2: </label>
                        <select onChange={(e) => {this.setState({selectedNodo2: e.target.value})
                        }}>
                            <option value={""}>---</option>
                            {
                                this.props.nodos.map((nodo, index) => {
                                    return (
                                        <option key={index} value={nodo.id}>{nodo.nombre}</option>
                                    )
                                })
                            }
                        </select>
                        <br/>
                        Peso actual: {peso}
                        <br/>
                        <input type="number" placeholder="Nuevo peso..." value={this.state.peso} onChange={(e)=>this.setState({peso: e.target.value})} />
                        <button onClick={this.onChangePeso}>Cambiar peso</button>
                    </div>

                    <div className="nodes-list">
                        <h2>Lista de nodos conectados</h2>
                        <ul>
                            {
                                this.props.nodos.map((nodo, index) => {
                                    return (
                                    <li key={index} >{nodo.nombre}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="node-graph-container">
                    <Graph
                        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                        data={data}
                        config={{
                            "automaticRearrangeAfterDropNode": true,
                            "collapsible": false,
                            "directed": false,
                            "focusAnimationDuration": 0.75,
                            "focusZoom": 1,
                            "height": 500,
                            "highlightDegree": 1,
                            "highlightOpacity": 1,
                            "linkHighlightBehavior": false,
                            "maxZoom": 1.5,
                            "minZoom": 1,
                            "nodeHighlightBehavior": false,
                            "panAndZoom": false,
                            "staticGraph": false,
                            "staticGraphWithDragAndDrop": false,
                            "d3": {
                                "alphaTarget": 0.05,
                                "gravity": -100,
                                "linkLength": 100,
                                "linkStrength": 1,
                                "disableLinkForce": false
                            },
                            "initialZoom": 1,
                            node: {
                                color: "lightgreen",
                                size: 150,
                                highlightStrokeColor: "blue",
                                renderLabel: true,
                                labelProperty: "nombre"
                            },
                            link: {
                                highlightColor: "lightblue",
                                renderLabel: true,
                                labelProperty: "peso"
                            },
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default AdminPage;

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