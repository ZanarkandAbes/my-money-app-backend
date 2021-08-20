// ROUTES 

const express = require('express')
const router = express.Router()

const billingCycleController = require('../api/controllers/billingCycleController')

router.get('/', billingCycleController.getAll)
router.get('/count', billingCycleController.count)
router.get('/summary', billingCycleController.summary)
router.post('/create', billingCycleController.create)
router.get('/:id', billingCycleController.getById)
router.put('/:id/update', billingCycleController.update)
router.delete('/:id/delete', billingCycleController.delete)

module.exports = router