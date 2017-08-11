const { get } = require('lodash')

const metadata = require('../../../lib/metadata')
const { isValidGuid } = require('../../../lib/controller-utils')
const { getDitCompany } = require('../../companies/repos')
const { getInteraction } = require('../../interactions/repos')
const { getAdviser } = require('../../adviser/repos')
const { transformFromApi } = require('../../interactions/services/formatting')
const { buildCompanyUrl } = require('../../companies/services/data')
const { getInvestment } = require('../repos')
const { transformFieldsObjectToMacrosObject } = require('../../transformers')

function getNextStage (currentStage, projectStages) {
  const projectStageIndex = projectStages.findIndex((projectStage) => {
    return projectStage.name.toLowerCase() === currentStage.toLowerCase()
  })
  return projectStages[projectStageIndex + 1]
}

function getCompanyDetails (req, res, next) {
  getDitCompany(req.session.token, req.params.companyId)
    .then((company) => {
      res.locals.company = company
      return next()
    })
    .catch(next)
}

async function getInvestmentDetails (req, res, next, id = req.params.id) {
  if (!isValidGuid(id)) {
    return next()
  }
  try {
    const investmentProjectStages = metadata.investmentProjectStage
    const investmentData = await getInvestment(req.session.token, req.params.id)
    const investorCompany = await getDitCompany(req.session.token, get(investmentData, 'investor_company.id'))
    const ukCompanyId = get(investmentData, 'uk_company.id')

    investmentData.investor_company = Object.assign({}, investmentData.investor_company, investorCompany)

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req.session.token, ukCompanyId)
      investmentData.uk_company = Object.assign({}, investmentData.uk_company, companyDetails)
    }

    const clientRelationshipManager = await getAdviser(req.session.token, investmentData.client_relationship_manager.id)
    investmentData.client_relationship_manager = clientRelationshipManager

    res.locals.investmentData = investmentData
    res.locals.equityCompany = investmentData.investor_company
    res.locals.investmentProjectStages = investmentProjectStages.map((stage) => stage.name)

    res.locals.investmentStatus = {
      id: investmentData.id,
      meta: transformFieldsObjectToMacrosObject([
        {
          label: 'Project code',
          value: investmentData.project_code,
        },
        {
          label: 'Valuation',
          value: investmentData.value_complete ? 'Project valued' : 'Not yet valued',
        },
      ], {
        macroName: 'MetaItem',
      }),
      company: {
        name: investmentData.investor_company.name,
        url: buildCompanyUrl(investmentData.investor_company),
      },
      currentStage: {
        name: investmentData.stage.name,
        isComplete: investmentData.team_complete && investmentData.requirements_complete && investmentData.value_complete,
      },
      nextStage: getNextStage(investmentData.stage.name, investmentProjectStages),
    }

    res.breadcrumb({
      name: investmentData.name,
      url: `/investment-projects/${investmentData.id}`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

async function getInteractionDetails (req, res, next, interactionId = req.params.interactionId) {
  if (!isValidGuid(interactionId)) {
    return next()
  }
  try {
    const interactionResponse = await getInteraction(req.session.token, interactionId)

    res.locals.interaction = transformFromApi(interactionResponse)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyDetails,
  getInvestmentDetails,
  getInteractionDetails,
}
