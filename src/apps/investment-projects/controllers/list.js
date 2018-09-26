const { get, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities, buildFiltersValues } = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME
const MAX_EXPORT_ITEMS = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS

function hasExportPermission (userPermissions) {
  return userPermissions.includes('investment.export_investmentproject')
}

function buildExportAction (userPermissions, exportFiltersFields, queryString) {
  if (hasExportPermission(userPermissions)) {
    return {
      messages: {
        tooManyItems: 'Filter to ' + MAX_EXPORT_ITEMS + ' items to download',
        default: 'You can now download these records',
      },
      maxItems: MAX_EXPORT_ITEMS,
      enable: true,
      form: {
        action: 'investment-projects/export',
        hiddenFields: exportFiltersFields,
        query: queryString,
      },
    }
  } else {
    return {
      enable: false,
    }
  }
}

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
    const exportFiltersFields = await buildFiltersValues(filtersFieldsWithSelectedOptions)

    const userPermissions = get(res, 'locals.user.permissions')
    const exportAction = await buildExportAction(userPermissions, exportFiltersFields, queryString)

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
