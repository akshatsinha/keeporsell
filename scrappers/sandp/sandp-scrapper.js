"use strict";

const _        = require("lodash")
const async    = require("async")
const cheerio  = require("cheerio")
const moment   = require("moment")
const mysql    = require('mysql')
const request  = require("request")
const winston  = require("winston")

const sandpsettings = require("./sandp-settings")
const utils         = require("../../lib/utils.js")
const log           = utils.log

let connection = utils.createConnection()

function getHTTPReqURL(stockName) {
    let options = {
        url: 'https://www.thestreet.com/quote/' + stockName + '.html',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
        }
    };
    return options
}

function scrapeRating() {
    let stockRatings = []
    let intervaltime = 100

    async.waterfall([
        // Function 1: Get all stock symbols from DB
        (cb) => {
            connection.query('select id, symbol from sandp_stocks', (err, results) => {
                if (err) throw err
                cb(null, results)
            })
        },

        // Function 2: Make requests for each symbol
        (results, cb) => {
            for (var i = 0; i < results.length; i++) {
                ((index, cb) => {
                    setTimeout(() => {
                        let symbol = results[index].symbol
                        let id = results[index].id
                        request(getHTTPReqURL(symbol), (err, resp, body) => {
                            if (err || resp.statusCode !== 200) log({timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}, 'error: ', symbol, err)
                            let $ = cheerio.load(body)
                            let rating = $(sandpsettings.RATING_DOM_CLASS).text()
                            log(id + ' - ' + symbol + ' --> ' + rating)
                            stockRatings.push({id: id, data_collected_date: moment().format('YYYY-MM-DD'), rating: rating, last_modified: moment().format('YYYY-MM-DD HH:mm:ss')})
                            if (index === results.length - 1) cb(null, stockRatings)
                        })
                    }, i * intervaltime)
                })(i, cb)
            }
        },

        // Function 3: Bulk update the database with ratings data
        (stockRatings, cb) => {
            log('Uploading ' + stockRatings.length + ' rows in the database...')
            _.forEach(stockRatings, (stockInfo) => {
                let sql = 'INSERT INTO ' + sandpsettings.SANDP_RATINGS_TABLE + ' (stock_id, data_collected_date, rating, last_modified) values (' + [stockInfo.id, stockInfo.data_collected_date, stockInfo.rating, stockInfo.last_modified].map(item => `"${item}"`).join()  + ') ON DUPLICATE KEY UPDATE last_modified="' + moment().format('YYYY-MM-DD HH:mm:ss') + '", rating="' + stockInfo.rating + '"';
                // console.log(sql)
                connection.query(sql, (err, results) => {
                    if (err) throw err
                })
            })
            cb()
        }

    ], (err, results) => {
        log('Data inserted. Ending DB connection...')
        connection.end()
    })
}

module.exports = { scrapeRating }
