import React from 'react'
import { useRoutes } from 'react-router-dom'

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
import ExportWinsTabNav from './modules/ExportWins/Status/ExportWinsTabNav'
import { CreateExportWin, EditExportWin } from './modules/ExportWins/Form'
import ExportWinsRedirect from './modules/ExportWins/Status/Redirect'
import Success from './modules/ExportWins/Form/Success'
import EditSuccess from './modules/ExportWins/Form/EditSuccess'
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
import ProjectEditHistory from './modules/Investments/Projects/EditHistory/ProjectEditHistory'
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
import DeletePropositionDocument from './modules/Investments/Projects/Propositions/DeletePropositionDocument'
import AttendeeSearch from './modules/Events/AttendeeSearch/AttendeeSearch'
import CreateUKInvestmentOpportunity from './modules/Investments/Opportunities/CreateUKInvestmentOpportunity'
import OpportunityChangeStatusForm from './modules/Investments/Opportunities/OpportunityChangeStatusForm'
import Opportunity from './modules/Investments/Opportunities/Opportunity'
import SelectOrderCompany from './modules/Omis/CreateOrder/CompanySelect'
import CreateOrder from './modules/Omis/CreateOrder/CreateOrder'
import PaymentReceipt from './modules/Omis/PaymentReceipt'
import { TaskFormAdd, TaskFormEdit } from './modules/Tasks/TaskForm'
import CompanyOverview from './modules/Companies/CompanyOverview/CompanyOverview'
import CompanyBusinessDetails from './modules/Companies/CompanyBusinessDetails/CompanyBusinessDetails'
import SetGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/SetGlobalHQ'
import RemoveGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/RemoveGlobalHQ'
import CompanyActivityCollectionNoAs from './modules/Companies/CompanyActivity/index'
import CompanyContactsCollection from './modules/Contacts/CollectionList/CompanyContactsCollection'
import CompanyOrdersCollection from './modules/Omis/CollectionList/CompanyOrdersCollection'
import AccountManagement from './modules/Companies/AccountManagement'
import CompanyProjectsCollection from './modules/Companies/CompanyInvestments/CompanyProjectsCollection'
import LargeCapitalProfile from './modules/Companies/CompanyInvestments/LargeCapitalProfile'
import ExportsIndex from './modules/Companies/CompanyExports/ExportsIndex'
import ExportsHistory from './modules/Companies/CompanyExports/ExportHistory'
import InvestmentProjectAdmin from './modules/Investments/Projects/InvestmentProjectAdmin'
import OrderQuote from './modules/Omis/OrderQuote'
import OrdersReconciliationCollection from './modules/Omis/CollectionList/OrdersReconciliationCollection'
import CompanyEditHistory from './modules/Companies/CompanyBusinessDetails/CompanyEditHistory/CompanyEditHistory'
import AddProjectDocument from './modules/Investments/Projects/Evidence/AddProjectDocument'
import AddPropositionDocument from './modules/Investments/Projects/Propositions/AddPropositionDocument'
import ProtectedRoute from './components/ProtectedRoute/index'
import CustomerFeedback from './modules/ExportWins/CustomerFeedback'

