import React from 'react'
import { connect } from 'react-redux'
import { briefCardRequest } from '../../actions/briefCardActions'

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
                <li key={info.id}>
                    {info.symbol}<br />
                    {info.name}<br />
                    {info.sector}
                </li>
            )
        })
    }

    render() {
        return (
            <ul>
                { this.symbolCard() }
            </ul>
        )
    }
}

export default connect(null, { briefCardRequest })(BriefCard)
