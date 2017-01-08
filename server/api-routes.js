const express = require('express')
const router  = express.Router()

import { getBriefCardData } from './briefcard/index'



router.get('/card-brief', (req, res) => {
    getBriefCardData((briefCardData) => {
        res.send(briefCardData)
    })
})


module.exports = router;
