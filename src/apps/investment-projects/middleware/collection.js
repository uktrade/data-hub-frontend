const { get, pick, pickBy } = require('lodash')

const { buildPagination } = require('../../../lib/pagination')
const metadataRepo = require('../../../lib/metadata')
const { collectionFilterLabels } = require('../labels')
const {
  transformInvestmentProjectToListItem,
} = require('../transformers')

const { searchInvestmentProjects } = require('../../search/services')
const { transformObjectToOption } = require('../../transformers')

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

function augmentProjectListItem (listItem) {
  listItem.meta.forEach(metaItem => {
    const name = metaItem.name
    const itemQuery = { custom: true, [name]: get(metaItem, 'value.id', metaItem.value) }
    const isLink = !metaItem.isInert

    if (isLink) {
      metaItem.url = this.locals.buildQuery({ include: itemQuery })
      metaItem.isSelected = get(this.locals, `form.data.filters.${name}`, false)
    }
  })
  return listItem
}

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

function getInvestmentFilters (req, res, next) {
  const formOptions = {
    stage: metadataRepo.investmentStageOptions.map(transformObjectToOption),
    investment_type: metadataRepo.investmentTypeOptions.map(transformObjectToOption),
    sector: metadataRepo.sectorOptions.map(transformObjectToOption),
    sortby: SORTBY_OPTIONS,
  }

  const query = pickBy(req.query)
  const selectedSortingQuery = pick(query, ['sortby'])
  const selectedFiltersQuery = pick(query, [
    'stage',
    'sector',
    'investment_type',
    'investor_company',
    'estimated_land_date_before',
    'estimated_land_date_after',
  ])

  const selectedFiltersHumanised = Object.keys(selectedFiltersQuery).reduce((filtersObj, filterName) => {
    const options = get(formOptions, filterName, [])
    const label = collectionFilterLabels.edit[filterName] || filterName
    let value = selectedFiltersQuery[filterName]

    if (options.length) {
      const option = options.find(x => x.value === value)
      if (!option) { return }
      value = option.label
    }

    filtersObj[filterName] = {
      value,
      label,
    }

    return filtersObj
  }, {})

  res.locals = Object.assign({}, res.locals, {
    selectedFiltersHumanised,
    form: {
      data: {
        filters: selectedFiltersQuery,
        sorting: selectedSortingQuery,
      },
      options: formOptions,
      labels: collectionFilterLabels.edit,
    },
  })

  next()
}

async function getInvestmentProjectsCollection (req, res, next) {
  const page = parseInt(req.query.page, 10) || 1
  const formData = get(res, 'locals.form.data', {})
  const requestBody = Object.assign({}, formData.filters, formData.sorting)

  try {
    res.locals.results = await searchInvestmentProjects({ token: req.session.token, requestBody, limit: 10, page })
      .then(result => {
        result.items = result.items
          .map(transformInvestmentProjectToListItem)
          .map(augmentProjectListItem.bind(res))
        result.pagination = buildPagination(req, result)
        return result
      })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvestmentFilters,
  getInvestmentProjectsCollection,
  setDefaults,
}
