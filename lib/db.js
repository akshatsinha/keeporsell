var mysql = require('mysql')

var state = {
    pool: null
}

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: 'keeporselldbinstance.cuvbt4xyyhf3.us-west-2.rds.amazonaws.com',
        user: 'keeporsell',
        password: 'keeporsell',
        database: 'keeporsell'
    })
    done()
}

exports.get = function() {
    return state.pool
}
