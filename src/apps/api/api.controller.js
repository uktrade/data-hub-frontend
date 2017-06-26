const { lookupAddress } = require('./api.service')
const metadata = require('../../lib/metadata')

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
  postcodeLookupHandler,
}
