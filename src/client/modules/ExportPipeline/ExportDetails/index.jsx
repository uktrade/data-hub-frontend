import React from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import urls from '../../../../lib/urls'
import { EXPORT_LOADED } from '../../../actions'
import { DefaultLayout, SummaryTable } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EXPORT_DETAIL } from './state'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { format } from '../../../../client/utils/date'

import { Button } from 'govuk-react'
import { BLACK, GREY_3 } from '../../../utils/colours'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 30,
})

const StyledButton = styled(Button)({
  margin: 0,
  marginRight: 40,
})

const ExportDetailsForm = ({ exportItem }) => {
  console.log('>>>>>exportItem', exportItem)
  const {
    owner,
    teamMembers,
    contacts,
    destination,
    sector,
    exporterExperience,
    title,
    estimatedExportValueAmount,
    estimatedWinDate,
    exportPotential,
    notes,
    company,
    status,
  } = exportItem
  const { exportId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      text: title,
    },
  ]
  return (
    <DefaultLayout
      heading={`‘${title}’`}
      subheading={company}
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
          onSuccessDispatch: EXPORT_LOADED,
        }}
        initialValues={exportItem}
      >
        {() => {
          return (
            title && (
              <>
                <StyledSummaryTable>
                  <SummaryTable.Row heading="Export title" children={title} />
                  <SummaryTable.Row heading="Owner">
                    {isEmpty(owner) ? 'Not set' : owner}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Team members"
                    emptyValue="Not set"
                    hideWhenEmpty={true}
                    value={teamMembers}
                  ></SummaryTable.ListRow>
                  <SummaryTable.Row
                    heading="Total estimated export value"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(estimatedExportValueAmount)
                      ? 'Not set'
                      : estimatedExportValueAmount}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Estimated date for Win"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(estimatedWinDate)
                      ? 'Not set'
                      : format(estimatedWinDate, 'MMMM yyyy')}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Status" hideWhenEmpty={false}>
                    {isEmpty(status) ? 'Not set' : status}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Export potential"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportPotential) ? 'Not set' : exportPotential}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Destination" hideWhenEmpty={false}>
                    {isEmpty(destination) ? 'Not set' : destination}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Main sector" hideWhenEmpty={false}>
                    {isEmpty(sector) ? 'Not set' : sector}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Exporter experience"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exporterExperience)
                      ? 'Not set'
                      : exporterExperience}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Company contacts"
                    value={contacts}
                    emptyValue="Not set"
                    hideWhenEmpty={false}
                  ></SummaryTable.ListRow>
                  {/* <H2>Notes</H2>
                  <p>Lorem ipusum</p> */}
                  <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
                    font-size: ${FONT_SIZE.SIZE_10};
                    {isEmpty(notes) ? 'Not set' : notes}
                  </SummaryTable.Row>
                </StyledSummaryTable>
                <Container>
                  <StyledButton
                    href={urls.exportPipeline.details(exportId)}
                    buttonColour={GREY_3}
                    buttonTextColour={BLACK}
                    data-test="edit-export-details-button"
                  >
                    Edit
                  </StyledButton>
                  <Link href={urls.exportPipeline.details(exportId)}>
                    Delete
                  </Link>
                </Container>
              </>
            )
          )
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportDetailsForm)
