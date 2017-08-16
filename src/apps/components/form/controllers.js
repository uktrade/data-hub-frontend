const { globalFields, standardFormConfig, entitySearchConfig } = require('./macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { search, buildSearchEntityResultsData } = require('../../search/services')

async function getAggregationData (token, searchTerm) {
  if (!searchTerm) { return null }

  const results = await search({
    searchTerm,
    token,
    searchEntity: 'company',
  })

  return buildSearchEntityResultsData(results.aggregations)
}

async function renderFormElements (req, res) {
  const standardForm = buildFormWithStateAndErrors(standardFormConfig, req.body, {
    name: !req.body.name ? ['The name is not valid'] : null,
    firstName: !req.body.firstName ? ['Add first name pls'] : null,
    businessType: !req.body.businessType ? ['Select a business type'] : null,
    foreignOtherCompany: !req.body.foreignOtherCompany ? ['Select a foreign company'] : null,
  })

  const entitySearchForm = Object.assign(buildFormWithStateAndErrors(entitySearchConfig), { searchTerm: req.query.term })
  const entitySearchFormGlobal = Object.assign(
    {},
    buildFormWithStateAndErrors(entitySearchConfig),
    {
      modifier: 'global',
      aggregations: await getAggregationData(req.session.token, req.query.term),
    }
  )

  return res
    .breadcrumb('Form elements')
    .render('components/views/form', {
      macros: {
        globalFields,
        standardForm,
        entitySearchForm,
        entitySearchFormGlobal,
      },
      form: {
        state: req.body,
      },
    })
}

module.exports = {
  renderFormElements,
}
