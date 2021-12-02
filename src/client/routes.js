import CompaniesCollectionList from './modules/Companies/CollectionList'
import ContactsCollectionList from './modules/Contacts/CollectionList'
import EventsCollectionList from './modules/Events/CollectionList'
import InteractionsCollectionList from './modules/Interactions/CollectionList'
import OmisCollectionList from './modules/Omis/CollectionList'

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
}

export default routes
