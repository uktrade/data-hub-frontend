const qs = require('querystring')
const { merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME
const MAX_EXPORT_ITEMS = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS

function hasExportPermission (userPermissions) {
  return userPermissions.includes('investment.export_investmentproject')
}

function tooManyItems (resultCount) {
  return resultCount > MAX_EXPORT_ITEMS
}

function buildExportMessage (resultCount) {
  if (tooManyItems(resultCount)) {
    return `Filter to less than ${MAX_EXPORT_ITEMS} projects to download`
  }
  return `You can now download these ${resultCount} projects`
}

function buildExportAction (userPermissions, queryString) {
  if (!hasExportPermission(userPermissions)) {
    return {
      enabled: false,
    }
  }
  return {
    enabled: true,
    buildMessage: (count) => buildExportMessage(count),
    url: 'investment-projects' + queryString,
    tooManyItems,
  }
}

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
    const exportAction = await buildExportAction(user.permissions, '/export?' + qs.stringify(req.query))

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