function Routes() {
  const routes = useRoutes([
    {
      path: '/companies',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompaniesCollectionList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/overview',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyOverview />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/dnb-hierarchy',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyHierarchy />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/company-tree',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyTree />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/strategy/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Strategy />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/strategy/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Strategy />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ObjectiveAdd />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ObjectiveEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/archived',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ArchivedObjectives />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/edit-one-list',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <EditOneList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/archive',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ObjectiveArchive />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/search',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <LinkGlobalHQ />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/subsidiaries/link',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <LinkSubsidiary />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/subsidiaries/search',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <LinkSubsidiary />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exports/edit-countries',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportCountriesEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exports/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportsEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/referrals/:referralId/help',
      module: 'datahub:companies',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ReferralHelp />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/business-details',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyBusinessDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/:globalHqId/add',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <SetGlobalHQ />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/remove',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <RemoveGlobalHQ />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/activity',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyActivityCollectionNoAs />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/contacts',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyContactsCollection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/orders',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyOrdersCollection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/account-management',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <AccountManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/investments',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyProjectsCollection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/investments/projects',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyProjectsCollection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/investments/large-capital-profile',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <LargeCapitalProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exports',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportsIndex />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exports/history',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportsHistory />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exports/history/:countryId',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportsHistory />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/edit-history',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CompanyEditHistory />
        </ProtectedRoute>
      ),
    },
    {
      path: '/contacts',
      element: (
        <ProtectedRoute module={'datahub:contacts'}>
          <ContactsCollectionList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/community',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Community />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventsCollectionList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/create',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/:id/edit',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/:id/details',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/aventri/:aventriEventId/details',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventAventriDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/aventri/:aventriEventId/registration/:status',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <EventAventriRegistrationStatus />
        </ProtectedRoute>
      ),
    },
    {
      path: '/events/:eventId/attendees/find-new',
      element: (
        <ProtectedRoute module={'datahub:events'}>
          <AttendeeSearch />
        </ProtectedRoute>
      ),
    },
    {
      path: '/interactions',
      element: (
        <ProtectedRoute module={'datahub:interactions'}>
          <InteractionsCollectionList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/interactions/ess/:essInteractionId/details',
      element: (
        <ProtectedRoute module={'datahub:interactions'}>
          <ESSInteractionDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <OmisCollectionList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/quote-details',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditQuoteInformation />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/internal-details',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditInternalInformation />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/payment-reconciliation',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <PaymentReconciliation />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/invoice-details',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditInvoiceDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/billing-address',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditBillingAddress />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/vat-status',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditVATStatus />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/cancel-order',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <CancelOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/assignee-time',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <AssigneeTime />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/complete-order',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <CompleteOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/contact',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditContact />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/assignees',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditAssignees />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/subscribers',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <EditSubscribers />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/work-order',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <WorkOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/edit/lead-adviser/:adviserId',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <SetLeadAdviser />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/create',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <SelectOrderCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/create/:companyId',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <CreateOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/payment-receipt',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <PaymentReceipt />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/reconciliation/payment-receipt',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <PaymentReceipt />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/:orderId/quote',
      element: (
        <ProtectedRoute module={'datahub:orders'}>
          <OrderQuote />
        </ProtectedRoute>
      ),
    },
    {
      path: '/omis/reconciliation',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <OrdersReconciliationCollection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/reminders/settings',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <RemindersSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: '/reminders/settings/:reminderType',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <RemindersForms />
        </ProtectedRoute>
      ),
    },
    {
      path: '/reminders',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Reminders />
        </ProtectedRoute>
      ),
    },
    {
      path: '/reminders/:reminderType',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Reminders />
        </ProtectedRoute>
      ),
    },
    {
      path: '/export/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportFormAdd />
        </ProtectedRoute>
      ),
    },
    {
      path: '/export/:exportId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportFormEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: '/export/:exportId/details',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/export/:exportId/delete',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportFormDelete />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/rejected',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportWinsTabNav />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/pending',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportWinsTabNav />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/won',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportWinsTabNav />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportWinsRedirect />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CreateExportWin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/confirmed',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <ExportWinsTabNav />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exportwins/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CreateExportWin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/export/:exportId/exportwins/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CreateExportWin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/exportwins/:winId/success',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <Success />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exportwins/:winId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <EditExportWin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exportwins/:winId/edit-success',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <EditSuccess />
        </ProtectedRoute>
      ),
    },
    {
      path: '/companies/:companyId/exportwins/:winId/customer-feedback',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <CustomerFeedback />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/status',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditProjectStatus />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/find-associated',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <FindAssociatedProject />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-associated/:associatedProjectId',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditAssociatedProject />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/remove-associated',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditAssociatedProject />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/find-ukcompany',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <FindRecipientCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-ukcompany/:companyId',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditRecipientCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/remove-ukcompany',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditRecipientCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/details',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-details',

      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditProjectSummary />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-requirements',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditProjectRequirements />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-value',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditProjectValue />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/team',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/evaluation',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectEvaluation />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/interactions',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectInteractions />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectPropositions />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-client-relationship-management',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditClientRelationshipManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-project-management',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditProjectManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-team-members',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <EditTeamMembers />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-history',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectEditHistory />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectEvidence />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence/add-new',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <AddProjectDocument />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence/:documentId/delete',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <DeleteProjectDocument />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/admin',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentProjectAdmin />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentCollections />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/profiles',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentCollections />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/opportunities',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentCollections />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentsRedirect />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/tasks',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <ProjectTasks />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/opportunities/create',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <CreateUKInvestmentOpportunity />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/status',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <OpportunityChangeStatusForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/details',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <Opportunity />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/interactions',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <Opportunity />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/abandon',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <AbandonProposition />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/create/proposition',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <CreateProposition />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/document/:documentId/delete',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <DeletePropositionDocument />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/document',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <AddPropositionDocument />
        </ProtectedRoute>
      ),
    },

    {
      path: '/tasks/:taskId/details',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <TaskDetails />
        </ProtectedRoute>
      ),
    },

    {
      path: '/tasks/:taskId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <TaskFormEdit />
        </ProtectedRoute>
      ),
    },
    {
      exact: true,
      path: '/tasks/create',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <TaskFormAdd />
        </ProtectedRoute>
      ),
    },
    {
      path: '/tasks/:taskId',
      element: (
        <ProtectedRoute module={'datahub:companies'}>
          <TaskDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: '/investments/eyb-leads',
      element: (
        <ProtectedRoute module={'datahub:investments'}>
          <InvestmentCollections />
        </ProtectedRoute>
      ),
    },
  ])

  return routes
}
export default Routes
