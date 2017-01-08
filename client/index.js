import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/index'
import routes from './routes'

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

render(<Provider store={store}>
            <Router history={browserHistory} routes={routes} />
       </Provider>
    , document.getElementById('app'))
