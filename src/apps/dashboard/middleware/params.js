const { getCompanyExport } = require('../repos')

async function getCompanyExportParam(req, res, next, id) {
  try {
    const companyExport = await getCompanyExport(req, id)

    res.locals.companyExport = companyExport
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyExportParam,
}
