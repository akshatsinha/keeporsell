import React from 'react'
import SignupForm from './SignupForm'

class SignupPage extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">
                    <SignupForm />
                </div>
            </div>
        )
    }
}

export default SignupPage
