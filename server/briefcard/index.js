const db      = require('../../lib/db')
const moment  = require('moment')
const _       = require('lodash')

function getMaxCollectedDate(done) {
    db.get().query('select MAX(data_collected_date) as max_date from sandp_stock_ratings_thestreet', (err, dt) => {
        if (err) throw err
        done(moment(dt[0].max_date).format('YYYY-MM-DD'))
    })
}

function formatBriefCardDataForAPI(rows, latest_data_date, old_data_date) {
    let apiFormat = []
    let symObj = {}

    // Below: because of the data format coming from DB,
    // we need this temp structure (dict with symbol as key). Dont want to send this to FE
    //  YHOO:
    //      { name: 'Yahoo Inc.',
    //        sector: 'Information Technology',
    //        low_date: { dt: '2017-01-01', rt: 'C (Hold)' },
    //        high_date: { dt: '2017-01-08', rt: 'C (Hold)' } },
    _.forEach(rows, (row) => {
        if (!symObj[row.symbol]) {
            symObj[row.symbol] = {
                id: row.id,
                symbol: row.symbol,
                name: row.name,
                sector: row.sector,
            }
            let formattedDate = moment(row.data_collected_date).format('YYYY-MM-DD')
            if (formattedDate == latest_data_date) {
                symObj[row.symbol]['high_date'] = {
                    dt: formattedDate,
                    rt: row.rating
                }
            } else {
                symObj[row.symbol]['low_date'] = {
                    dt: formattedDate,
                    rt: row.rating
                }
            }
        } else {
            let formattedDate = moment(row.data_collected_date).format('YYYY-MM-DD')
            if (formattedDate == latest_data_date) {
                symObj[row.symbol]['high_date'] = {
                    dt: formattedDate,
                    rt: row.rating
                }
            } else {
                symObj[row.symbol]['low_date'] = {
                    dt: formattedDate,
                    rt: row.rating
                }
            }
        }
    })

    // console.log(symObj.keys)

    // Reformat the above and send this to FE (slight performance hit. Solve with Redis/cache)
    // Array of objects
    // [{ symbol: 'XRX',
    // name: 'Xerox Corp.',
    // sector: 'Information Technology',
    // low_date: { dt: '2017-01-01', rt: 'C (Hold)' },
    // high_date: { dt: '2017-01-08', rt: 'C+ (Hold)' } }, {...}, {...} ]
    _.forEach(Object.keys(symObj), (sym) => {
        apiFormat.push(symObj[sym])
    })

    return apiFormat
}

exports.getBriefCardData = function(done) {
    getMaxCollectedDate((latest_data_collection_date) => {
        let seventh_day_from_latest_date = moment(latest_data_collection_date).add(-7, 'days').format('YYYY-MM-DD')
        let query = `
            select st.symbol, st.name, st.sector, rt.data_collected_date, rt.rating, rt.id
            FROM
            (
                select * from sandp_stock_ratings_thestreet where data_collected_date='${latest_data_collection_date}'
                UNION
                select * from sandp_stock_ratings_thestreet where data_collected_date='${seventh_day_from_latest_date}'
            ) rt INNER JOIN sandp_stocks st
            on rt.stock_id = st.id
            `

        db.get().query(query, (err,  rows) => {
            if (err) throw err

            let formattedDataForBriefCard = formatBriefCardDataForAPI(rows, latest_data_collection_date, seventh_day_from_latest_date)

            done(formattedDataForBriefCard)
        })
    })




}
