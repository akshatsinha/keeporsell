import React from 'react'
import { connect } from 'react-redux'

import LoginForm from './LoginForm'
import { loginRequest } from '../../actions/loginActions'

class LoginPage extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">
                    <LoginForm loginRequest={this.props.loginRequest} />
                </div>
            </div>
        )
    }
}

LoginPage.propTypes = {
    loginRequest: React.PropTypes.func.isRequired
}

export default connect(null, { loginRequest })(LoginPage)
