const { omit, merge } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../../builders')
const { getOptions } = require('../../../../lib/options')
const { omisFiltersFields, collectionSortForm } = require('./macros')

/**
 * Fetches the options required for the filter form,
 * including a flat version of the sector list
 *
 */
async function getFormOptions (token) {
  const omisMarketOptions = await getOptions(token, 'omis-market')
  const regionOptions = await getOptions(token, 'uk-region')
  const sectorOptions = await getOptions(token, 'sector', { queryString: '?level__lte=0' })

  return {
    omisMarketOptions,
    regionOptions,
    sectorOptions,
  }
}

/**
 * Accepts the current request query object and session token
 * and builds a filter form by fetching the request options and passing
 * them into a form builder then marking the selected options based on the
 * request query
 *
 */
async function getFiltersFields (token, query) {
  const { omisMarketOptions, regionOptions, sectorOptions } = await getFormOptions(token)
  const filtersFields = omisFiltersFields({ omisMarketOptions, regionOptions, sectorOptions })
  const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, query)

  return filtersFieldsWithSelectedOptions
}

/**
 * Builds the sort form dropdown for the collection
 */
function getSortForm (query) {
  return merge({}, collectionSortForm, {
    hiddenFields: {
      ...omit(query, 'sortby'),
    },
    children: [
      { value: query.sortby },
    ],
  })
}

/**
 *  List controller for omis. Gets a sort dropdown, filter form and renders the page
 */
async function renderList (req, res, next) {
  try {
    const token = req.session.token
    const query = req.query

    const sortForm = getSortForm(query)
    const filtersFields = await getFiltersFields(token, query)
    const selectedFilters = buildSelectedFiltersSummary(filtersFields, query)

    res.render('_layouts/collection', {
      sortForm,
      selectedFilters,
      filtersFields,
      countLabel: 'order',
      actionButtons: [{
        label: 'Add order',
        url: '/omis/create',
      }],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderList,
}
