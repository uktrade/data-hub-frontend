const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformCompanyToSubsidiaryListItem } = require('../transformers')
const { getCompanySubsidiaries } = require('../repos')
const { companyDetailsLabels } = require('../labels')
const { ENTITIES } = require('../../search/constants')

async function renderSubsidiaries (req, res, next) {
  try {
    const token = req.session.token
    const query = req.query
    const page = query.page || '1'

    const {
      id: companyId,
      name: companyName,
    } = res.locals.company

    const actionButtons = [{
      label: companyDetailsLabels.link_a_subsidiary,
      url: `/companies/${companyId}/subsidiaries/link`,
    }]

    const subsidiaryCollection = await getCompanySubsidiaries(token, companyId, page)
      .then(transformApiResponseToSearchCollection(
        { query },
        ENTITIES,
        transformCompanyToSubsidiaryListItem,
      ))

    const subsidiaries = {
      ...subsidiaryCollection,
      actionButtons,
      countLabel: 'subsidiary',
    }

    return res
      .breadcrumb(companyName, `/companies/${companyId}`)
      .breadcrumb(companyDetailsLabels.subsidiaries)
      .render('companies/views/subsidiaries.njk', { subsidiaries })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderSubsidiaries,
}
