"use strict";

const argv          = require('yargs').argv
const utils         = require("./lib/utils.js")
const log           = utils.log

const sandpscrapper = require("./scrappers/sandp/sandp-scrapper")
const sandpownershipscrapper = require("./scrappers/sandp/ownership")



let runAllScrappers     = false
let runOwnershipScraper = false
let runRatingScraper    = false

// run all scripts: node app.js -a, node app.js --all
if (argv.a || argv.all) {
    log('running all scrappers')
    runAllScrappers = true
}

// Quarterly
// node app.js -o, node app.js --ownership
if (runAllScrappers || argv.o || argv.ownership) {
    runOwnershipScraper = true
    log('Running ownership scrapper...')
    sandpownershipscrapper.scrapeOwnershipData()
}

// Daily
// node app.js -r, node app.js --rating
if (runAllScrappers || argv.r || argv.rating) {
    log('Running rating scrapper...')
    runRatingScraper = true
    sandpscrapper.scrapeRating()
}

// Nothing passed or invalid arg passed
if (!runAllScrappers && !runOwnershipScraper && !runRatingScraper) {
    log('[Usage]: node app.js [-all|-a|-o|--ownership|-r|--rating]')
}
