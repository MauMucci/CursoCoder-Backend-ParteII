const express = require('express')

const router = express.Router()


//enpoints

router.get("/api/carts",(req,res) => {
    res.send("HOLIS DESDE ROUTER carts")
})

module.exports = router;