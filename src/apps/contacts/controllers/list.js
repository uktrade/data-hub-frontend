const { get, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { contactFiltersFields, contactSortForm } = require('../macros')
const { getOptions } = require('../../../lib/options')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

async function renderContactList (req, res, next) {
  try {
    const token = req.session.token
    const queryString = QUERY_STRING
    const sortForm = merge({}, contactSortForm, {
      hiddenFields: omit(req.query, 'sortby'),
      children: [
        { value: req.query.sortby },
      ],
    })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })

    const filtersFields = contactFiltersFields({
      sectorOptions,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    res.render('_layouts/collection', {
      sortForm,
      filtersFields,
      selectedFilters,
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
