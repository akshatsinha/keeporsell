"use strict";

import express from 'express'
import path from 'path'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config.dev'
import apiRoutes from './api-routes'



let app    = express()

const compiler = webpack(webpackConfig)
const db       = require('../lib/db')

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true // eliminate noise from webpack
}))
app.use(webpackHotMiddleware(compiler))

app.use('/api', apiRoutes)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})


db.connect((err) => {
    if (err) {
        console.log('Unable to connect to MySQL. Terminating')
        process.exit(1)
    } else {
        app.listen(3000, () => {
            console.log('Listening on port 3000')
        })
    }
})

