/* eslint camelcase: 0 */
const express = require('express')
const Q = require('q')
const postcodeService = require('../services/postcodeservice')
const metadataRepository = require('../repositorys/metadatarepository')
const router = express.Router()
let unitedKingdom

function postcodelookup (req, res) {
  Q.spawn(function * () {
    try {
      const postcode = req.params.postcode
      const addresses = yield postcodeService.lookupAddress(postcode)
      if (!unitedKingdom) {
        unitedKingdom = metadataRepository.countryOptions.find(country => country.name.toLowerCase() === 'united kingdom').id
      }
      addresses.forEach((item) => { item.country = unitedKingdom })
      res.json(addresses)
    } catch (error) {
      res.json({ error })
    }
  })
}

router.get('/api/postcodelookup/:postcode', postcodelookup)

module.exports = {
  postcodelookup,
  router
}
