const logger = require('../../../../config/logger')
const { getInflatedDitCompany } = require('../../companies/services/data')

async function getCompany (req, res, next, companyId) {
  try {
    res.locals.company = await getInflatedDitCompany(req.session.token, companyId)
    next()
  } catch (e) {
    logger.error(e)
    res.redirect('/')
  }
}

module.exports = {
  getCompany,
}
