import CompaniesCollectionList from './modules/Companies/CollectionList'
import ContactsCollectionList from './modules/Contacts/CollectionList'
import EventsCollectionList from './modules/Events/CollectionList'
import EventDetails from './modules/Events/EventDetails'
import EventForm from './modules/Events/EventForm'
import InteractionsCollectionList from './modules/Interactions/CollectionList'
import OmisCollectionList from './modules/Omis/CollectionList'

const routes = {
  companies: [
    {
      path: '/companies',
      module: 'datahub:companies',
      element: CompaniesCollectionList,
    },
  ],
  contacts: [
    {
      path: '/contacts',
      module: 'datahub:contacts',
      element: ContactsCollectionList,
    },
  ],
  events: [
    {
      path: '/events',
      module: 'datahub:events',
      element: EventsCollectionList,
    },
    {
      path: '/events/create',
      module: 'datahub:events',
      element: EventForm,
    },
    {
      path: '/events/:id/edit',
      module: 'datahub:events',
      element: EventForm,
    },
    {
      path: '/events/:id/details',
      module: 'datahub:events',
      element: EventDetails,
    },
  ],
  interactions: [
    {
      path: '/interactions',
      module: 'datahub:interactions',
      element: InteractionsCollectionList,
    },
  ],
  orders: [
    {
      path: '/omis',
      module: 'datahub:orders',
      element: OmisCollectionList,
    },
  ],
}

export default routes
