const { get, omit, merge } = require('lodash')
const { companyFiltersFields, companySortForm } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.COMPANIES.SECTOR.NAME

async function renderCompanyList (req, res, next) {
  try {
    const token = req.session.token
    const queryString = QUERY_STRING
    const sortForm = merge({}, companySortForm, {
      hiddenFields: omit(req.query, 'sortby'),
      children: [
        { value: req.query.sortby },
      ],
    })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })

    const filtersFields = companyFiltersFields({
      sectorOptions,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    res.render('_layouts/collection', {
      sortForm,
      filtersFields,
      selectedFilters,
      title: 'Companies',
      countLabel: 'company',
      highlightTerm: get(selectedFilters, 'name.valueLabel'),
      actionButtons: [{
        label: 'Add company',
        url: '/companies/add-step-1',
      }],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCompanyList,
}
