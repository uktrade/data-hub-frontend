import React from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import urls from '../../../../lib/urls'
import { EXPORT_DETAIL_LOADED } from '../../../actions'
import { DefaultLayout, SummaryTable } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EXPORT_DETAIL } from './state'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { format } from '../../../../client/utils/date'

import { Button } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import { BLACK, GREY_3 } from '../../../utils/colours'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
  marginBottom: 100,
})

const StyledLink = styled(Link)`
  text-decoration-line: none;
  padding: 40px;
  padding-top: 40px;
`
const StyledButton = styled('button')`
  margin: 12px;
`

// const StyledButton = styled('button')`
//   position: absolute;
//   top: 0;
//   right: 0;
//   border: 0;
//   margin: 10px 0 0 10px;
//   border-radius: 0;
//   cursor: pointer;
//   padding: 12px;
//   overflow: hidden;
//   box-sizing: border-box;
//   width: ${({ size }) => `${size}px`};
//   height: ${({ size }) => `${size}px`};
//   background-color: ${({ backgroundColour }) => backgroundColour};
// `

// const StyledButtonLink = styled(ButtonLink)`
//   font-size: ${FONT_SIZE.SIZE_16};
//   margin: 0;
//   display: inline-block;
//   padding: 0;
//   width: auto;
//   border: none;
//   vertical-align: baseline;
//   &::before {
//     display: none;
//   }
// `
// const StyledButtonWrapper = styled('button')`
//   margin-top: 10px;
// `

const ExportDetailsForm = ({
  id,
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
}) => {
  const { exportId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.exportPipeline.details(exportId),
      text: title,
    },
  ]
  return (
    <DefaultLayout
      subheading={company}
      heading={`’${title}’`}
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
                  {isEmpty(exporterExperience) ? 'Not set' : exporterExperience}
                </SummaryTable.Row>
                <SummaryTable.ListRow
                  heading="Company contacts"
                  value={contacts}
                  emptyValue="Not set"
                  hideWhenEmpty={false}
                ></SummaryTable.ListRow>
                <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
                  {isEmpty(notes) ? 'Not set' : notes}
                </SummaryTable.Row>
                <StyledButton>
                  <Button
                    as={Link}
                    href={urls.exportPipeline.details(exportId)}
                    buttonColour={GREY_3}
                    buttonTextColour={BLACK}
                    data-test="edit-export-details-button"
                  >
                    Edit
                  </Button>
                </StyledButton>
                <StyledLink href={urls.exportPipeline.details(exportId)}>
                  Delete
                </StyledLink>
              </StyledSummaryTable>
            )
          )
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportDetailsForm)
