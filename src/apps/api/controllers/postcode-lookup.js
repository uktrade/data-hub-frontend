const { assign } = require('lodash')

const { lookupAddress } = require('../services')
const metadata = require('../../../lib/metadata')

async function postcodeLookupHandler(req, res) {
  try {
    const postcode = req.params.postcode
    const addresses = await lookupAddress(postcode)
    const unitedKingdomCountryId = metadata.countryOptions.find(
      (country) => country.name.toLowerCase() === 'united kingdom'
    ).id
    const augmentedAddresses = addresses.map((address) => {
      return assign({}, address, { country: unitedKingdomCountryId })
    })

    res.json(augmentedAddresses)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

module.exports = {
  postcodeLookupHandler,
}
