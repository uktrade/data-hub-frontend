const { search } = require('../search/services')

function handleFormPost (req, res, next) {
  res.locals.form = Object.assign({}, res.locals.form, {
    state: req.body,
    errors: {
      summary: 'Please correct the following errors:',
      messages: {
        name: ['The name is not valid'],
        country: ['Country is required'],
        averageSalary: ['Select an option'],
        foreignOtherCompany: ['Select a company type'],
      },
    },
  })

  next()
}

const defaultEntities = [
  {
    entity: 'company',
    text: 'Companies',
    count: 0,
  },
  {
    entity: 'contact',
    text: 'Contacts',
    count: 0,
  },
]

function buildSearchEntityResultsData (apiResponseEntities) {
  return defaultEntities.map((defaultEntity) => {
    return Object.assign(
      {},
      defaultEntity,
      apiResponseEntities.find((apiResponseEntity) => {
        return apiResponseEntity.entity === defaultEntity.entity
      })
    )
  })
}

async function handleEntitySearch (req, res, next) {
  const searchTerm = req.query.term
  const searchType = 'company'

  if (searchTerm) {
    const results = await search({
      token: req.session.token,
      searchTerm,
      searchType,
    })

    res.locals.entitySearch = Object.assign({}, res.locals.entitySearch, {
      searchEntityResultsData: buildSearchEntityResultsData(results.aggregations),
    })
  }
  next()
}

module.exports = {
  handleFormPost,
  handleEntitySearch,
}
