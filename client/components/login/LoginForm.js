import React from 'react'

class LoginForm extends React.Component {

    constructor() {
        super()

        this.state = {
            email: '',
            password: ''
        }

        this.submitLogin = this.submitLogin.bind(this)
    }

    onChange() {
        this.setState({
            email: this.refs.email.value,
            password: this.refs.password.value
        })
    }

    submitLogin(e) {
        e.preventDefault()
        this.props.loginRequest({email: this.state.email, password: this.state.password})
    }

    render() {
        return (
            <form onSubmit={ this.submitLogin }>
                <div className="form-group">
                    <label className="control-label">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={ this.state.email }
                        onChange={ () => this.onChange() }
                        ref="email" />
                </div>
                <div className="form-group">
                    <label className="control-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={ this.state.password }
                        onChange={ () => this.onChange() }
                        ref="password" />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary btn-lg">Login</button>
                </div>

            </form>
        )
    }
}

LoginForm.propTypes = {
    loginRequest: React.PropTypes.func.isRequired
}

export default LoginForm
