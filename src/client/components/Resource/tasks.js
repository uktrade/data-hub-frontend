import Contact from './Contact'
import Company from './Company'
import Countries from './Countries'
import Interactions from './Interactions'
import Opportunity from './Opportunity'
import OpportunityStatuses from './OpportunityStatuses'
import UKRegions from './UKRegions'
import CapitalInvestmentRequiredChecksConducted from './RequiredChecksConducted'
import ConstructionRisks from './ConstructionRisks'
import AssetClasses from './AssetClasses'

export default {
  ...Company.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
  ...Opportunity.tasks,
  ...OpportunityStatuses.tasks,
  ...UKRegions.tasks,
  ...CapitalInvestmentRequiredChecksConducted.tasks,
  ...ConstructionRisks.tasks,
  ...AssetClasses.tasks,
}
