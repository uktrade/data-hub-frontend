const router = require('express').Router()

const { getHandler } = require('./account.controller')

router.get('/myaccount', getHandler)

module.exports = {
  router,
}
