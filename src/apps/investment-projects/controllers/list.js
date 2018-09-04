const { get, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities, buildDownloadFilterFields } = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

async function renderInvestmentList (req, res, next) {
  try {
    const token = req.session.token
    const queryString = QUERY_STRING
    const currentAdviserId = get(req.session, 'user.id')
    const sortForm = merge({}, investmentSortForm, {
      hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
      children: [
        { value: req.query.sortby },
      ],
    })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })

    const filtersFields = investmentFiltersFields({
      currentAdviserId,
      sectorOptions,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)
    const downloadFiltersFields = await buildDownloadFilterFields(token, filtersFieldsWithSelectedOptions)

    res.render('_layouts/collection', {
      sortForm,
      selectedFilters,
      filtersFields: filtersFieldsWithSelectedOptions,
      downloadFiltersFields: downloadFiltersFields,
      title: 'Investment Projects',
      countLabel: 'project',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInvestmentList,
}
