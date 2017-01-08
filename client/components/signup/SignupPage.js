import React from 'react'
import { connect } from 'react-redux'

import { userSignupRequest } from '../../actions/signupActions'
import SignupForm from './SignupForm'

class SignupPage extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">
                    <SignupForm
                        userSignupRequest={this.props.userSignupRequest} />
                </div>
            </div>
        )
    }
}

SignupPage.propTypes = {
    userSignupRequest: React.PropTypes.func.isRequired
}

export default connect(null, { userSignupRequest })(SignupPage)
