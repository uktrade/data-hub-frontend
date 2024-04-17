const { lookupAddress } = require('../services')

async function postcodeLookupHandler(req, res) {
  try {
    res.json(await lookupAddress(req.params.postcode))
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

module.exports = {
  postcodeLookupHandler,
}
