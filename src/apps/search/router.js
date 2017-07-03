const router = require('express').Router()

const {
  indexAction,
  searchAction,
  searchActionValidationSchema,
} = require('./controllers')

router.get('/search/:searchType?', searchActionValidationSchema, indexAction, searchAction)

module.exports = router
