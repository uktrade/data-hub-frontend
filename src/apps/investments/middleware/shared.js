const { get, upperFirst } = require('lodash')

const { isValidGuid } = require('../../../lib/controller-utils')
const { getDitCompany } = require('../../companies/repos')
const { getAdviser } = require('../../adviser/repos')
const { getInvestment } = require('../repos')
const { companies, investments } = require('../../../lib/urls')
const {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../client/utils/date-utils')

function getCompanyDetails(req, res, next) {
  getDitCompany(req, req.params.companyId)
    .then((company) => {
      res.locals.company = company
      return next()
    })
    .catch(next)
}

async function getInvestmentDetails(req, res, next) {
  const investmentId = req.params.investmentId

  if (!isValidGuid(investmentId)) {
    return next()
  }
  try {
    const investment = await getInvestment(req, investmentId)
    const investorCompany = await getDitCompany(
      req,
      get(investment, 'investor_company.id')
    )
    const ukCompanyId = get(investment, 'uk_company.id')
    const clientRelationshipManagerId = get(
      investment,
      'client_relationship_manager.id'
    )
    const stageName = investment.stage.name

    investment.investor_company = Object.assign(
      {},
      investment.investor_company,
      investorCompany
    )

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req, ukCompanyId)
      investment.uk_company = Object.assign(
        {},
        investment.uk_company,
        companyDetails
      )
    }

    if (clientRelationshipManagerId) {
      const clientRelationshipManager = await getAdviser(
        req,
        clientRelationshipManagerId
      )
      investment.client_relationship_manager = clientRelationshipManager
    }

    res.locals.investment = investment
    res.locals.equityCompany = investment.investor_company

    res.locals.investmentStatus = {
      id: investment.id,
      meta: [
        {
          label: 'Status',
          value: upperFirst(investment.status),
          url: investments.projects.status(investment.id),
          urlLabel: 'change',
        },
        {
          label: 'Project code',
          value: investment.project_code,
        },
        {
          label: 'Valuation',
          value: investment.value_complete
            ? 'Project valued'
            : 'Not yet valued',
        },
        {
          label: 'Created on',
          value: formatDate(
            investment.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          ),
        },
        ...(investment.created_by?.dit_team?.name
          ? [
              {
                label: 'Created by',
                value: investment.created_by.dit_team.name,
              },
            ]
          : []),
      ],
      company: {
        name: investment.investor_company.name,
        url: companies.detail(investment.investor_company.id),
      },
      currentStage: {
        name: stageName,
      },
    }

    res
      .breadcrumb('Projects', investments.projects.index())
      .breadcrumb(investment.name, investments.projects.details(investment.id))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyDetails,
  getInvestmentDetails,
}
