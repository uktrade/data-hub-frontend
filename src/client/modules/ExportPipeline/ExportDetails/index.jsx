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
import { currencyGBP } from '../../../../client/utils/number-utils'

import { Button } from 'govuk-react'
import { BLACK, GREY_3 } from '../../../utils/colours'
import { capitalize } from 'lodash'

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
  const { exportId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      text: exportItem?.title,
    },
  ]
  return (
    <DefaultLayout
      heading={`${exportItem?.title}`}
      subheading={exportItem?.company?.name}
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
            exportItem?.title && (
              <>
                <StyledSummaryTable>
                  <SummaryTable.Row
                    heading="Export title"
                    children={exportItem?.title}
                  />
                  <SummaryTable.Row heading="Owner">
                    {isEmpty(exportItem?.owner)
                      ? 'Not set'
                      : exportItem?.owner.name}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Team members"
                    emptyValue="Not set"
                    hideWhenEmpty={true}
                    value={exportItem?.teamMembers}
                  ></SummaryTable.ListRow>
                  <SummaryTable.Row
                    heading="Total estimated export value"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem?.estimatedExportValueAmount)
                      ? 'Not set'
                      : `${exportItem.exportYears} / ${currencyGBP(
                          exportItem.estimatedExportValueAmount
                        )}`}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Estimated date for Win"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem?.estimatedWinDate)
                      ? 'Not set'
                      : format(exportItem?.estimatedWinDate, 'MMMM yyyy')}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Status" hideWhenEmpty={false}>
                    {isEmpty(exportItem?.status)
                      ? 'Not set'
                      : capitalize(exportItem?.status)}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Export potential"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem?.exportPotential)
                      ? 'Not set'
                      : capitalize(exportItem?.exportPotential)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Destination" hideWhenEmpty={false}>
                    {isEmpty(exportItem?.destinationCountry)
                      ? 'Not set'
                      : exportItem?.destinationCountry.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Main sector" hideWhenEmpty={false}>
                    {isEmpty(exportItem?.sector)
                      ? 'Not set'
                      : exportItem?.sector.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Exporter experience"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem.exporterExperience)
                      ? 'Not set'
                      : exportItem.exporterExperience}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Company contacts"
                    value={exportItem?.contacts}
                    emptyValue="Not set"
                    hideWhenEmpty={false}
                  ></SummaryTable.ListRow>
                  <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
                    {isEmpty(exportItem?.notes) ? 'Not set' : exportItem?.notes}
                  </SummaryTable.Row>{' '}
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
