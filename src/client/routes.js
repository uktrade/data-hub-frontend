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
import ExportWins from './modules/ExportWins/'
import AddExportWinForm from './modules/ExportWins/Form'
import ExportWinsRedirect from './modules/ExportWins/Redirect'
import ExportWinDetails from './modules/ExportWins/Details'
import CompanyHierarchy from './modules/Companies/CompanyHierarchy'
import CompanyTree from './modules/Companies/CompanyHierarchy/CompanyTree'
import Community from './modules/Community'
import Strategy from './modules/Companies/AccountManagement/Strategy'
import EditProjectStatus from './modules/Investments/Projects/EditProjectStatus'
import ObjectiveAdd from './modules/Companies/AccountManagement/Objective/ObjectiveAdd'
import ObjectiveEdit from './modules/Companies/AccountManagement/Objective/ObjectiveEdit'
import ArchivedObjectives from './modules/Companies/AccountManagement/ArchivedObjectives'
import FindAssociatedProject from './modules/Investments/Projects/Details/EditAssociatedProject/FindAssociatedProject'
import EditAssociatedProject from './modules/Investments/Projects/Details/EditAssociatedProject/EditAssociatedProject'
import FindRecipientCompany from './modules/Investments/Projects/Details/EditRecipientCompany/FindRecipientCompany'
import EditRecipientCompany from './modules/Investments/Projects/Details/EditRecipientCompany/EditRecipientCompany'
import EditOneList from './modules/Companies/CoreTeam/EditOneList'
import ObjectiveArchive from './modules/Companies/AccountManagement/Objective/ObjectiveArchive'
import ProjectDetails from './modules/Investments/Projects/Details/ProjectDetails'
import ProjectTeam from './modules/Investments/Projects/Team/ProjectTeam'
import EditProjectSummary from './modules/Investments/Projects/Details/EditProjectSummary'
import EditProjectRequirements from './modules/Investments/Projects/Details/EditProjectRequirements'
import EditProjectValue from './modules/Investments/Projects/Details/EditProjectValue'
import ProjectEvaluation from './modules/Investments/Projects/ProjectEvaluation'
import ProjectInteractions from './modules/Investments/Projects/ProjectInteractions'
import ProjectPropositions from './modules/Investments/Projects/ProjectPropositions'
import EditClientRelationshipManagement from './modules/Investments/Projects/Team/EditClientRelationshipManagement'
import EditProjectManagement from './modules/Investments/Projects/Team/EditProjectManagement'
import EditTeamMembers from './modules/Investments/Projects/Team/EditTeamMembers'
import ProjectEditHistory from './modules/Investments/Projects/ProjectEditHistory'
import ProjectEvidence from './modules/Investments/Projects/Evidence/ProjectEvidence'
import DeleteProjectDocument from './modules/Investments/Projects/Evidence/DeleteProjectDocument'
import InvestmentCollections from './modules/Investments/InvestmentCollections'
import InvestmentsRedirect from './modules/Investments/InvestmentsRedirect'
import EditQuoteInformation from './modules/Omis/EditQuoteInformation'
import TaskDetails from './modules/Tasks/TaskDetails'
import EditInternalInformation from './modules/Omis/EditInternalInformation'
import ProjectTasks from './modules/Investments/Projects/ProjectTasks'
import PaymentReconciliation from './modules/Omis/PaymentReconciliation'
import EditInvoiceDetails from './modules/Omis/EditInvoiceDetails'
import EditBillingAddress from './modules/Omis/EditBillingAddress'
import EditVATStatus from './modules/Omis/EditVATStatus'
import CancelOrder from './modules/Omis/CancelOrder'
import AssigneeTime from './modules/Omis/AssigneeTime'
import CompleteOrder from './modules/Omis/CompleteOrder'
import EditContact from './modules/Omis/EditContact'
import EditAssignees from './modules/Omis/EditAssignees'
import EditSubscribers from './modules/Omis/EditSubscribers'
import WorkOrder from './modules/Omis/WorkOrder'
import SetLeadAdviser from './modules/Omis/SetLeadAdviser'
import LinkGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/LinkGlobalHQ'
import LinkSubsidiary from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary'
import ExportCountriesEdit from './modules/Companies/CompanyExports/ExportCountriesEdit'
import ExportsEdit from './modules/Companies/CompanyExports/ExportsEdit'
import ReferralHelp from './modules/Companies/Referrals/Help/ReferralHelp'
import AbandonProposition from './modules/Investments/Projects/Propositions/AbandonProposition'
import CreateProposition from './modules/Investments/Projects/Propositions/CreateProposition'
import AttendeeSearch from './modules/Events/AttendeeSearch/AttendeeSearch'
import CreateUKInvestmentOpportunity from './modules/Investments/Opportunities/CreateUKInvestmentOpportunity'
import OpportunityChangeStatusForm from './modules/Investments/Opportunities/OpportunityChangeStatusForm'
import Opportunity from './modules/Investments/Opportunities/Opportunity'
import SelectOrderCompany from './modules/Omis/CreateOrder/CompanySelect'
import CreateOrder from './modules/Omis/CreateOrder/CreateOrder'
import PaymentReceipt from './modules/Omis/PaymentReceipt'
import { TaskFormAdd, TaskFormEdit } from './modules/Tasks/TaskForm'
import CompanyOverview from './modules/Companies/CompanyOverview/CompanyOverview'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import SetGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/SetGlobalHQ'
import RemoveGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/RemoveGlobalHQ'

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
    {
      path: '/companies/:companyId/account-management/objective/create',
      module: 'datahub:companies',
      component: ObjectiveAdd,
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/edit',
      module: 'datahub:companies',
      component: ObjectiveEdit,
    },
    {
      path: '/companies/:companyId/account-management/objective/archived',
      module: 'datahub:companies',
      component: ArchivedObjectives,
    },
    {
      path: '/companies/:companyId/edit-one-list',
      module: 'datahub:companies',
      component: EditOneList,
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/archive',
      module: 'datahub:companies',
      component: ObjectiveArchive,
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/search',
      module: 'datahub:companies',
      component: LinkGlobalHQ,
    },
    {
      path: '/companies/:companyId/subsidiaries/link',
      module: 'datahub:companies',
      component: LinkSubsidiary,
    },
    {
      path: '/companies/:companyId/hierarchies/subsidiaries/search',
      module: 'datahub:companies',
      component: LinkSubsidiary,
    },
    {
      path: '/companies/:companyId/exports/edit-countries',
      module: 'datahub:companies',
      component: ExportCountriesEdit,
    },
    {
      path: '/companies/:companyId/exports/edit',
      module: 'datahub:companies',
      component: ExportsEdit,
    },
    {
      path: '/companies/:companyId/referrals/:referralId/help',
      module: 'datahub:companies',
      component: ReferralHelp,
    },
    {
      path: '/companies/:companyId/overview',
      module: 'datahub:companies',
      component: CompanyOverview,
    },
    {
      path: '/companies/:companyId/business-details',
      module: 'datahub:companies',
      component: CompanyBusinessDetails,
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/:globalHqId/add',
      module: 'datahub:companies',
      component: SetGlobalHQ,
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/remove',
      module: 'datahub:companies',
      component: RemoveGlobalHQ,
    },
  ],
  contacts: [
    {
      path: '/contacts',
      module: 'datahub:contacts',
      component: ContactsCollectionList,
    },
  ],
  community: [
    {
      path: '/community',
      module: 'datahub:companies',
      component: Community,
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
    {
      path: '/events/:eventId/attendees/find-new',
      module: 'datahub:events',
      component: AttendeeSearch,
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
    {
      path: '/omis/:orderId/edit/quote-details',
      module: 'datahub:orders',
      component: EditQuoteInformation,
    },
    {
      path: '/omis/:orderId/edit/internal-details',
      module: 'datahub:orders',
      component: EditInternalInformation,
    },
    {
      path: '/omis/:orderId/edit/payment-reconciliation',
      module: 'datahub:orders',
      component: PaymentReconciliation,
    },
    {
      path: '/omis/:orderId/edit/invoice-details',
      module: 'datahub:orders',
      component: EditInvoiceDetails,
    },
    {
      path: '/omis/:orderId/edit/billing-address',
      module: 'datahub:orders',
      component: EditBillingAddress,
    },
    {
      path: '/omis/:orderId/edit/vat-status',
      module: 'datahub:orders',
      component: EditVATStatus,
    },
    {
      path: '/omis/:orderId/edit/cancel-order',
      module: 'datahub:orders',
      component: CancelOrder,
    },
    {
      path: '/omis/:orderId/edit/assignee-time',
      module: 'datahub:orders',
      component: AssigneeTime,
    },
    {
      path: '/omis/:orderId/edit/complete-order',
      module: 'datahub:orders',
      component: CompleteOrder,
    },
    {
      path: '/omis/:orderId/edit/contact',
      module: 'datahub:orders',
      component: EditContact,
    },
    {
      path: '/omis/:orderId/edit/assignees',
      module: 'datahub:orders',
      component: EditAssignees,
    },
    {
      path: '/omis/:orderId/edit/subscribers',
      module: 'datahub:orders',
      component: EditSubscribers,
    },
    {
      path: '/omis/:orderId/work-order',
      module: 'datahub:orders',
      component: WorkOrder,
    },
    {
      path: '/omis/:orderId/edit/lead-adviser/:adviserId',
      module: 'datahub:orders',
      component: SetLeadAdviser,
    },
    {
      path: '/omis/create',
      module: 'datahub:orders',
      component: SelectOrderCompany,
    },
    {
      path: '/omis/create/:companyId',
      module: 'datahub:orders',
      component: CreateOrder,
    },
    {
      path: '/omis/:orderId/payment-receipt',
      module: 'datahub:orders',
      component: PaymentReceipt,
    },
    {
      path: '/omis/:orderId/reconciliation/payment-receipt',
      module: 'datahub:orders',
      component: PaymentReceipt,
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
  exportWins: [
    {
      path: '/exportwins/unconfirmed',
      module: 'datahub:companies',
      component: ExportWins,
    },
    {
      path: '/exportwins/confirmed',
      module: 'datahub:companies',
      component: ExportWins,
    },
    {
      path: '/exportwins',
      module: 'datahub:companies',
      component: ExportWinsRedirect,
    },
    {
      path: '/exportwins/:winId/details',
      module: 'datahub:companies',
      component: ExportWinDetails,
    },
    {
      path: '/exportwins/create',
      module: 'datahub:companies',
      component: AddExportWinForm,
    },
  ],
  investments: [
    {
      path: '/investments/projects/:projectId/status',
      module: 'datahub:investments',
      component: EditProjectStatus,
    },
    {
      path: '/investments/projects/:projectId/find-associated',
      module: 'datahub:investments',
      component: FindAssociatedProject,
    },
    {
      path: '/investments/projects/:projectId/edit-associated/:associatedProjectId',
      module: 'datahub:investments',
      component: EditAssociatedProject,
    },
    {
      path: '/investments/projects/:projectId/remove-associated',
      module: 'datahub:investments',
      component: EditAssociatedProject,
    },
    {
      path: '/investments/projects/:projectId/find-ukcompany',
      module: 'datahub:investments',
      component: FindRecipientCompany,
    },
    {
      path: '/investments/projects/:projectId/edit-ukcompany/:companyId',
      module: 'datahub:investments',
      component: EditRecipientCompany,
    },
    {
      path: '/investments/projects/:projectId/remove-ukcompany',
      module: 'datahub:investments',
      component: EditRecipientCompany,
    },
    {
      path: '/investments/projects/:projectId/details',
      module: 'datahub:investments',
      component: ProjectDetails,
    },
    {
      path: '/investments/projects/:projectId/edit-details',
      module: 'datahub:investments',
      component: EditProjectSummary,
    },
    {
      path: '/investments/projects/:projectId/edit-requirements',
      module: 'datahub:investments',
      component: EditProjectRequirements,
    },
    {
      path: '/investments/projects/:projectId/edit-value',
      module: 'datahub:investments',
      component: EditProjectValue,
    },
    {
      path: '/investments/projects/:projectId/team',
      module: 'datahub:investments',
      component: ProjectTeam,
    },
    {
      path: '/investments/projects/:projectId/evaluation',
      module: 'datahub:investments',
      component: ProjectEvaluation,
    },
    {
      path: '/investments/projects/:projectId/interactions',
      module: 'datahub:investments',
      component: ProjectInteractions,
    },
    {
      path: '/investments/projects/:projectId/propositions',
      module: 'datahub:investments',
      component: ProjectPropositions,
    },
    {
      path: '/investments/projects/:projectId/edit-client-relationship-management',
      module: 'datahub:investments',
      component: EditClientRelationshipManagement,
    },
    {
      path: '/investments/projects/:projectId/edit-project-management',
      module: 'datahub:investments',
      component: EditProjectManagement,
    },
    {
      path: '/investments/projects/:projectId/edit-team-members',
      module: 'datahub:investments',
      component: EditTeamMembers,
    },
    {
      path: '/investments/projects/:projectId/edit-history',
      module: 'datahub:investments',
      component: ProjectEditHistory,
    },
    {
      path: '/investments/projects/:projectId/evidence',
      module: 'datahub:investments',
      component: ProjectEvidence,
    },
    {
      path: '/investments/projects/:projectId/evidence/:documentId/delete',
      module: 'datahub:investments',
      component: DeleteProjectDocument,
    },
    {
      path: '/investments/projects',
      module: 'datahub:investments',
      component: InvestmentCollections,
    },
    {
      path: '/investments/profiles',
      module: 'datahub:investments',
      component: InvestmentCollections,
    },
    {
      path: '/investments/opportunities',
      module: 'datahub:investments',
      component: InvestmentCollections,
    },
    {
      path: '/investments',
      module: 'datahub:investments',
      component: InvestmentsRedirect,
    },
    {
      path: '/investments/projects/:projectId/tasks',
      module: 'datahub:investments',
      component: ProjectTasks,
    },
    {
      path: '/investments/opportunities/create',
      module: 'datahub:investments',
      component: CreateUKInvestmentOpportunity,
    },
    {
      path: '/investments/opportunities/:opportunityId/status',
      module: 'datahub:investments',
      component: OpportunityChangeStatusForm,
    },
    {
      path: '/investments/opportunities/:opportunityId/details',
      module: 'datahub:investments',
      component: Opportunity,
    },
    {
      path: '/investments/opportunities/:opportunityId/interactions',
      module: 'datahub:investments',
      component: Opportunity,
    },
  ],
  propositions: [
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/abandon',
      module: 'datahub:investments',
      component: AbandonProposition,
    },
    {
      path: '/investments/projects/:projectId/propositions/create/proposition',
      module: 'datahub:investments',
      component: CreateProposition,
    },
  ],
  tasks: [
    {
      path: '/tasks/:taskId/details',
      module: 'datahub:companies',
      component: TaskDetails,
    },

    {
      path: '/tasks/:taskId/edit',
      module: 'datahub:companies',
      component: TaskFormEdit,
    },
    {
      exact: true,
      path: '/tasks/create',
      module: 'datahub:companies',
      component: TaskFormAdd,
    },
    {
      path: '/tasks/:taskId',
      module: 'datahub:companies',
      component: TaskDetails,
    },
  ],
}

export default routes
