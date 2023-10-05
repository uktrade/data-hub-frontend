import likelihoodToLandJson from '../fixtures/metadata/likelihood-to-land.json' assert { type: 'json' };
import investmentInvestorTypeJson from '../fixtures/metadata/investment-investor-type.json' assert { type: 'json' };
import investmentInvolvementJson from '../fixtures/metadata/investment-involvement.json' assert { type: 'json' };
import investmentSpecificProgrammeJson from '../fixtures/metadata/investment-specific-programme.json' assert { type: 'json' };
import investmentProjectStageJson from '../fixtures/metadata/investment-project-stage.json' assert { type: 'json' };
import investmentBusinessActivityJson from '../fixtures/metadata/investment-business-activity.json' assert { type: 'json' };
import investmentTypeJson from '../fixtures/metadata/investment-type.json' assert { type: 'json' };
import investmentStrategicDriverJson from '../fixtures/metadata/investment-strategic-driver.json' assert { type: 'json' };
import exportExperienceCategoryJson from '../fixtures/metadata/export-experience-category.json' assert { type: 'json' };
import orderServiceTypeJson from '../fixtures/metadata/order-service-type.json' assert { type: 'json' };
import orderCancellationReasonJson from '../fixtures/metadata/order-cancellation-reason.json' assert { type: 'json' };
import omisMarketJson from '../fixtures/metadata/omis-market.json' assert { type: 'json' };
import fdiValueJson from '../fixtures/metadata/fdi-value.json' assert { type: 'json' };
import fdiTypeJson from '../fixtures/metadata/fdi-type.json' assert { type: 'json' };
import salaryRangeJson from '../fixtures/metadata/salary-range.json' assert { type: 'json' };
import turnoverJson from '../fixtures/metadata/turnover.json' assert { type: 'json' };
import sectorJson from '../fixtures/metadata/sector.json' assert { type: 'json' };
import sectorLte0Json from '../fixtures/metadata/sector-lte0.json' assert { type: 'json' };
import locationTypeJson from '../fixtures/metadata/location-type.json' assert { type: 'json' };
import eventTypeJson from '../fixtures/metadata/event-type.json' assert { type: 'json' };
import programmeJson from '../fixtures/metadata/programme.json' assert { type: 'json' };
import businessTypeJson from '../fixtures/metadata/business-type.json' assert { type: 'json' };
import evidenceTagJson from '../fixtures/metadata/evidence-tag.json' assert { type: 'json' };
import employeeRangeJson from '../fixtures/metadata/employee-range.json' assert { type: 'json' };
import countryJson from '../fixtures/metadata/country.json' assert { type: 'json' };
import ukRegionJson from '../fixtures/metadata/uk-region.json' assert { type: 'json' };
import administrativeAreaJson from '../fixtures/metadata/administrative-area.json' assert { type: 'json' };
import referralSourceWebsiteJson from '../fixtures/metadata/referral-source-website.json' assert { type: 'json' };
import referralSourceMarketingJson from '../fixtures/metadata/referral-source-marketing.json' assert { type: 'json' };
import referralSourceActivityJson from '../fixtures/metadata/referral-source-activity.json' assert { type: 'json' };
import headquarterTypeJson from '../fixtures/metadata/headquarter-type.json' assert { type: 'json' };
import serviceJson from '../fixtures/metadata/service.json' assert { type: 'json' };
import communicationChannelJson from '../fixtures/metadata/communication-channel.json' assert { type: 'json' };
import teamJson from '../fixtures/metadata/team.json' assert { type: 'json' };
import policyAreaJson from '../fixtures/metadata/policy-area.json' assert { type: 'json' };
import policyIssueTypeJson from '../fixtures/metadata/policy-issue-type.json' assert { type: 'json' };
import serviceDeliveryStatusJson from '../fixtures/metadata/service-delivery-status.json' assert { type: 'json' };
import capitalInvestmentInvestorTypeJson from '../fixtures/metadata/capital-investment-investor-type.json' assert { type: 'json' };
import capitalInvestmentRequiredChecksJson from '../fixtures/metadata/capital-investment-required-checks.json' assert { type: 'json' };
import capitalInvestmentDealTicketSizeJson from '../fixtures/metadata/capital-investment-deal-ticket-size.json' assert { type: 'json' };
import capitalInvestmentInvestmentTypesJson from '../fixtures/metadata/capital-investment-investment-types.json' assert { type: 'json' };
import capitalInvestmentMinimumReturnRateJson from '../fixtures/metadata/capital-investment-return-rate.json' assert { type: 'json' };
import capitalInvestmentTimeHorizonsJson from '../fixtures/metadata/capital-investment-time-horizons.json' assert { type: 'json' };
import capitalInvestmentRestrictionsJson from '../fixtures/metadata/capital-investment-restrictions.json' assert { type: 'json' };
import capitalInvestmentConstructionRisksJson from '../fixtures/metadata/capital-investment-construction-risks.json' assert { type: 'json' };
import capitalInvestmentEquityPercentageJson from '../fixtures/metadata/capital-investment-equity-percentage.json' assert { type: 'json' };
import capitalInvestmentDesiredDealRolesJson from '../fixtures/metadata/capital-investment-desired-deal-roles.json' assert { type: 'json' };
import capitalInvestmentAssetClassInterestJson from '../fixtures/metadata/capital-investment-asset-class-interest.json' assert { type: 'json' };
import oneListTierJson from '../fixtures/metadata/one-list-tier.json' assert { type: 'json' };

