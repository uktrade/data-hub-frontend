/* eslint camelcase: 0 */
const express = require('express')
const postcodeService = require('../services/postcodeservice')

const router = express.Router()

function postcodelookup (req, res) {
  const postcode = req.params.postcode
  postcodeService.lookupAddress(postcode)
    .then((addresses) => {
      res.json(addresses)
    })
    .catch((error) => {
      res.json({ error })
    })
}

router.get('/api/postcodelookup/:postcode', postcodelookup)

module.exports = {
  postcodelookup,
  router
}
