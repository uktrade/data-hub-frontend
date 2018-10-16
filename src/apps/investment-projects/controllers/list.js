const qs = require('querystring')
const { merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

async function renderInvestmentList (req, res, next) {
  try {
    const { token, user } = req.session
    const currentAdviserId = user.id
    const queryString = QUERY_STRING
    const sortForm = merge({}, investmentSortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
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

    const exportOptions = {
      targetPermission: 'investment.export_investmentproject',
      urlFragment: 'investment-projects',
      maxItems: FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS,
      entityPlural: 'projects',
    }

    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    res.render('_layouts/collection', {
      sortForm,
      selectedFilters,
      exportAction,
      filtersFields: filtersFieldsWithSelectedOptions,
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
