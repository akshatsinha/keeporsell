"use strict";

// Institutional ownership and mutual fund ownership data from Yahoo! Finance

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
        url: 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/' + stockName + '?modules=institutionOwnership%2CfundOwnership',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
        }
    }
    return options
}

function scrapeOwnershipData() {
    let allInstOwnerData = []
    let allFundOwnerData = []
    let intervaltime = 5000


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
                            let ownObj = JSON.parse(body)
                            let instOwners = ownObj.quoteSummary.result[0].institutionOwnership.ownershipList
                            let fundOwners = ownObj.quoteSummary.result[0].fundOwnership.ownershipList

                            _.forEach(instOwners, function(owner) {
                                log(owner)
                                allInstOwnerData.push({
                                    id: id,
                                    organization: owner.organization,
                                    report_date : owner.reportDate.fmt,
                                    pctHeld_raw : owner.pctHeld.raw,
                                    pctHeld_fmt : owner.pctHeld.fmt,
                                    position_raw: owner.position.raw,
                                    position_fmt: owner.position.fmt,
                                    position_lng: owner.position.longFmt,
                                    value_raw   : owner.value.raw,
                                    value_fmt   : owner.value.fmt,
                                    value_lng   : owner.value.longFmt
                                })
                            })
                            // console.log(allInstOwnerData)

                            _.forEach(fundOwners, function(owner) {
                                allFundOwnerData.push({
                                    id: id,
                                    organization: owner.organization,
                                    report_date: owner.reportDate.fmt,
                                    pctHeld_raw : owner.pctHeld.raw,
                                    pctHeld_fmt : owner.pctHeld.fmt,
                                    position_raw: owner.position.raw,
                                    position_fmt: owner.position.fmt,
                                    position_lng: owner.position.longFmt,
                                    value_raw   : owner.value.raw,
                                    value_fmt   : owner.value.fmt,
                                    value_lng   : owner.value.longFmt
                                })
                            })
                            // console.log(allFundOwnerData)
                            if (index === results.length - 1) cb(null, [allInstOwnerData, allFundOwnerData])
                        })
                    }, i * intervaltime)
                })(i, cb)
            }
        },

        // Function 3: Bulk update the database with ratings data
        (allOwnerData, cb) => {
            let allInstOwnerData = allOwnerData[0]
            let allFundOwnerData = allOwnerData[1]

            log('Uploading ' + allInstOwnerData.length + ' rows in the database for Institutional Owners...')
            _.forEach(allInstOwnerData, (stockInfo) => {
                let sql = 'INSERT INTO ' + sandpsettings.SANDP_INST_OWNERS + ' (stock_id, organization, report_date_fmt, pctHeld_raw, pctHeld_fmt, position_raw, position_fmt, position_lng, value_raw, value_fmt, value_lng) values (' + [stockInfo.id, stockInfo.organization, stockInfo.report_date, stockInfo.pctHeld_raw, stockInfo.pctHeld_fmt, stockInfo.position_raw, stockInfo.position_fmt, stockInfo.position_lng, stockInfo.value_raw, stockInfo.value_fmt, stockInfo.value_lng].map(item => `"${item}"`).join()  + ')';
                // console.log(sql)
                connection.query(sql, (err, results) => {
                    if (err) throw err
                })
            })

            log('Uploading ' + allFundOwnerData.length + ' rows in the database for Fund Owners...')
            _.forEach(allInstOwnerData, (stockInfo) => {
                let sql = 'INSERT INTO ' + sandpsettings.SANDP_FUND_OWNERS + ' (stock_id, organization, report_date_fmt, pctHeld_raw, pctHeld_fmt, position_raw, position_fmt, position_lng, value_raw, value_fmt, value_lng) values (' + [stockInfo.id, stockInfo.organization, stockInfo.report_date, stockInfo.pctHeld_raw, stockInfo.pctHeld_fmt, stockInfo.position_raw, stockInfo.position_fmt, stockInfo.position_lng, stockInfo.value_raw, stockInfo.value_fmt, stockInfo.value_lng].map(item => `"${item}"`).join()  + ')';
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


module.exports = { scrapeOwnershipData }
