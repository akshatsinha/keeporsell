"use strict";

const mysql = require('mysql')
const moment   = require("moment")
const winston  = require("winston")



function createConnection() {
    return mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : '',
        database : 'keeporsell'
    });
}

function log(message) {
    winston.info({timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}, message)
}


module.exports = {
    createConnection: createConnection,
    log: log
}


