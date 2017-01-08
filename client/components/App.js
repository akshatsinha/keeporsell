import React from 'react'
import NavigationBar from './NavigationBar'


class App extends React.Component {

    render() {
        return (
            <div>
                <NavigationBar />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }

}

export default App
