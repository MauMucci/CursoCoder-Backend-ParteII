const express = require('express')

const router = express.Router()


//enpoints

router.get("/api/productsss",(req,res) => {
    res.send("HOLIS DESDE ROUTER")
})

module.exports = router;