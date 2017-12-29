const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { renderList } = require('./controllers')
const {
  setResults,
  setRequestBody,
} = require('./middleware')

const DEFAULT_QUERY = {
  sortby: 'created_on:desc',
}

router.get('/',
  setDefaultQuery(DEFAULT_QUERY),
  setRequestBody,
  setResults,
  renderList
)

module.exports = router