export const likelihoodToLand = function (req, res) {
  res.json(likelihoodToLandJson)
};

export const investmentInvestorType = function (req, res) {
  res.json(investmentInvestorTypeJson)
};

export const investmentSpecificProgramme = function (req, res) {
  res.json(investmentSpecificProgrammeJson)
};

export const investmentInvolvement = function (req, res) {
  res.json(investmentInvolvementJson)
};

export const investmentProjectStage = function (req, res) {
  res.json(investmentProjectStageJson)
};

export const investmentBusinessActivity = function (req, res) {
  res.json(investmentBusinessActivityJson)
};

export const investmentType = function (req, res) {
  res.json(investmentTypeJson)
};

export const investmentStrategicDriver = function (req, res) {
  res.json(investmentStrategicDriverJson)
};

export const exportExperienceCategory = function (req, res) {
  res.json(exportExperienceCategoryJson)
};

export const orderServiceType = function (req, res) {
  res.json(orderServiceTypeJson)
};

export const orderCancellationReason = function (req, res) {
  res.json(orderCancellationReasonJson)
};

export const omisMarket = function (req, res) {
  res.json(omisMarketJson)
};

export const fdiValue = function (req, res) {
  res.json(fdiValueJson)
};

export const fdiType = function (req, res) {
  res.json(fdiTypeJson)
};

export const salaryRange = function (req, res) {
  res.json(salaryRangeJson)
};

export const turnover = function (req, res) {
  res.json(turnoverJson)
};

export const sector = function (req, res) {
  if (req.query.level__lte === '0') {
    return res.json(sectorLte0Json)
  }
  res.json(sectorJson)
};

export const locationType = function (req, res) {
  res.json(locationTypeJson)
};

export const eventType = function (req, res) {
  res.json(eventTypeJson)
};

export const programme = function (req, res) {
  res.json(programmeJson)
};

export const businessType = function (req, res) {
  res.json(businessTypeJson)
};

export const evidenceTag = function (req, res) {
  res.json(evidenceTagJson)
};

export const employeeRange = function (req, res) {
  res.json(employeeRangeJson)
};

export const country = function (req, res) {
  res.json(countryJson)
};

export const ukRegion = function (req, res) {
  res.json(ukRegionJson)
};

export const administrativeArea = function (req, res) {
  res.json(administrativeAreaJson)
};

export const referralSourceWebsite = function (req, res) {
  res.json(referralSourceWebsiteJson)
};

export const referralSourceMarketing = function (req, res) {
  res.json(referralSourceMarketingJson)
};

export const referralSourceActivity = function (req, res) {
  res.json(referralSourceActivityJson)
};

export const headquarterType = function (req, res) {
  res.json(headquarterTypeJson)
};

export const service = function (req, res) {
  res.json(serviceJson)
};

export const communicationChannel = function (req, res) {
  res.json(communicationChannelJson)
};

export const team = function (req, res) {
  res.json(teamJson)
};

export const policyArea = function (req, res) {
  res.json(policyAreaJson)
};

export const policyIssueType = function (req, res) {
  res.json(policyIssueTypeJson)
};

export const serviceDeliveryStatus = function (req, res) {
  res.json(serviceDeliveryStatusJson)
};

export const capitalInvestmentInvestorType = function (req, res) {
  res.json(capitalInvestmentInvestorTypeJson)
};

export const capitalInvestmentRequiredChecks = function (req, res) {
  res.json(capitalInvestmentRequiredChecksJson)
};

export const capitalInvestmentDealTicketSize = function (req, res) {
  res.json(capitalInvestmentDealTicketSizeJson)
};

export const capitalInvestmentInvestmentTypes = function (req, res) {
  res.json(capitalInvestmentInvestmentTypesJson)
};

export const capitalInvestmentMinimumReturnRate = function (req, res) {
  res.json(capitalInvestmentMinimumReturnRateJson)
};

export const capitalInvestmentTimeHorizons = function (req, res) {
  res.json(capitalInvestmentTimeHorizonsJson)
};

export const capitalInvestmentRestrictions = function (req, res) {
  res.json(capitalInvestmentRestrictionsJson)
};

export const capitalInvestmentConstructionRisks = function (req, res) {
  res.json(capitalInvestmentConstructionRisksJson)
};

export const capitalInvestmentEquityPercentage = function (req, res) {
  res.json(capitalInvestmentEquityPercentageJson)
};

export const capitalInvestmentDesiredDealRoles = function (req, res) {
  res.json(capitalInvestmentDesiredDealRolesJson)
};

export const capitalInvestmentAssetClassInterest = function (req, res) {
  res.json(capitalInvestmentAssetClassInterestJson)
};

export const oneListTier = function (req, res) {
  res.json(oneListTierJson)
};
