import likelihoodToLand from '../fixtures/metadata/likelihood-to-land.json' with { type: 'json' }
import investmentInvestorType from '../fixtures/metadata/investment-investor-type.json' with { type: 'json' }
import investmentInvolvement from '../fixtures/metadata/investment-involvement.json' with { type: 'json' }
import investmentSpecificProgramme from '../fixtures/metadata/investment-specific-programme.json' with { type: 'json' }
import investmentProjectStage from '../fixtures/metadata/investment-project-stage.json' with { type: 'json' }
import investmentBusinessActivity from '../fixtures/metadata/investment-business-activity.json' with { type: 'json' }
import investmentType from '../fixtures/metadata/investment-type.json' with { type: 'json' }
import investmentStrategicDriver from '../fixtures/metadata/investment-strategic-driver.json' with { type: 'json' }
import exportExperienceCategory from '../fixtures/metadata/export-experience-category.json' with { type: 'json' }
import orderServiceType from '../fixtures/metadata/order-service-type.json' with { type: 'json' }
import orderCancellationReason from '../fixtures/metadata/order-cancellation-reason.json' with { type: 'json' }
import omisMarket from '../fixtures/metadata/omis-market.json' with { type: 'json' }
import fdiValue from '../fixtures/metadata/fdi-value.json' with { type: 'json' }
import fdiType from '../fixtures/metadata/fdi-type.json' with { type: 'json' }
import salaryRange from '../fixtures/metadata/salary-range.json' with { type: 'json' }
import turnover from '../fixtures/metadata/turnover.json' with { type: 'json' }
import sector from '../fixtures/metadata/sector.json' with { type: 'json' }
import sectorLte0 from '../fixtures/metadata/sector-lte0.json' with { type: 'json' }
import locationType from '../fixtures/metadata/location-type.json' with { type: 'json' }
import eventType from '../fixtures/metadata/event-type.json' with { type: 'json' }
import programme from '../fixtures/metadata/programme.json' with { type: 'json' }
import businessType from '../fixtures/metadata/business-type.json' with { type: 'json' }
import evidenceTag from '../fixtures/metadata/evidence-tag.json' with { type: 'json' }
import employeeRange from '../fixtures/metadata/employee-range.json' with { type: 'json' }
import country from '../fixtures/metadata/country.json' with { type: 'json' }
import ukRegion from '../fixtures/metadata/uk-region.json' with { type: 'json' }
import administrativeArea from '../fixtures/metadata/administrative-area.json' with { type: 'json' }
import referralSourceWebsite from '../fixtures/metadata/referral-source-website.json' with { type: 'json' }
import referralSourceMarketing from '../fixtures/metadata/referral-source-marketing.json' with { type: 'json' }
import referralSourceActivity from '../fixtures/metadata/referral-source-activity.json' with { type: 'json' }
import headquarterType from '../fixtures/metadata/headquarter-type.json' with { type: 'json' }
import service from '../fixtures/metadata/service.json' with { type: 'json' }
import communicationChannel from '../fixtures/metadata/communication-channel.json' with { type: 'json' }
import team from '../fixtures/metadata/team.json' with { type: 'json' }
import policyArea from '../fixtures/metadata/policy-area.json' with { type: 'json' }
import policyIssueType from '../fixtures/metadata/policy-issue-type.json' with { type: 'json' }
import serviceDeliveryStatus from '../fixtures/metadata/service-delivery-status.json' with { type: 'json' }
import capitalInvestmentInvestorType from '../fixtures/metadata/capital-investment-investor-type.json' with { type: 'json' }
import capitalInvestmentRequiredChecks from '../fixtures/metadata/capital-investment-required-checks.json' with { type: 'json' }
import capitalInvestmentDealTicketSize from '../fixtures/metadata/capital-investment-deal-ticket-size.json' with { type: 'json' }
import capitalInvestmentInvestmentTypes from '../fixtures/metadata/capital-investment-investment-types.json' with { type: 'json' }
import capitalInvestmentMinimumReturnRate from '../fixtures/metadata/capital-investment-return-rate.json' with { type: 'json' }
import capitalInvestmentTimeHorizons from '../fixtures/metadata/capital-investment-time-horizons.json' with { type: 'json' }
import capitalInvestmentRestrictions from '../fixtures/metadata/capital-investment-restrictions.json' with { type: 'json' }
import capitalInvestmentConstructionRisks from '../fixtures/metadata/capital-investment-construction-risks.json' with { type: 'json' }
import capitalInvestmentEquityPercentage from '../fixtures/metadata/capital-investment-equity-percentage.json' with { type: 'json' }
import capitalInvestmentDesiredDealRoles from '../fixtures/metadata/capital-investment-desired-deal-roles.json' with { type: 'json' }
import capitalInvestmentAssetClassInterest from '../fixtures/metadata/capital-investment-asset-class-interest.json' with { type: 'json' }
import oneListTier from '../fixtures/metadata/one-list-tier.json' with { type: 'json' }

