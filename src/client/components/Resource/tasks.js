import Contact from './Contact'
import Company from './Company'
import Countries from './Countries'
import Interactions from './Interactions'
import Opportunity from './Opportunity'
import OpportunityStatuses from './OpportunityStatuses'
import Investment from './Investment'

export default {
  ...Company.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
  ...Opportunity.tasks,
  ...OpportunityStatuses.tasks,
  ...Investment.tasks,
}
