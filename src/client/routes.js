import CompaniesCollectionList from './modules/Companies/CollectionList'
import ContactsCollectionList from './modules/Contacts/CollectionList'
import EventsCollectionList from './modules/Events/CollectionList'
import EventDetails from './modules/Events/EventDetails'
import EventAventriDetails from './modules/Events/EventAventriDetails'
import EventForm from './modules/Events/EventForm'
import InteractionsCollectionList from './modules/Interactions/CollectionList'
import OmisCollectionList from './modules/Omis/CollectionList'
import ESSInteractionDetails from './modules/Interactions/ESSInteractionDetails'
import EventAventriRegistrationStatus from './modules/Events/EventAventriRegistrationStatus'
import Reminders from './modules/Reminders/Reminders'
import { RemindersForms, RemindersSettings } from './modules/Reminders'
import {
  ExportFormAdd,
  ExportFormEdit,
} from './modules/ExportPipeline/ExportForm'
import ExportFormDelete from './modules/ExportPipeline/ExportDelete'
import ExportDetails from './modules/ExportPipeline/ExportDetails'
import CompanyHierarchy from './modules/Companies/CompanyHierarchy'
import CompanyTree from './modules/Companies/CompanyHierarchy/CompanyTree'
import Strategy from './modules/Companies/AccountManagement/Strategy'
import EditProjectStatus from './modules/Investments/Projects/EditProjectStatus'

const routes = {
  companies: [
    {
      path: '/companies',
      module: 'datahub:companies',
      component: CompaniesCollectionList,
    },
    {
      path: '/companies/:companyId/dnb-hierarchy',
      module: 'datahub:companies',
      component: CompanyHierarchy,
    },
    {
      path: '/companies/:companyId/company-tree',
      module: 'datahub:companies',
      component: CompanyTree,
    },
    {
      path: '/companies/:companyId/account-management/strategy/create',
      module: 'datahub:companies',
      component: Strategy,
    },
    {
      path: '/companies/:companyId/account-management/strategy/edit',
      module: 'datahub:companies',
      component: Strategy,
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
      path: '/events/aventri/:aventriEventId/registration/:status',
      module: 'datahub:events',
      component: EventAventriRegistrationStatus,
    },
  ],
  interactions: [
    {
      path: '/interactions',
      module: 'datahub:interactions',
      component: InteractionsCollectionList,
    },
    {
      path: '/interactions/ess/:essInteractionId/details',
      module: 'datahub:interactions',
      component: ESSInteractionDetails,
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
      exact: true,
      path: '/reminders/settings',
      module: 'datahub:companies',
      component: RemindersSettings,
    },
    {
      exact: false,
      path: '/reminders/settings/:reminderType',
      module: 'datahub:companies',
      component: RemindersForms,
    },
    {
      exact: false,
      path: ['/reminders/:reminderType', '/reminders'],
      module: 'datahub:companies',
      component: Reminders,
    },
  ],
  exportPipeline: [
    {
      path: '/export/create',
      module: 'datahub:companies',
      component: ExportFormAdd,
    },
    {
      path: '/export/:exportId/edit',
      module: 'datahub:companies',
      component: ExportFormEdit,
    },
    {
      path: '/export/:exportId/details',
      module: 'datahub:companies',
      component: ExportDetails,
    },
    {
      path: '/export/:exportId/delete',
      module: 'datahub:companies',
      component: ExportFormDelete,
    },
  ],
  investments: [
    {
      path: '/investments/projects/:investmentId/status',
      module: 'datahub:investments',
      component: EditProjectStatus,
    },
  ],
}

export default routes
