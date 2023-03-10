import React from 'react'
import { useParams } from 'react-router-dom'
import { EXPORT_DETAIL_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import { ID, TASK_GET_EXPORT_DETAIL } from './state'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ExportDetailsForm = () => {
  const { exportId } = useParams()
  const companyId = 'fd8220b1-c59f-413e-8f0b-61d692c15c3a'
  return (
    <DefaultLayout
      heading="Export Details"
      pageTitle="ExportDetailsForm"
      useReactRouter={true}
    >
      <Task.Status
        name={TASK_GET_EXPORT_DETAIL}
        id={ID}
        progressMessage="loading export details"
        startOnRender={{
          payload: exportId,
          onSuccessDispatch: EXPORT_DETAIL_LOADED,
        }}
      >
        {() => {
          return <></>
        }}
      </Task.Status>
    </DefaultLayout>
  )
  // <span>Export Details Form</span>
}

export default ExportDetailsForm
