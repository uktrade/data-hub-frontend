import React from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { COMPANY_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import { TASK_GET_COMPANY_DETAIL } from '../../Companies/CompanyDetails/state'
import { state2props } from './state'
import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import ExportFormFields from './ExportFormFields'

const DISPLAY_ADD_EXPORT = 'Add export'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const getBreadcrumbs = (company) => {
  const defaultBreadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
  ]

  if (company) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.companies.activity.index(company.id),
        text: company.name,
      },
      { text: 'Add export' },
    ]
  }

  return [...defaultBreadcrumbs, { text: 'Add export' }]
}

const ExportFormAdd = ({ company, currentAdviserId, currentAdviserName }) => {
  let query = useQuery()
  const companyId = query.get('companyId')

  return (
    <DefaultLayout
      heading={DISPLAY_ADD_EXPORT}
      subheading={company?.name}
      pageTitle={DISPLAY_ADD_EXPORT}
      breadcrumbs={getBreadcrumbs(company)}
      useReactRouter={false}
    >
      <ExportFormFields
        analyticsFormName="addExportForm"
        taskProps={{
          name: TASK_GET_COMPANY_DETAIL,
          id: COMPANY_DETAILS_ID,
          progressMessage: 'Loading company details',
          startOnRender: {
            payload: companyId,
            onSuccessDispatch: COMPANY_LOADED,
          },
        }}
        initialValues={{
          owner: { id: currentAdviserId, name: currentAdviserName },
          company: { id: companyId },
          team_members: [],
          estimated_export_value_years: {},
          estimated_win_date: {},
        }}
        cancelRedirectUrl={urls.companies.activity.index(companyId)}
        redirectToUrl={urls.dashboard()}
        flashMessage={({ data }) => `'${data.title}' created`}
        formDataLoaded={!!company}
      />
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormAdd)
