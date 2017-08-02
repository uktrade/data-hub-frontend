const { lookupAddress } = require('./services')
const metadata = require('../../lib/metadata')
const { adviserSearch } = require('../adviser/repos')

async function adviserSearchHandler (req, res, next) {
  try {
    const advisers = await adviserSearch(req.session.token, req.params.term)
    res.json(advisers)
  } catch (error) {
    next(error)
  }
}

async function postcodeLookupHandler (req, res) {
  try {
    const postcode = req.params.postcode
    const addresses = await lookupAddress(postcode)
    const augmentedAddresses = addresses.map(address => {
      return Object.assign({}, address, {
        country: metadata.countryOptions.find(country => country.name.toLowerCase() === 'united kingdom').id,
      })
    })

    res.json(augmentedAddresses)
  } catch (error) {
    res.json({ error })
  }
}

module.exports = {
  adviserSearchHandler,
  postcodeLookupHandler,
}
