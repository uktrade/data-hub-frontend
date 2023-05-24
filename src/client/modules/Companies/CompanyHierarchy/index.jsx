import React from 'react'
import Task from '../../../components/Task'
import { TASK_GET_COMPANY_DETAIL } from '../CompanyDetails/state'
import { COMPANY_LOADED } from '../../../actions'
import { useParams } from 'react-router-dom'
import { state2props } from './state'
import { connect } from 'react-redux'
import urls from '../../../../lib/urls'
import DnbHierarchy from '../../../../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import {
  CompanyTabbedLocalNavigation,
  DefaultLayout,
} from '../../../components'
import AccessDenied from '../../../components/AccessDenied'

const localTabItems = (company) => {
  if (!company) {
    return []
  }

  const tabItems = []
  if (company.is_global_ultimate) {
    tabItems.push({
      url: urls.companies.dnbHierarchy.index(company.id),
      label: 'Dun & Bradstreet hierarchy',
      isActive: true,
    })
  }

  if (company.isGlobalHQ) {
    tabItems.push({
      url: urls.companies.subsidiaries.index(company.id),
      label: 'Manually linked subsidiaries',
      isActive: false,
    })
  }
  return tabItems
}

const breadcrumbs = (company) => {
  if (!company) {
    return []
  }
  return [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    {
      link: urls.companies.detail(company.id),
      text: company.name,
    },
    {
      link: urls.companies.businessDetails(company.id),
      text: 'Business details',
    },
    {
      text: 'Related companies',
    },
  ]
}

const CompanyHierarchy = ({ company }) => {
  const { companyId } = useParams()
  if (company && !company.global_ultimate_duns_number) {
    return (
      <AccessDenied
        breadcrumbs={[
          {
            link: urls.dashboard(),
            text: 'Home',
          },
          {
            text: 'Companies',
          },
        ]}
      />
    )
  }

  return (
    <DefaultLayout
      heading={company ? `Company records related to ${company.name}` : ''}
      pageTitle={
        company
          ? `Related companies - Business details - ${company.name} - Companies - DBT Data Hub`
          : 'DBT Data Hub'
      }
      breadcrumbs={breadcrumbs(company)}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_COMPANY_DETAIL}
        id="CompanyHierarchy"
        progressMessage="Loading company details"
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: COMPANY_LOADED,
        }}
      >
        {() =>
          company && (
            <>
              <CompanyTabbedLocalNavigation
                company={company}
                localNavItems={localTabItems(company)}
              />
              <div id="dnb-hierarchy">
                <DnbHierarchy
                  dataEndpoint={urls.companies.dnbHierarchy.data(company.id)}
                  isGlobalHQ={company.isGlobalHQ}
                />
              </div>
            </>
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(CompanyHierarchy)
