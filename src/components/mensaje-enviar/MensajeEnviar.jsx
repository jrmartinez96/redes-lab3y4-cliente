import React from 'react'
import './mensaje-enviar.css'
import { flooding } from '../../algoritmos-ruteo/flooding';
import { dvr } from '../../algoritmos-ruteo/distance-vector-routing';
import { lsr } from '../../algoritmos-ruteo/link-state-routing';

class MensajeEnviar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            algoritmo: "flooding",
            selectedNodo: "",
            mensaje: ""
        }
    }

    enviarMensaje = () => {
        const { socket, id, nodos } = this.props;
        const { mensaje, selectedNodo } = this.state;

        if (mensaje !== "") {
            switch (this.state.algoritmo) {
                case "flooding":
                    flooding(socket, nodos, id, selectedNodo, id, mensaje, this.props.onAfterSendMessage, null);
                    break;
                case "dvr":
                    dvr(socket, nodos, id, selectedNodo, id, mensaje, this.props.onAfterSendMessage, null);
                    break;
                case "lsr":
                    lsr(socket, nodos, id, selectedNodo, id, mensaje, this.props.onAfterSendMessage, null);
                    break;
            
                default:
                    break;
            }
            this.setState({mensaje: ""})
        }
    }

    render() {
        return(
            <div className="mensaje-enviar-page">
                <div className="algoritmos-opciones"
                    value={this.state.algoritmo}
                    onChange={(e)=>{
                        this.setState({algoritmo: e.target.value});
                        this.props.onAlgoritmoChange(e.target.value);
                    }}
                >
                    <p>Algoritmo a utilizar:</p>
                    <input defaultChecked type="radio" id="flooding" name="algoritmo" value="flooding"/>
                    <label>Flooding</label><br/>
                    <input type="radio" id="dvr" name="algoritmo" value="vdr"/>
                    <label>Distance vector routing</label><br/>
                    <input type="radio" id="lsr" name="algoritmo" value="lsr"/>
                    <label>Link state routing</label>
                </div>
                <div className="input-mensaje">
                    <label>Enviar a: </label>
                    <select onChange={(e) => {this.setState({selectedNodo: e.target.value})}}>
                        <option value={""}>---</option>
                        {
                            this.props.nodos.filter(nodo => nodo.id !== this.props.id).map((nodo, index) => {
                                return (
                                    <option key={index} value={nodo.id}>{nodo.nombre}</option>
                                )
                            })
                        }
                    </select>
                    <br/>
                    <br/>
                    <input placeholder="Mensaje" value={this.state.mensaje} onChange={(e)=>this.setState({mensaje: e.target.value})}/>
                    <button onClick={this.enviarMensaje}>Enviar</button>
                </div>
            </div>
        )
    }
}

export default MensajeEnviar;