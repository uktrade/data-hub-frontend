/* eslint-disable camelcase */

const config = require('../../../../config')
const { transformCompanyToDnbHierarchyList } = require('./transformers')
const { getDnbHierarchy } = require('./repos')

function removeCurrentCompany(dunsNumber, { count, results }) {
  if (results.find((c) => c.duns_number !== dunsNumber)) {
    return {
      count: count > 0 ? count - 1 : 0,
      results: results.filter((c) => c.duns_number !== dunsNumber),
    }
  }

  // istanbul ignore next: Covered by functional tests
  return { count, results }
}

async function fetchDnbHierarchyHandler(req, res, next) {
  try {
    const { company } = res.locals
    const { page } = req.query

    const { count, results } = removeCurrentCompany(
      company.duns_number,
      await getDnbHierarchy(
        req,
        company.global_ultimate_duns_number,
        config.paginationDefaultSize,
        page
      )
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
  fetchDnbHierarchyHandler,
}