export const getLikelihoodToLand = function (req, res) {
  res.json(likelihoodToLand)
}

export const getInvestmentInvestorType = function (req, res) {
  res.json(investmentInvestorType)
}

export const getInvestmentSpecificProgramme = function (req, res) {
  res.json(investmentSpecificProgramme)
}

export const getInvestmentInvolvement = function (req, res) {
  res.json(investmentInvolvement)
}

export const getInvestmentProjectStage = function (req, res) {
  res.json(investmentProjectStage)
}

export const getInvestmentBusinessActivity = function (req, res) {
  res.json(investmentBusinessActivity)
}

export const getInvestmentType = function (req, res) {
  res.json(investmentType)
}

export const getInvestmentStrategicDriver = function (req, res) {
  res.json(investmentStrategicDriver)
}

export const getExportExperienceCategory = function (req, res) {
  res.json(exportExperienceCategory)
}

export const getOrderServiceType = function (req, res) {
  res.json(orderServiceType)
}

export const getOrderCancellationReason = function (req, res) {
  res.json(orderCancellationReason)
}

export const getOmisMarket = function (req, res) {
  res.json(omisMarket)
}

export const getFdiValue = function (req, res) {
  res.json(fdiValue)
}

export const getFdiType = function (req, res) {
  res.json(fdiType)
}

export const getSalaryRange = function (req, res) {
  res.json(salaryRange)
}

export const getTurnover = function (req, res) {
  res.json(turnover)
}

export const getSector = function (req, res) {
  if (req.query.level__lte === '0') {
    return res.json(sectorLte0)
  }
  res.json(sector)
}

export const getLocationType = function (req, res) {
  res.json(locationType)
}

export const getEventType = function (req, res) {
  res.json(eventType)
}

export const getProgramme = function (req, res) {
  res.json(programme)
}

export const getBusinessType = function (req, res) {
  res.json(businessType)
}

export const getEvidenceTag = function (req, res) {
  res.json(evidenceTag)
}

export const getEmployeeRange = function (req, res) {
  res.json(employeeRange)
}

export const getCountry = function (req, res) {
  res.json(country)
}

export const getUkRegion = function (req, res) {
  res.json(ukRegion)
}

export const getAdministrativeArea = function (req, res) {
  res.json(administrativeArea)
}

export const getReferralSourceWebsite = function (req, res) {
  res.json(referralSourceWebsite)
}

export const getReferralSourceMarketing = function (req, res) {
  res.json(referralSourceMarketing)
}

export const getReferralSourceActivity = function (req, res) {
  res.json(referralSourceActivity)
}

export const getHeadquarterType = function (req, res) {
  res.json(headquarterType)
}

export const getService = function (req, res) {
  res.json(service)
}

export const getCommunicationChannel = function (req, res) {
  res.json(communicationChannel)
}

export const getTeam = function (req, res) {
  res.json(team)
}

export const getPolicyArea = function (req, res) {
  res.json(policyArea)
}

export const getPolicyIssueType = function (req, res) {
  res.json(policyIssueType)
}

export const getServiceDeliveryStatus = function (req, res) {
  res.json(serviceDeliveryStatus)
}

export const getCapitalInvestmentInvestorType = function (req, res) {
  res.json(capitalInvestmentInvestorType)
}

export const getCapitalInvestmentRequiredChecks = function (req, res) {
  res.json(capitalInvestmentRequiredChecks)
}

export const getCapitalInvestmentDealTicketSize = function (req, res) {
  res.json(capitalInvestmentDealTicketSize)
}

export const getCapitalInvestmentInvestmentTypes = function (req, res) {
  res.json(capitalInvestmentInvestmentTypes)
}

export const getCapitalInvestmentMinimumReturnRate = function (req, res) {
  res.json(capitalInvestmentMinimumReturnRate)
}

export const getCapitalInvestmentTimeHorizons = function (req, res) {
  res.json(capitalInvestmentTimeHorizons)
}

export const getCapitalInvestmentRestrictions = function (req, res) {
  res.json(capitalInvestmentRestrictions)
}

export const getCapitalInvestmentConstructionRisks = function (req, res) {
  res.json(capitalInvestmentConstructionRisks)
}

export const getCapitalInvestmentEquityPercentage = function (req, res) {
  res.json(capitalInvestmentEquityPercentage)
}

export const getCapitalInvestmentDesiredDealRoles = function (req, res) {
  res.json(capitalInvestmentDesiredDealRoles)
}

export const getCapitalInvestmentAssetClassInterest = function (req, res) {
  res.json(capitalInvestmentAssetClassInterest)
}

export const getOneListTier = function (req, res) {
  res.json(oneListTier)
}
