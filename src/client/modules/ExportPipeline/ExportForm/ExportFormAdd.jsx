import React from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ERROR_COLOUR } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'

import Task from '../../../components/Task'
import urls from '../../../../lib/urls'
import { COMPANY_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import { TASK_GET_COMPANY_DETAIL } from '../../Companies/CompanyDetails/state'
import { state2props } from './state'
import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { StatusMessage } from '../../../../client/components/'
import ExportFormFields from './ExportFormFields'

const DISPLAY_ADD_EXPORT = 'Add export'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function ErrorHandler() {
  return (
    <StatusMessage
      colour={ERROR_COLOUR}
      aria-labelledby="company-load-error-summary-title"
      role="alert"
      data-test="company-load-error"
    >
      <H3 id="company-load-error-summary-title">Error loading company</H3>
    </StatusMessage>
  )
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
        link: urls.companies.detail(company.id),
        text: company.name,
      },
      { text: 'Add export' },
    ]
  }

  return [...defaultBreadcrumbs, { text: 'Add export' }]
}

const ExportFormAdd = ({ company }) => {
  let query = useQuery()
  const companyId = query.get('companyId')

  return (
    <DefaultLayout
      heading={DISPLAY_ADD_EXPORT}
      subheading={company?.name}
      pageTitle={DISPLAY_ADD_EXPORT}
      breadcrumbs={getBreadcrumbs(company)}
      useReactRouter={true}
    >
      <Task.Status
        name={TASK_GET_COMPANY_DETAIL}
        id={COMPANY_DETAILS_ID}
        progressMessage="Loading company details"
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: COMPANY_LOADED,
        }}
        renderError={ErrorHandler}
      >
        {() => (
          <ExportFormFields
            companyId={companyId}
            analyticsFormName={'addExportForm'}
          />
        )}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormAdd)
