import Advisers from './Advisers'
import Contact from './Contact'
import Company from './Company'
import CompanyContacts from './CompanyContacts'
import Countries from './Countries'
import Interactions from './Interactions'
import Opportunity from './Opportunity'
import OpportunityStatuses from './OpportunityStatuses'
import UKRegions from './UKRegions'
import CapitalInvestmentRequiredChecksConducted from './RequiredChecksConducted'
import ConstructionRisks from './ConstructionRisks'
import AssetClasses from './AssetClasses'
import OpportunityValueType from './OpportunityValueType'
import OrderAssignees from './OrderAssignees'
import OrderSubscribers from './OrderSubscribers'
import Investment from './Investment'
import ContactAuditHistory from './ContactAuditHistory'
import Interaction from './Interaction'
import Event from './Event'
import CompanyOneListTeam from './CompanyOneListTeam'
import ExportYears from './ExportYears'
import Sector from './Sector'
import ExportExperienceCategories from './ExportExperienceCategories'
import ExportExperience from './ExportExperience'
import LargeInvestorProfile from './LargeInvestorProfile'
import InvestorTypes from './InvestorTypes'
import DealTicketSizes from './DealTicketSizes'
import LargeCapitalInvestmentTypes from './LargeCapitalInvestmentTypes'
import TimeHorizons from './TimeHorizons'
import LargeCapitalInvestmentRestrictions from './LargeCapitalInvestmentRestrictions'
import DesiredDealRoles from './DesiredDealRoles'
import LargeCapitalInvestmentReturnRate from './LargeCapitalInvestmentReturnRate'
import LargeCapitalInvestmentEquityPercentages from './LargeCapitalInvestmentEquityPercentages'
import Proposition from './Proposition'
import PropositionEvidence from './PropositionEvidence'
import RelatedCompaniesCount from './RelatedCompaniesCount'

export default {
  ...Advisers.tasks,
  ...Company.tasks,
  ...CompanyContacts.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
  ...Opportunity.tasks,
  ...OpportunityStatuses.tasks,
  ...UKRegions.tasks,
  ...CapitalInvestmentRequiredChecksConducted.tasks,
  ...ConstructionRisks.tasks,
  ...AssetClasses.tasks,
  ...OpportunityValueType.tasks,
  ...OrderAssignees.tasks,
  ...OrderSubscribers.tasks,
  ...Investment.tasks,
  ...ContactAuditHistory.tasks,
  ...Interaction.tasks,
  ...Event.tasks,
  ...CompanyOneListTeam.tasks,
  ...ExportYears.tasks,
  ...Sector.tasks,
  ...ExportExperienceCategories.tasks,
  ...ExportExperience.tasks,
  ...LargeInvestorProfile.tasks,
  ...InvestorTypes.tasks,
  ...DealTicketSizes.tasks,
  ...LargeCapitalInvestmentTypes.tasks,
  ...TimeHorizons.tasks,
  ...LargeCapitalInvestmentRestrictions.tasks,
  ...DesiredDealRoles.tasks,
  ...LargeCapitalInvestmentReturnRate.tasks,
  ...LargeCapitalInvestmentEquityPercentages.tasks,
  ...Proposition.tasks,
  ...PropositionEvidence.tasks,
  ...RelatedCompaniesCount.tasks,
}
