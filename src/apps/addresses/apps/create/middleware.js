const { map } = require('lodash')

const { getAddresses } = require('../../services/lookup')
const { transformObjectToOption } = require('../../../../apps/transformers')

const setAddresses = async (req, res, next) => {
  const postcode = req.currentJourney.getField('postcode').toUpperCase()
  const addresses = await getAddresses(postcode)

  res.locals.postcode = postcode
  res.locals.addresses = map(addresses, transformObjectToOption)

  next()
}

module.exports = {
  setAddresses,
}
