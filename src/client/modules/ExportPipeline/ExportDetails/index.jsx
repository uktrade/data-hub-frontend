import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import urls from '../../../../lib/urls'
import { EXPORT_DETAIL_LOADED } from '../../../actions'
import { DefaultLayout, SummaryTable } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EXPORT_DETAIL } from './state'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ExportDetailsForm = ({
  id,
  owner,
  teamMembers,
  contacts,
  destination,
  sector,
  exporterExperience,
  title,
  extimatedExportValueAmount,
  estimatedWinDate,
  exportPotential,
  notes,
}) => {
  const { exportId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.exportPipeline.details(exportId),
      text: 'Export Title',
    },
    {
      text: title,
    },
  ]
  return (
    <DefaultLayout
      heading="Export Details"
      pageTitle="ExportDetailsForm"
      breadcrumbs={breadcrumbs}
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
          return (
            title && (
              <StyledSummaryTable>
                <SummaryTable.Row heading="Export title" children={title} />
                <SummaryTable.Row heading="Owner">
                  {isEmpty(owner) ? 'Not set' : owner}
                </SummaryTable.Row>
                {/* TODOS: <SummaryTable.ListRow
                  heading="Team members"
                  value={teamMembers}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Total estimated export value"
                  value={extimatedExportValueAmount}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Estimated date for Win"
                  value={estimatedWinDate}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Export potential"
                  value={exportPotential}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Destination"
                  value={destination}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow heading="Main sector" value={sector} />
                <SummaryTable.ListRow
                  heading="Exporter experience"
                  value={exporterExperience}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Company contacts"
                  value={contacts}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                />
                <SummaryTable.ListRow
                  heading="Notes"
                  value={notes}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                /> */}
              </StyledSummaryTable>
            )
          )
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportDetailsForm)
