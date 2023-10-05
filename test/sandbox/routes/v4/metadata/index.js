import likelihoodToLandJson from '../../../fixtures/v4/metadata/likelihood-to-land.json' assert { type: 'json' };
import investmentInvestorTypeJson from '../../../fixtures/v4/metadata/investment-investor-type.json' assert { type: 'json' };
import investmentInvolvementJson from '../../../fixtures/v4/metadata/investment-involvement.json' assert { type: 'json' };
import investmentSpecificProgrammeJson from '../../../fixtures/v4/metadata/investment-specific-programme.json' assert { type: 'json' };
import investmentProjectStageJson from '../../../fixtures/v4/metadata/investment-project-stage.json' assert { type: 'json' };
import investmentBusinessActivityJson from '../../../fixtures/v4/metadata/investment-business-activity.json' assert { type: 'json' };
import investmentTypeJson from '../../../fixtures/v4/metadata/investment-type.json' assert { type: 'json' };
import investmentStrategicDriverJson from '../../../fixtures/v4/metadata/investment-strategic-driver.json' assert { type: 'json' };
import investmentDeliveryPartnerJson from '../../../fixtures/v4/metadata/investment-delivery-partner.json' assert { type: 'json' };
import exportExperienceCategoryJson from '../../../fixtures/v4/metadata/export-experience-category.json' assert { type: 'json' };
import orderServiceTypeJson from '../../../fixtures/v4/metadata/order-service-type.json' assert { type: 'json' };
import orderCancellationReasonJson from '../../../fixtures/v4/metadata/order-cancellation-reason.json' assert { type: 'json' };
import omisMarketJson from '../../../fixtures/v4/metadata/omis-market.json' assert { type: 'json' };
import fdiValueJson from '../../../fixtures/v4/metadata/fdi-value.json' assert { type: 'json' };
import fdiTypeJson from '../../../fixtures/v4/metadata/fdi-type.json' assert { type: 'json' };
import salaryRangeJson from '../../../fixtures/v4/metadata/salary-range.json' assert { type: 'json' };
import turnoverJson from '../../../fixtures/v4/metadata/turnover.json' assert { type: 'json' };
import sectorJson from '../../../fixtures/v4/metadata/sector.json' assert { type: 'json' };
import sectorLte0Json from '../../../fixtures/v4/metadata/sector-lte0.json' assert { type: 'json' };
import locationTypeJson from '../../../fixtures/v4/metadata/location-type.json' assert { type: 'json' };
import eventTypeJson from '../../../fixtures/v4/metadata/event-type.json' assert { type: 'json' };
import programmeJson from '../../../fixtures/v4/metadata/programme.json' assert { type: 'json' };
import businessTypeJson from '../../../fixtures/v4/metadata/business-type.json' assert { type: 'json' };
import evidenceTagJson from '../../../fixtures/v4/metadata/evidence-tag.json' assert { type: 'json' };
import employeeRangeJson from '../../../fixtures/v4/metadata/employee-range.json' assert { type: 'json' };
import countryJson from '../../../fixtures/v4/metadata/country.json' assert { type: 'json' };
import ukRegionJson from '../../../fixtures/v4/metadata/uk-region.json' assert { type: 'json' };
import administrativeAreaJson from '../../../fixtures/v4/metadata/administrative-area.json' assert { type: 'json' };
import referralSourceWebsiteJson from '../../../fixtures/v4/metadata/referral-source-website.json' assert { type: 'json' };
import referralSourceMarketingJson from '../../../fixtures/v4/metadata/referral-source-marketing.json' assert { type: 'json' };
import referralSourceActivityJson from '../../../fixtures/v4/metadata/referral-source-activity.json' assert { type: 'json' };
import headquarterTypeJson from '../../../fixtures/v4/metadata/headquarter-type.json' assert { type: 'json' };
import serviceJson from '../../../fixtures/v4/metadata/service.json' assert { type: 'json' };
import communicationChannelJson from '../../../fixtures/v4/metadata/communication-channel.json' assert { type: 'json' };
import teamJson from '../../../fixtures/v4/metadata/team.json' assert { type: 'json' };
import policyAreaJson from '../../../fixtures/v4/metadata/policy-area.json' assert { type: 'json' };
import policyIssueTypeJson from '../../../fixtures/v4/metadata/policy-issue-type.json' assert { type: 'json' };
import exportBarrierJson from '../../../fixtures/v4/metadata/export-barrier.json' assert { type: 'json' };
import serviceDeliveryStatusJson from '../../../fixtures/v4/metadata/service-delivery-status.json' assert { type: 'json' };
import capitalInvestmentInvestorTypeJson from '../../../fixtures/v4/metadata/capital-investment-investor-type.json' assert { type: 'json' };
import capitalInvestmentRequiredChecksJson from '../../../fixtures/v4/metadata/capital-investment-required-checks.json' assert { type: 'json' };
import capitalInvestmentDealTicketSizeJson from '../../../fixtures/v4/metadata/capital-investment-deal-ticket-size.json' assert { type: 'json' };
import capitalInvestmentInvestmentTypesJson from '../../../fixtures/v4/metadata/capital-investment-investment-types.json' assert { type: 'json' };
import capitalInvestmentMinimumReturnRateJson from '../../../fixtures/v4/metadata/capital-investment-return-rate.json' assert { type: 'json' };
import capitalInvestmentTimeHorizonsJson from '../../../fixtures/v4/metadata/capital-investment-time-horizons.json' assert { type: 'json' };
import capitalInvestmentRestrictionsJson from '../../../fixtures/v4/metadata/capital-investment-restrictions.json' assert { type: 'json' };
import capitalInvestmentConstructionRisksJson from '../../../fixtures/v4/metadata/capital-investment-construction-risks.json' assert { type: 'json' };
import capitalInvestmentEquityPercentageJson from '../../../fixtures/v4/metadata/capital-investment-equity-percentage.json' assert { type: 'json' };
import capitalInvestmentDesiredDealRolesJson from '../../../fixtures/v4/metadata/capital-investment-desired-deal-roles.json' assert { type: 'json' };
import capitalInvestmentAssetClassInterestJson from '../../../fixtures/v4/metadata/capital-investment-asset-class-interest.json' assert { type: 'json' };
import capitalInvestmentValueTypesJson from '../../../fixtures/metadata/capital-investment-opportunity-value-types.json' assert { type: 'json' };
import capitalInvestmentStatusTypesJson from '../../../fixtures/metadata/capital-investment-opportunity-status-types.json' assert { type: 'json' };
import oneListTierJson from '../../../fixtures/v4/metadata/one-list-tier.json' assert { type: 'json' };
import tradeAgreementJson from '../../../fixtures/v4/metadata/trade-agreement.json' assert { type: 'json' };
import estimatedYearsJson from '../../../fixtures/v4/export/estimated-years.json' assert { type: 'json' };
import exportExperienceJson from '../../../fixtures/v4/export/export-experience.json' assert { type: 'json' };

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

export const investmentDeliveryPartner = function (req, res) {
  res.json(investmentDeliveryPartnerJson)
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
  res.json(
    req.query.country
      ? administrativeAreaJson.filter(
          ({ country }) => country.id == req.query.country
        )
      : administrativeAreaJson
  )
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

export const exportBarrier = function (req, res) {
  res.json(exportBarrierJson)
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

export const capitalInvestmentValueTypes = function (req, res) {
  res.json(capitalInvestmentValueTypesJson)
};

export const capitalInvestmentStatusTypes = function (req, res) {
  res.json(capitalInvestmentStatusTypesJson)
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
  res.json(capitalInvestmentTimeHorizons)
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

export const tradeAgreement = function (req, res) {
  res.json(tradeAgreementJson)
};

export const exportYears = function (req, res) {
  res.json(estimatedYearsJson)
};

export const exportExperience = function (req, res) {
  res.json(exportExperienceJson)
};
