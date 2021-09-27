import Contact from './Contact'
import Company from './Company'
import Countries from './Countries'
import Interactions from './Interactions'

export default {
  ...Company.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
}
