import AssociatedProgramme from './AssociatedProgramme'
import BreakdownType from './BreakdownType'
import BusinessPotential from './BusinessPotential'
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
import ExportWins from './ExportWins'
import Sector from './Sector'
import Export from './Export'
import ExpectedValueRelation from './ExpectedValueRelation'
import Experience from './Experience'
import ExperienceCategories from './ExperienceCategories'
import ExportExperienceCategories from './ExportExperienceCategories'
import ExportExperience from './ExportExperience'
import LargeInvestorProfile from './LargeInvestorProfile'
import HQTeamRegionOrPost from './HQTeamRegionOrPost'
import HvoProgramme from './HvoProgramme'
import Hvc from './Hvc'
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
import ReferralSourceActivity from './ReferralSourceActivity'
import LikelihoodToLand from './LikelihoodToLand'
import LevelOfInvolvement from './LevelOfInvolvement'
import MarketingSource from './MarketingSource'
import InvestmentInvestorTypes from './InvestmentInvestorTypes'
import SpecificInvestmentProgrammes from './SpecificInvestmentProgrammes'
import InvestmentTypes from './InvestmentTypes'
import FDITypes from './FDITypes'
import BusinessActivities from './BusinessActivities'
import Rating from './Rating'
import ReferralSourceMarketing from './ReferralSourceMarketing'
import ReferralSourceWebsite from './ReferralSourceWebsite'
import RelatedCompaniesCount from './RelatedCompaniesCount'
import StrategicDrivers from './StrategicDrivers'
import SupportType from './SupportType'
import DeliveryPartners from './DeliveryPartners'
import SalaryRanges from './SalaryRanges'
import FDIValues from './FDIValues'
import CompanyObjectives from './CompanyObjectives'
import ProjectStage from './ProjectStage'
import CompanyObjectivesCount from './CompanyObjectivesCount'
import Adviser from './Adviser'
import Propositions from './Propositions'
import InvestmentEvidence from './InvestmentEvidence'
import OneListTiers from './OneListTiers'
import ProjectDocument from './ProjectDocument'
import Order from './Order'
import Task from './Task'
import OrderServiceTypes from './OrderServiceTypes'
import InvestmentProjectTasks from './InvestmentProjectTasks'
import OrderInvoice from './OrderInvoice'
import OrderCancellationReasons from './OrderCancellationReasons'
import MyTasksDueDateApproachingSettings from './MyTasksDueDateApproachingSettings'
import TaskAssignedToMeFromOthersSettings from './TaskAssignedToMeFromOthersSettings'
import TaskOverdueSettings from './TaskOverdueSettings'
import TeamType from './TeamType'
import WinType from './WinType'
import WithoutOurSupport from './WithoutOurSupport'

export default {
  ...AssociatedProgramme.tasks,
  ...AssetClasses.tasks,
  ...BreakdownType.tasks,
  ...BusinessPotential.tasks,
  ...Company.tasks,
  ...CompanyContacts.tasks,
  ...CompanyOneListTeam.tasks,
  ...Contact.tasks,
  ...ContactAuditHistory.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
  ...Opportunity.tasks,
  ...OpportunityStatuses.tasks,
  ...CapitalInvestmentRequiredChecksConducted.tasks,
  ...ConstructionRisks.tasks,
  ...OpportunityValueType.tasks,
  ...OrderAssignees.tasks,
  ...OrderSubscribers.tasks,
  ...Investment.tasks,
  ...HQTeamRegionOrPost.tasks,
  ...HvoProgramme.tasks,
  ...Hvc.tasks,
  ...Interaction.tasks,
  ...ExpectedValueRelation.tasks,
  ...Experience.tasks,
  ...ExportExperience.tasks,
  ...ExperienceCategories.tasks,
  ...ExportExperienceCategories.tasks,
  ...Event.tasks,
  ...ExportYears.tasks,
  ...ExportWins.tasks,
  ...Sector.tasks,
  ...Export.tasks,
  ...LargeInvestorProfile.tasks,
  ...MarketingSource.tasks,
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
  ...ReferralSourceActivity.tasks,
  ...LikelihoodToLand.tasks,
  ...LevelOfInvolvement.tasks,
  ...InvestmentInvestorTypes.tasks,
  ...SpecificInvestmentProgrammes.tasks,
  ...InvestmentTypes.tasks,
  ...FDITypes.tasks,
  ...BusinessActivities.tasks,
  ...ReferralSourceMarketing.tasks,
  ...ReferralSourceWebsite.tasks,
  ...RelatedCompaniesCount.tasks,
  ...StrategicDrivers.tasks,
  ...DeliveryPartners.tasks,
  ...SalaryRanges.tasks,
  ...FDIValues.tasks,
  ...CompanyObjectives.tasks,
  ...ProjectStage.tasks,
  ...CompanyObjectivesCount.tasks,
  ...Adviser.tasks,
  ...Propositions.tasks,
  ...InvestmentEvidence.tasks,
  ...OneListTiers.tasks,
  ...ProjectDocument.tasks,
  ...Rating.tasks,
  ...Order.tasks,
  ...Task.tasks,
  ...SupportType.tasks,
  ...TeamType.tasks,
  ...OrderServiceTypes.tasks,
  ...InvestmentProjectTasks.tasks,
  ...OrderInvoice.tasks,
  ...OrderCancellationReasons.tasks,
  ...MyTasksDueDateApproachingSettings.tasks,
  ...TaskAssignedToMeFromOthersSettings.tasks,
  ...TaskOverdueSettings.tasks,
  ...UKRegions.tasks,
  ...WinType.tasks,
  ...WithoutOurSupport.tasks,
}
