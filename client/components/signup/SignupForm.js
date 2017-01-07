import React from 'react'

class SignupForm extends React.Component {

    constructor() {
        super()

        this.state = {
            email: '',
            password: ''
        }

        this.onSubmit = this.onSubmit.bind(this) // needed to bind 'this' to the context of the class, not event in that func
    }

    onChange() {
        this.setState({
            email: this.refs.email.value,
            password: this.refs.password.value
        })
    }

    onSubmit(e) {
        e.preventDefault()
        console.log('submitting: ', this.state)
    }

    render() {
        return (
            <form onSubmit={ this.onSubmit } >
                <h1>Join our community!</h1>

                <div className="form-group">
                    <label className="control-label">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={ this.state.email }
                        onChange={ (e) => this.onChange() }
                        ref="email" />
                </div>

                <div className="form-group">
                    <label className="control-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={ this.state.password }
                        onChange={ (e) => this.onChange() }
                        ref="password" />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary btn-lg">Sign Up!</button>
                </div>

            </form>
        )
    }

}

export default SignupForm
