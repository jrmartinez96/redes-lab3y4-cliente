import React from 'react'
import './admin.css'

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

        return (
            <div className="admin-page">
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
        )
    }
}

export default AdminPage;