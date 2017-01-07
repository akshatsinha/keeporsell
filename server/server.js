"use strict";



import express from 'express'
import path from 'path'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config.dev'

import dashboardRoutes from './routes/dashboard'

let app = express()

const compiler = webpack(webpackConfig)

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true // eliminate noise from webpack
}))
app.use(webpackHotMiddleware(compiler))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

app.listen(3000)
