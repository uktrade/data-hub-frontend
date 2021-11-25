import Advisers from './Advisers'
import Contact from './Contact'
import Company from './Company'
import Countries from './Countries'
import Interactions from './Interactions'
import Opportunity from './Opportunity'
import OpportunityStatuses from './OpportunityStatuses'

export default {
  ...Advisers.tasks,
  ...Company.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
  ...Opportunity.tasks,
  ...OpportunityStatuses.tasks,
}
