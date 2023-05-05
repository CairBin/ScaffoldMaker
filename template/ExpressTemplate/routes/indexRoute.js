const router = require('express').Router()
const indexCtrl = require('./../controllers/indexCtrl')
router.get('/',(res,req,next)=>{
    indexCtrl.indexPage(res,req,next)
})

module.exports = router