import CompaniesCollectionList from './modules/Companies/CollectionList'
import ContactsCollectionList from './modules/Contacts/CollectionList'
import EventsCollectionList from './modules/Events/CollectionList'
import EventDetails from './modules/Events/EventDetails'
import EventAventriDetails from './modules/Events/EventAventriDetails'
import EventAventriAttendees from './modules/Events/EventAventriAttendees'
import EventForm from './modules/Events/EventForm'
import InteractionsCollectionList from './modules/Interactions/CollectionList'
import OmisCollectionList from './modules/Omis/CollectionList'
import {
  RemindersSettings,
  EstimatedLandDateForm,
  NoRecentInteractionForm,
  EstimatedLandDateReminders,
  NoRecentInteractionReminders,
  OutstandingPropositionReminders,
} from './modules/Reminders'

const routes = {
  companies: [
    {
      path: '/companies',
      module: 'datahub:companies',
      component: CompaniesCollectionList,
    },
  ],
  contacts: [
    {
      path: '/contacts',
      module: 'datahub:contacts',
      component: ContactsCollectionList,
    },
  ],
  events: [
    {
      path: '/events',
      module: 'datahub:events',
      component: EventsCollectionList,
    },
    {
      path: '/events/create',
      module: 'datahub:events',
      component: EventForm,
    },
    {
      path: '/events/:id/edit',
      module: 'datahub:events',
      component: EventForm,
    },
    {
      path: '/events/:id/details',
      module: 'datahub:events',
      component: EventDetails,
    },
    {
      path: '/events/aventri/:aventriEventId/details',
      module: 'datahub:events',
      component: EventAventriDetails,
    },
    {
      path: '/events/aventri/:aventriEventId/attendees',
      module: 'datahub:events',
      component: EventAventriAttendees,
    },
  ],
  interactions: [
    {
      path: '/interactions',
      module: 'datahub:interactions',
      component: InteractionsCollectionList,
    },
  ],
  orders: [
    {
      path: '/omis',
      module: 'datahub:orders',
      component: OmisCollectionList,
    },
  ],
  reminders: [
    {
      path: '/reminders',
      module: 'datahub:companies',
      redirect: '/reminders/estimated-land-date',
    },
    {
      path: '/reminders/estimated-land-date',
      module: 'datahub:companies',
      component: EstimatedLandDateReminders,
    },
    {
      path: '/reminders/no-recent-interaction',
      module: 'datahub:companies',
      component: NoRecentInteractionReminders,
    },
    {
      path: '/reminders/outstanding-propositions',
      module: 'datahub:companies',
      component: OutstandingPropositionReminders,
    },
    {
      path: '/reminders/settings',
      module: 'datahub:companies',
      component: RemindersSettings,
    },
    {
      path: '/reminders/settings/estimated-land-date',
      module: 'datahub:companies',
      component: EstimatedLandDateForm,
    },
    {
      path: '/reminders/settings/no-recent-interaction',
      module: 'datahub:companies',
      component: NoRecentInteractionForm,
    },
  ],
}

export default routes
