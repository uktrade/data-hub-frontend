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
import PipelineItem from './PipelineItem'
import OrderAssignees from './OrderAssignees'
import OrderSubscribers from './OrderSubscribers'
import Investment from './Investment'
import ContactAuditHistory from './ContactAuditHistory'
import Interaction from './Interaction'
import Event from './Event'
import CompanyOneListTeam from './CompanyOneListTeam'

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
  ...PipelineItem.tasks,
  ...OrderAssignees.tasks,
  ...OrderSubscribers.tasks,
  ...Investment.tasks,
  ...ContactAuditHistory.tasks,
  ...Interaction.tasks,
  ...Event.tasks,
  ...CompanyOneListTeam.tasks,
}
