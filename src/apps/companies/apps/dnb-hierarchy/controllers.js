/* eslint-disable camelcase */

const config = require('../../../../config')
const { transformCompanyToDnbHierarchyList } = require('./transformers')
const { getDnbHierarchy } = require('./repos')
const urls = require('../../../../lib/urls')

async function renderDnbHierarchy (req, res, next) {
  try {
    const { company } = res.locals

    if (!company.global_ultimate_duns_number) {
      return next({
        statusCode: 403,
        message: 'This company does not belong to any D&B hierarchy',
      })
    }

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Business details', urls.companies.businessDetails(company.id))
      .breadcrumb('Related companies')
      .render('companies/apps/dnb-hierarchy/views/client-container', {
        heading: `Company records related to ${company.name}`,
        props: {
          dataEndpoint: urls.companies.dnbHierarchy.data(company.id),
          isGlobalHQ: company.isGlobalHQ,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function fetchDnbHierarchyHandler (req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session
    const { page } = req.query

    const { count, results } = await getDnbHierarchy(
      token,
      company.global_ultimate_duns_number,
      config.paginationDefaultSize,
      page
    )

    res.json({
      count,
      results: results.map(transformCompanyToDnbHierarchyList),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDnbHierarchy: renderDnbHierarchy,
  fetchDnbHierarchyHandler,
}
