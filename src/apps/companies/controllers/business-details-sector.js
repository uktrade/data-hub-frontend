/* eslint-disable camelcase */
const { updateCompany } = require('../repos')
const { getOptions } = require('../../../lib/options')

async function renderSector (req, res, next) {
  const { company } = res.locals
  const { token } = req.session

  const props = {
    companyId: company.id,
    csrfToken: res.locals.csrfToken,
  }

  try {
    props.sectors = await getOptions(token, 'sector')

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Business details')
      .breadcrumb('Edit the DIT sector')
      .render('companies/views/business-details-sector-edit', { props })
  } catch (error) {
    next(error)
  }
}

async function updateSector (req, res, next) {
  const { token } = req.session
  const { companyId } = req.params
  const { sector } = req.body

  try {
    await updateCompany(token, companyId, { sector })
    req.flash('success', 'Company sector updated')
    return res.status(200).json({})
  } catch (error) {
    req.flash('error', 'Company sector could not be updated')
    return res.status(error.statusCode).json({ message: error.message })
  }
}

module.exports = {
  renderSector,
  updateSector,
}
