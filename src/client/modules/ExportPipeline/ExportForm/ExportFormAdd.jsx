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
import { ID, state2props } from './state'
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
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { text: 'Add export' },
  ]

  if (Object.keys(company).length > 0) {
    return [
      ...breadcrumbs.slice(0, 2),
      {
        link: urls.companies.detail(company.id),
        text: company.name,
      },
      ...breadcrumbs.slice(2, breadcrumbs.length),
    ]
  }

  return breadcrumbs
}

const ExportFormAdd = ({ company }) => {
  let query = useQuery()
  const companyId = query.get('companyId')

  return (
    <DefaultLayout
      heading={DISPLAY_ADD_EXPORT}
      subheading={company.name ? company.name : undefined}
      pageTitle={DISPLAY_ADD_EXPORT}
      breadcrumbs={getBreadcrumbs(company)}
      useReactRouter={true}
    >
      <Task.Status
        name={TASK_GET_COMPANY_DETAIL}
        id={ID}
        progressMessage="Loading company details"
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: COMPANY_LOADED,
        }}
        renderError={ErrorHandler}
      >
        {() => <ExportFormFields companyId={company.id} />}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormAdd)
