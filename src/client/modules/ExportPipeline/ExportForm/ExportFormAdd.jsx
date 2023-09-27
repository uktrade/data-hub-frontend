import React from 'react'
import { connect } from 'react-redux'
import { useLocation, withRouter } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { COMPANY_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import {
  ID as COMPANY_DETAILS_ID,
  TASK_GET_COMPANY_DETAIL,
} from '../../Companies/CompanyDetails/state'
import { state2props } from './state'
import ExportFormFields from './ExportFormFields'

const DISPLAY_ADD_EXPORT = 'Add export'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const getBreadcrumbs = (exportItem) => {
  const defaultBreadcrumbs = [
    {
      link: urls.exportPipeline.index(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
  ]

  if (exportItem) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.companies.activity.index(exportItem.company.id),
        text: exportItem.company.name,
      },
      { text: 'Add export' },
    ]
  }

  return [...defaultBreadcrumbs, { text: 'Add export' }]
}

const ExportFormAdd = ({ exportItem }) => {
  let query = useQuery()
  const companyId = query.get('companyId')

  return (
    <DefaultLayout
      heading={DISPLAY_ADD_EXPORT}
      subheading={exportItem?.company?.name}
      pageTitle={DISPLAY_ADD_EXPORT}
      breadcrumbs={getBreadcrumbs(exportItem)}
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
        exportItem={exportItem}
        cancelRedirectUrl={urls.companies.activity.index(companyId)}
        redirectToUrl={urls.exportPipeline.index()}
        flashMessage={({ data }) => `'${data.title}' created`}
        formSubmitButtonLabel="Add export"
      />
    </DefaultLayout>
  )
}

export default withRouter(connect(state2props)(ExportFormAdd))
