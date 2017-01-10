import React from 'react'
import { connect } from 'react-redux'
import { briefCardRequest } from '../../actions/briefCardActions'

const moment  = require('moment')
require('../../styles/briefcard.css')

class BriefCard extends React.Component {

    constructor() {
        super()

        this.state = {
            allSymbolsBrief: []
        }
    }

    componentWillMount() {
        let today = moment().format('YYYY-MM-DD')
        let bcWeeklyCookie = localStorage.getItem('bcWeekly')
        let readFromLocalStorage = false
        let storedData = undefined

        if (bcWeeklyCookie) {
            storedData = JSON.parse(decodeURIComponent(bcWeeklyCookie))
            if (Object.keys(storedData)[0] === today && storedData[today].length) readFromLocalStorage = true
            else localStorage.removeItem('bcWeekly')
        }

        if (readFromLocalStorage) {
            this.setState({
                allSymbolsBrief: storedData[today]
            })
        } else {
            this.props.briefCardRequest().then((response) => {
                let cacheVal = {}
                cacheVal[today] = response.data
                localStorage.setItem('bcWeekly', encodeURIComponent(JSON.stringify(cacheVal)))
                this.setState({
                    allSymbolsBrief: response.data
                })
            })
        }
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
