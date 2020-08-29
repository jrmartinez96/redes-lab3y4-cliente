import React from 'react'
import './log.css'

const LogComponent = (props) => {

    return (
        <div className="log-container">
            <div className="logs-title">
                <h3>Logs</h3>
            </div>
            {
                props.logs.map((log, index) => {
                    return(
                        <div key={index} className="log-entry">
                            {log}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LogComponent;