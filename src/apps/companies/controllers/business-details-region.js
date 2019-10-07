/* eslint-disable camelcase */
const { updateCompany } = require('../repos')
const { getOptions } = require('../../../lib/options')

async function renderRegion (req, res, next) {
  const { company } = res.locals
  const { token } = req.session

  const props = {
    companyId: company.id,
    csrfToken: res.locals.csrfToken,
  }

  try {
    props.ukRegions = await getOptions(token, 'uk-region')

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Business details')
      .breadcrumb('Edit the DIT region')
      .render('companies/views/business-details-edit', { props })
  } catch (error) {
    next(error)
  }
}

async function updateRegion (req, res, next) {
  const { token } = req.session
  const { companyId } = req.params
  const { uk_region } = req.body

  try {
    await updateCompany(token, companyId, { uk_region })
    req.flash('success', 'Company region updated')
    return res.status(200).json({})
  } catch (error) {
    req.flash('error', 'Company region could not be updated')
    return res.status(error.statusCode).json({ message: error.message })
  }
}

module.exports = {
  renderRegion,
  updateRegion,
}
