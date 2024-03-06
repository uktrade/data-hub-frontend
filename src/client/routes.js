import React from 'react'
import { useRoutes } from 'react-router-dom-v5-compat'

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
import CompanyActivityCollection from './components/ActivityFeed/CollectionList/index'
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
import ProtectedRoute from './components/ProtectedRoute/index'

function Routes() {
  const routes = useRoutes([
    {
      path: '/companies',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompaniesCollectionList}
        />
      ),
    },
    {
      path: '/companies/:companyId/overview',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyOverview}
        />
      ),
    },
    {
      path: '/companies/:companyId/dnb-hierarchy',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyHierarchy}
        />
      ),
    },
    {
      path: '/companies/:companyId/company-tree',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={CompanyTree} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/strategy/create',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={Strategy} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/strategy/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={Strategy} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/create',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ObjectiveAdd} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ObjectiveEdit} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/archived',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ArchivedObjectives}
        />
      ),
    },
    {
      path: '/companies/:companyId/edit-one-list',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={EditOneList} />
      ),
    },
    {
      path: '/companies/:companyId/account-management/objective/:objectiveId/archive',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ObjectiveArchive}
        />
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/search',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={LinkGlobalHQ} />
      ),
    },
    {
      path: '/companies/:companyId/subsidiaries/link',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={LinkSubsidiary} />
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/subsidiaries/search',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={LinkSubsidiary} />
      ),
    },
    {
      path: '/companies/:companyId/exports/edit-countries',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportCountriesEdit}
        />
      ),
    },
    {
      path: '/companies/:companyId/exports/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportsEdit} />
      ),
    },
    {
      path: '/companies/:companyId/referrals/:referralId/help',
      module: 'datahub:companies',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ReferralHelp} />
      ),
    },
    {
      path: '/companies/:companyId/business-details',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyBusinessDetails}
        />
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/:globalHqId/add',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={SetGlobalHQ} />
      ),
    },
    {
      path: '/companies/:companyId/hierarchies/ghq/remove',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={RemoveGlobalHQ} />
      ),
    },
    {
      path: '/companies/:companyId/activity',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyActivityCollection}
        />
      ),
    },
    {
      path: '/companies/:companyId/contacts',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyContactsCollection}
        />
      ),
    },
    {
      path: '/companies/:companyId/orders',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyOrdersCollection}
        />
      ),
    },
    {
      path: '/companies/:companyId/account-management',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={AccountManagement}
        />
      ),
    },
    {
      path: '/companies/:companyId/investments',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyProjectsCollection}
        />
      ),
    },
    {
      path: '/companies/:companyId/investments/projects',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyProjectsCollection}
        />
      ),
    },
    {
      path: '/companies/:companyId/investments/large-capital-profile',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={LargeCapitalProfile}
        />
      ),
    },
    {
      path: '/companies/:companyId/exports',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportsIndex} />
      ),
    },
    {
      path: '/companies/:companyId/exports/history',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportsHistory} />
      ),
    },
    {
      path: '/companies/:companyId/exports/history/:countryId',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportsHistory} />
      ),
    },
    {
      path: '/companies/:companyId/edit-history',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CompanyEditHistory}
        />
      ),
    },
    {
      path: '/contacts',
      element: (
        <ProtectedRoute
          module={'datahub:contacts'}
          test123={ContactsCollectionList}
        />
      ),
    },
    {
      path: '/community',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={Community} />
      ),
    },
    {
      path: '/events',
      element: (
        <ProtectedRoute
          module={'datahub:events'}
          test123={EventsCollectionList}
        />
      ),
    },
    {
      path: '/events/create',
      element: <ProtectedRoute module={'datahub:events'} test123={EventForm} />,
    },
    {
      path: '/events/:id/edit',
      element: <ProtectedRoute module={'datahub:events'} test123={EventForm} />,
    },
    {
      path: '/events/:id/details',
      element: (
        <ProtectedRoute module={'datahub:events'} test123={EventDetails} />
      ),
    },
    {
      path: '/events/aventri/:aventriEventId/details',
      element: (
        <ProtectedRoute
          module={'datahub:events'}
          test123={EventAventriDetails}
        />
      ),
    },
    {
      path: '/events/aventri/:aventriEventId/registration/:status',
      element: (
        <ProtectedRoute
          module={'datahub:events'}
          test123={EventAventriRegistrationStatus}
        />
      ),
    },
    {
      path: '/events/:eventId/attendees/find-new',
      element: (
        <ProtectedRoute module={'datahub:events'} test123={AttendeeSearch} />
      ),
    },
    {
      path: '/interactions',
      element: (
        <ProtectedRoute
          module={'datahub:interactions'}
          test123={InteractionsCollectionList}
        />
      ),
    },
    {
      path: '/interactions/ess/:essInteractionId/details',
      element: (
        <ProtectedRoute
          module={'datahub:interactions'}
          test123={ESSInteractionDetails}
        />
      ),
    },
    {
      path: '/omis',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={OmisCollectionList}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/quote-details',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={EditQuoteInformation}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/internal-details',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={EditInternalInformation}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/payment-reconciliation',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={PaymentReconciliation}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/invoice-details',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={EditInvoiceDetails}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/billing-address',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={EditBillingAddress}
        />
      ),
    },
    {
      path: '/omis/:orderId/edit/vat-status',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={EditVATStatus} />
      ),
    },
    {
      path: '/omis/:orderId/edit/cancel-order',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={CancelOrder} />
      ),
    },
    {
      path: '/omis/:orderId/edit/assignee-time',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={AssigneeTime} />
      ),
    },
    {
      path: '/omis/:orderId/edit/complete-order',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={CompleteOrder} />
      ),
    },
    {
      path: '/omis/:orderId/edit/contact',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={EditContact} />
      ),
    },
    {
      path: '/omis/:orderId/edit/assignees',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={EditAssignees} />
      ),
    },
    {
      path: '/omis/:orderId/edit/subscribers',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={EditSubscribers} />
      ),
    },
    {
      path: '/omis/:orderId/work-order',
      element: <ProtectedRoute module={'datahub:orders'} test123={WorkOrder} />,
    },
    {
      path: '/omis/:orderId/edit/lead-adviser/:adviserId',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={SetLeadAdviser} />
      ),
    },
    {
      path: '/omis/create',
      element: (
        <ProtectedRoute
          module={'datahub:orders'}
          test123={SelectOrderCompany}
        />
      ),
    },
    {
      path: '/omis/create/:companyId',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={CreateOrder} />
      ),
    },
    {
      path: '/omis/:orderId/payment-receipt',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={PaymentReceipt} />
      ),
    },
    {
      path: '/omis/:orderId/reconciliation/payment-receipt',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={PaymentReceipt} />
      ),
    },
    {
      path: '/omis/:orderId/quote',
      element: (
        <ProtectedRoute module={'datahub:orders'} test123={OrderQuote} />
      ),
    },
    {
      path: '/omis/reconciliation',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={OrdersReconciliationCollection}
        />
      ),
    },
    {
      path: '/reminders/settings',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={RemindersSettings}
        />
      ),
    },
    {
      path: '/reminders/settings/:reminderType',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={RemindersForms} />
      ),
    },
    {
      path: '/reminders',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={Reminders} />
      ),
    },
    {
      path: '/reminders/:reminderType',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={Reminders} />
      ),
    },
    {
      path: '/export/create',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportFormAdd} />
      ),
    },
    {
      path: '/export/:exportId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportFormEdit} />
      ),
    },
    {
      path: '/export/:exportId/details',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={ExportDetails} />
      ),
    },
    {
      path: '/export/:exportId/delete',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportFormDelete}
        />
      ),
    },
    {
      path: '/exportwins/rejected',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportWinsTabNav}
        />
      ),
    },
    {
      path: '/exportwins/sent',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportWinsTabNav}
        />
      ),
    },
    {
      path: '/exportwins/won',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportWinsTabNav}
        />
      ),
    },
    {
      path: '/exportwins',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportWinsRedirect}
        />
      ),
    },
    {
      path: '/exportwins/:winId/details',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={ExportWinDetails}
        />
      ),
    },
    {
      path: '/exportwins/create',
      element: (
        <ProtectedRoute
          module={'datahub:companies'}
          test123={CreateExportWin}
        />
      ),
    },
    {
      path: '/exportwins/:winId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={EditExportWin} />
      ),
    },
    {
      path: '/investments/projects/:projectId/status',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditProjectStatus}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/find-associated',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={FindAssociatedProject}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-associated/:associatedProjectId',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditAssociatedProject}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/remove-associated',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditAssociatedProject}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/find-ukcompany',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={FindRecipientCompany}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-ukcompany/:companyId',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditRecipientCompany}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/remove-ukcompany',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditRecipientCompany}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/details',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectDetails}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-details',

      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditProjectSummary}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-requirements',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditProjectRequirements}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-value',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditProjectValue}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/team',
      element: (
        <ProtectedRoute module={'datahub:investments'} test123={ProjectTeam} />
      ),
    },
    {
      path: '/investments/projects/:projectId/evaluation',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectEvaluation}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/interactions',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectInteractions}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectPropositions}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-client-relationship-management',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditClientRelationshipManagement}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-project-management',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditProjectManagement}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-team-members',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={EditTeamMembers}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/edit-history',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectEditHistory}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={ProjectEvidence}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence/add-new',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={AddProjectDocument}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/evidence/:documentId/delete',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={DeleteProjectDocument}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/admin',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={InvestmentProjectAdmin}
        />
      ),
    },
    {
      path: '/investments/projects',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={InvestmentCollections}
        />
      ),
    },
    {
      path: '/investments/profiles',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={InvestmentCollections}
        />
      ),
    },
    {
      path: '/investments/opportunities',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={InvestmentCollections}
        />
      ),
    },
    {
      path: '/investments',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={InvestmentsRedirect}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/tasks',
      element: (
        <ProtectedRoute module={'datahub:investments'} test123={ProjectTasks} />
      ),
    },
    {
      path: '/investments/opportunities/create',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={CreateUKInvestmentOpportunity}
        />
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/status',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={OpportunityChangeStatusForm}
        />
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/details',
      element: (
        <ProtectedRoute module={'datahub:investments'} test123={Opportunity} />
      ),
    },
    {
      path: '/investments/opportunities/:opportunityId/interactions',
      element: (
        <ProtectedRoute module={'datahub:investments'} test123={Opportunity} />
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/abandon',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={AbandonProposition}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/create/proposition',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={CreateProposition}
        />
      ),
    },
    {
      path: '/investments/projects/:projectId/propositions/:propositionId/document/:documentId/delete',
      element: (
        <ProtectedRoute
          module={'datahub:investments'}
          test123={DeletePropositionDocument}
        />
      ),
    },
    {
      path: '/tasks/:taskId/details',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={TaskDetails} />
      ),
    },

    {
      path: '/tasks/:taskId/edit',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={TaskFormEdit} />
      ),
    },
    {
      exact: true,
      path: '/tasks/create',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={TaskFormAdd} />
      ),
    },
    {
      path: '/tasks/:taskId',
      element: (
        <ProtectedRoute module={'datahub:companies'} test123={TaskDetails} />
      ),
    },
  ])

  // let router = useRoutes(routes);
  return routes
  // return router;
}
export default Routes
