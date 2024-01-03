import React from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { ID, TASK_GET_EXPORT_WIN_DETAILS, state2props } from './state'
import { EXPORT_WINS__DETAILS_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import urls from '../../../../lib/urls'

const DetailsTable = ({ exportWin }) => {
  const location = useLocation()
  const companyId = location.pathname.split('/')[2]
  const title = `${exportWin.name_of_export} to ${exportWin?.country?.name}`
  return (
    <Task.Status
      name={TASK_GET_EXPORT_WIN_DETAILS}
      id={ID}
      progressMessage="Loading export win details"
      startOnRender={{
        payload: {
          companyId,
        },
        onSuccessDispatch: EXPORT_WINS__DETAILS_LOADED,
      }}
    >
      {() => (
        <DefaultLayout
          heading={title}
          pageTitle={title}
          breadcrumbs={[
            {
              link: urls.dashboard.index(),
              text: 'Home',
            },
            {
              link: urls.companies.exportWins.index(),
              text: 'Export wins',
            },
            { text: title },
          ]}
        >
          <pre>
            <code>{JSON.stringify(exportWin, null, 2)}</code>
          </pre>
        </DefaultLayout>
      )}
    </Task.Status>
  )
}

export default connect(state2props)(DetailsTable)
