import React from 'react'
import { connect } from 'react-redux'
import { briefCardRequest } from '../../actions/briefCardActions'

require('../../styles/briefcard.css')

class BriefCard extends React.Component {

    constructor() {
        super()

        this.state = {
            allSymbolsBrief: []
        }
    }

    componentWillMount() {
        this.props.briefCardRequest().then((response) => {
            this.setState({
                allSymbolsBrief: response.data
            })
        })
    }

    symbolCard() {
        return this.state.allSymbolsBrief.map((info) => {
            return (
                <li key={info.id} className="bc-container">
                    <div className="bc-left-text">
                        <h2>{info.symbol}</h2>
                        <h4>{info.name}</h4>
                        <p>{info.sector}</p>
                    </div>
                    <div className="bc-center-text">
                        <h3>{info.high_date.rt}</h3>
                    </div>
                </li>
            )
        })
    }

    render() {
        return (
            <ul className="list-unstyled">{ this.symbolCard() }</ul>
        )
    }
}

export default connect(null, { briefCardRequest })(BriefCard)
