const metaDataRepository = require('../../../lib/metadata')
const { getContactsForCompany } = require('../../contacts/repos')
const { getAllAdvisers } = require('../../adviser/repos')

async function getOptions (req, res, next) {
  try {
    const token = req.session.token
    const advisersResponse = await getAllAdvisers(token)

    res.locals.advisers = advisersResponse.results
    res.locals.contacts = await getContactsForCompany(token, res.locals.company.id)
    res.locals.communicationChannelOptions = metaDataRepository.communicationChannelOptions
    res.locals.services = metaDataRepository.serviceDeliveryServiceOptions
  } catch (error) {
    return next(error)
  }
  next()
}

module.exports = getOptions
