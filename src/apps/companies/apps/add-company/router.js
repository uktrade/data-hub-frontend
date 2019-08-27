const router = require('express').Router()

const {
  renderAddCompanyForm,
} = require('./controllers')

router.get('/', renderAddCompanyForm)

module.exports = router
