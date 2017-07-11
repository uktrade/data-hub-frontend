const { get, pick, pickBy, omit } = require('lodash')

const { buildPagination } = require('../../../lib/pagination')
const { buildQueryString } = require('../../../lib/url-helpers')
const metadataRepo = require('../../../lib/metadata')
const { collectionFilterLabels } = require('../labels')

const { searchInvestmentProjects } = require('../../search/services')

function transformMetadataToOption (item) {
  return {
    value: item.id,
    label: item.name,
  }
}

const currentYear = (new Date()).getFullYear()
const RANGE_FROM_DATE = `${currentYear}-04-05`
const RANGE_TO_DATE = `${currentYear + 1}-04-06`

const SORTBY_OPTIONS = [
  { value: 'estimated_land_date:asc', label: 'Estimated land date: nearest first' },
  { value: 'estimated_land_date:desc', label: 'Estimated land date: latest first' },
  { value: 'name:asc', label: 'Project name' },
  { value: 'stage.name', label: 'Stage' },
  { value: 'total_investment:desc', label: 'Investment value: high to low' },
  { value: 'total_investment:asc', label: 'Investment value: low to high' },
]

function setDefaults (req, res, next) {
  req.query = Object.assign({}, {
    sortby: SORTBY_OPTIONS[0].value,
  }, req.query)

  if (!req.query.custom) {
    req.query = Object.assign({}, {
      estimated_land_date_after: RANGE_FROM_DATE,
      estimated_land_date_before: RANGE_TO_DATE,
    }, req.query)
  }
  next()
}

async function getInvestmentProjectsCollection (req, res, next) {
  const formOptions = {
    stage: metadataRepo.investmentStageOptions.map(transformMetadataToOption),
    investment_type: metadataRepo.investmentTypeOptions.map(transformMetadataToOption),
    sector: metadataRepo.sectorOptions.map(transformMetadataToOption),
    sortby: SORTBY_OPTIONS,
  }

  const query = pickBy(req.query)
  const page = parseInt(query.page, 10) || 1
  const selectedSorting = pick(query, ['sortby'])
  const selectedFilters = pick(query, [
    'stage',
    'sector',
    'investment_type',
    'investor_company',
    'estimated_land_date_before',
    'estimated_land_date_after',
  ])

  const requestBody = Object.assign({}, selectedFilters, selectedSorting)

  res.locals = Object.assign({}, res.locals, {
    findFilter (filterName, filterValue) {
      const options = get(formOptions, filterName, [])
      const result = {
        value: filterValue,
        label: get(res.locals, `form.labels.${filterName}`, filterName),
      }

      if (options.length) {
        const optionValue = options.find(x => x.value === filterValue)
        if (!optionValue) { return }
        result.value = optionValue.label
      }
      return result
    },

    buildUrlWithoutFilters (...names) {
      return buildQueryString(
        Object.assign(
          { custom: true },
          omit(requestBody, [...names], 'page'),
        )
      )
    },

    buildUrlWithFilters (filtersObj) {
      return buildQueryString(
        Object.assign(
          { custom: true },
          omit(requestBody, 'page'),
          filtersObj,
        ),
      )
    },

    form: {
      data: {
        filters: selectedFilters,
        sorting: selectedSorting,
      },
      options: formOptions,
      labels: collectionFilterLabels.edit,
    },
  })

  try {
    res.locals.results = await searchInvestmentProjects({ token: req.session.token, requestBody, limit: 20, page })
      .then(result => {
        result.pagination = buildPagination(req, result)
        return result
      })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvestmentProjectsCollection,
  setDefaults,
}
