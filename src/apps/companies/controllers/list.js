const qs = require('querystring')
const { get, omit, merge } = require('lodash')
const { companyFiltersFields, companySortForm } = require('../macros')
const {
  buildSelectedFiltersSummary,
  buildFieldsWithSelectedEntities,
} = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.COMPANIES.SECTOR.NAME

const exportOptions = {
  targetPermission: 'company.export_company',
  urlFragment: 'companies',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'company',
}

async function renderCompanyList(req, res, next) {
  try {
    const { user } = req.session
    const queryString = QUERY_STRING
    const sortForm = merge({}, companySortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
      children: [{ value: req.query.sortby }],
    })

    const sectorOptions = await getOptions(req, SECTOR, { queryString })

    const filtersFields = companyFiltersFields({
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
      filtersFields: filtersFieldsWithSelectedOptions,
      selectedFilters,
      exportAction,
      title: 'Companies',
      countLabel: 'company',
      highlightTerm: get(selectedFilters, 'name.valueLabel'),
      actionButtons: [
        {
          label: 'Add company',
          url: '/companies/create',
        },
      ],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCompanyList,
}
