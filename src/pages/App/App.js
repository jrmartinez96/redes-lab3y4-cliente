import React, { Fragment } from 'react';
import io from 'socket.io-client'
import AdminPage from '../admin-page/AdminPage';
import './App.css';
import MensajeEnviar from '../../components/mensaje-enviar/MensajeEnviar';
import { flooding } from '../../algoritmos-ruteo/flooding';
import { dvr } from '../../algoritmos-ruteo/distance-vector-routing';
import { lsr } from '../../algoritmos-ruteo/link-state-routing';
import LogComponent from '../../components/log/LogComponent';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      connectionComplete: false,
      isAdmin: false,
      socket: "",
      nombre: "",
      id: "",
      nodos: [],
      algoritmo: "flooding",
      log: []
    }
  }

  conectar = () => {
    const socket = io.connect('http://localhost:8000');
    this.setState({ socket: socket })

    socket.on('actualizacion-red', (res) => {
      console.log("Actualizacion red ", res)
      this.setState({nodos: res.nodos})
    })

    socket.on('node-connect-complete', (res) => {
      console.log("Connection complete")
      this.setState({connectionComplete: true, nombre: res.nombre, id: res.id})
    })

    socket.on('error-msj', (res) => {
      const { mensaje } = res;
      this.addLog(mensaje);
    })

    socket.on('receive-message', (res) => {
      const { idNodoOrigen, idNodoDesde, idNodoDestinoFinal, mensaje } = res;

      let nombreOrigen = "";
      let nombreDestinoFinal = ""
      let nombreDesde = ""
      this.state.nodos.forEach(nodo => {
        if (nodo.id === idNodoOrigen) {
          nombreOrigen = nodo.nombre
        }
        if (nodo.id === idNodoDestinoFinal) {
          nombreDestinoFinal = nodo.nombre
        }
        if (nodo.id === idNodoDesde) {
          nombreDesde = nodo.nombre
        }
      })

      if (idNodoDestinoFinal === this.state.id) {
        this.addLog(`Se recibió un mensaje de ${nombreDesde} con origen ${nombreOrigen}: ${mensaje}`);
      } else {
        this.addLog(`Se recibió un mensaje de ${nombreDesde} con origen ${nombreOrigen} que es para ${nombreDestinoFinal}`);

        switch (this.state.algoritmo) {
          case "flooding":
            flooding(socket, this.state.nodos, this.state.id, idNodoDestinoFinal, idNodoOrigen, mensaje, this.addLog);
            break;
          case "dvr":
            dvr(socket, this.state.nodos, this.state.id, idNodoDestinoFinal, idNodoOrigen, mensaje, this.addLog);
            break;
          case "lsr":
            lsr(socket, this.state.nodos, this.state.id, idNodoDestinoFinal, idNodoOrigen, mensaje, this.addLog);
            break;
      
          default:
            break;
        }
      }
    })

    return socket;
  }

  nodeConnect = () => {
    if (this.state.nombre !== "") {
      const socket = this.conectar()
      socket.emit('node-connect', { nombre: this.state.nombre})
    }
  }

  algoritmoChange = (algoritmo) => {
    this.setState({algoritmo: algoritmo})
  }

  addLog = (mensaje) => {
    const now = new Date();
    this.setState({log: [...this.state.log, `[${now.toISOString()}]: ${mensaje}`]})
  }

  render() {
    return (
      <div className="app-page">
        {
          this.state.isAdmin ?
            <AdminPage nodos={this.state.nodos} socket={this.state.socket} onRegresar={()=>this.setState({isAdmin: false})}/>
            :
            <Fragment>
              <div className="header-conectar">
                {
                  !this.state.connectionComplete ?
                  <div>
                    <input placeholder="Nombre..." value={this.state.nombre} onChange={(e) => this.setState({nombre: e.target.value})}/>
                    <button onClick={this.nodeConnect}>Node connect</button>
                  </div>
                  :
                  <h2>
                    {this.state.nombre}
                  </h2>
                }
                <br/>
                <button className="admin-btn" onClick={()=>this.setState({isAdmin:true})}>Admin</button>
              </div>
              {
                this.state.connectionComplete ?
                <Fragment>
                  <MensajeEnviar socket={this.state.socket} id={this.state.id} nodos={this.state.nodos} onAlgoritmoChange={this.algoritmoChange} onAfterSendMessage={this.addLog}/>
                  <LogComponent logs={this.state.log}/>
                </Fragment>
                :
                <Fragment/>
              }
            </Fragment>
        }
      </div>
    )
  }
}

export default App;