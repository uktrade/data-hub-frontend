/* eslint-disable camelcase */

const config = require('../../../../config')
const { transformCompanyToSubsidiariesList } = require('./transformers')
const { getDnbSubsidiaries } = require('./repos')
const urls = require('../../../../lib/urls')

async function renderDnbSubsidiaries (req, res, next) {
  try {
    const { company } = res.locals

    if (!company.is_global_ultimate) {
      return next({ statusCode: 403, message: 'This company is not a D&B Global Ultimate' })
    }

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Business details', urls.companies.businessDetails(company.id))
      .breadcrumb('Related companies')
      .render('companies/apps/dnb-subsidiaries/views/client-container', {
        heading: `Companies related to ${company.name}`,
        props: {
          dataEndpoint: urls.companies.dnbSubsidiaries.data(company.id),
        },
      })
  } catch (error) {
    next(error)
  }
}

async function fetchSubsidiariesHandler (req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session
    const { page } = req.query

    const { count, results } = await getDnbSubsidiaries(
      token, company.duns_number, config.paginationDefaultSize, page
    )

    res.json({
      count: count || 0,
      results: results ? results.map(transformCompanyToSubsidiariesList) : [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDnbSubsidiaries,
  fetchSubsidiariesHandler,
}
