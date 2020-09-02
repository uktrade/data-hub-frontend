const qs = require('querystring')
const { get, merge, omit } = require('lodash')

const {
  buildSelectedFiltersSummary,
  buildFieldsWithSelectedEntities,
} = require('../../builders')
const { contactFiltersFields, contactSortForm } = require('../macros')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING =
  FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

const exportOptions = {
  targetPermission: 'company.export_contact',
  urlFragment: 'contacts',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'contact',
}

async function renderContactList(req, res, next) {
  try {
    const { user } = req.session
    const queryString = QUERY_STRING
    const sortForm = merge({}, contactSortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
      children: [{ value: req.query.sortby }],
    })

    const sectorOptions = await getOptions(req, SECTOR, { queryString })

    const filtersFields = contactFiltersFields({
      sectorOptions,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(
      req,
      filtersFields,
      req.query
    )
    const selectedFilters = await buildSelectedFiltersSummary(
      filtersFieldsWithSelectedOptions,
      req.query
    )

    const exportAction = await buildExportAction(
      qs.stringify(req.query),
      user.permissions,
      exportOptions
    )

    res.render('_layouts/collection', {
      sortForm,
      selectedFilters,
      exportAction,
      filtersFields: filtersFieldsWithSelectedOptions,
      title: 'Contacts',
      countLabel: 'contact',
      highlightTerm: get(selectedFilters, 'name.valueLabel'),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderContactList,
}
