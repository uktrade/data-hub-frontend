import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import urls from '../../../../lib/urls'
import { EXPORT_LOADED } from '../../../actions'
import { DefaultLayout, SummaryTable } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EXPORT_DETAIL } from './state'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { format } from '../../../../client/utils/date'
import { currencyGBP } from '../../../../client/utils/number-utils'

import { BLACK, GREY_3 } from '../../../utils/colours'
import { capitalize } from 'lodash'
import { transformIdNameToValueLabel } from '../../../transformers'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 30,
})

// const StyledButton = styled(Button)({
//   margin: 0,
//   marginRight: 40,
// })

const getBreadcrumbs = (exportItem) => {
  const defaultBreadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
  ]

  if (exportItem) {
    return [...defaultBreadcrumbs, { text: exportItem.title }]
  }

  return defaultBreadcrumbs
}

const ExportDetailsForm = ({ exportItem }) => {
  const { exportId } = useParams()

  return (
    <DefaultLayout
      heading={exportItem ? exportItem.title : ''}
      subheading={exportItem?.company?.name}
      pageTitle="Export details"
      breadcrumbs={getBreadcrumbs(exportItem)}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_EXPORT_DETAIL}
        id={ID}
        progressMessage="loading export details"
        startOnRender={{
          payload: exportId,
          onSuccessDispatch: EXPORT_LOADED,
        }}
      >
        {() => {
          return (
            exportItem && (
              <>
                <StyledSummaryTable>
                  <SummaryTable.Row
                    heading="Export title"
                    children={exportItem.title}
                  />
                  <SummaryTable.Row heading="Owner">
                    {isEmpty(exportItem.owner)
                      ? 'Not set'
                      : exportItem?.owner.name}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Team members"
                    emptyValue="Not set"
                    hideWhenEmpty={true}
                    value={exportItem.team_members.map(
                      transformIdNameToValueLabel
                    )}
                  ></SummaryTable.ListRow>
                  <SummaryTable.Row
                    heading="Total estimated export value"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem.estimated_export_value_amount)
                      ? 'Not set'
                      : `${
                          exportItem.estimated_export_value_years?.name
                        } / ${currencyGBP(
                          exportItem.estimated_export_value_amount
                        )}`}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Estimated date for Win"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem.estimated_win_date)
                      ? 'Not set'
                      : format(exportItem.estimated_win_date, 'MMMM yyyy')}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Status" hideWhenEmpty={false}>
                    {isEmpty(exportItem.status)
                      ? 'Not set'
                      : capitalize(exportItem.status)}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Export potential"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem.export_potential)
                      ? 'Not set'
                      : capitalize(exportItem.export_potential)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Destination" hideWhenEmpty={false}>
                    {isEmpty(exportItem.destination_country)
                      ? 'Not set'
                      : exportItem.destination_country.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Main sector" hideWhenEmpty={false}>
                    {isEmpty(exportItem.sector)
                      ? 'Not set'
                      : exportItem.sector.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row
                    heading="Exporter experience"
                    hideWhenEmpty={false}
                  >
                    {isEmpty(exportItem.exporter_experience)
                      ? 'Not set'
                      : exportItem.exporter_experience.name}
                  </SummaryTable.Row>
                  <SummaryTable.ListRow
                    heading="Company contacts"
                    value={exportItem.contacts.map(transformIdNameToValueLabel)}
                    emptyValue="Not set"
                    hideWhenEmpty={false}
                  ></SummaryTable.ListRow>
                  <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
                    {isEmpty(exportItem.notes) ? 'Not set' : exportItem.notes}
                  </SummaryTable.Row>{' '}
                </StyledSummaryTable>
                <Container>
                  <Button
                    as={Link}
                    href={urls.exportPipeline.edit(exportId)}
                    buttonColour={GREY_3}
                    buttonTextColour={BLACK}
                    data-test="edit-export-details-button"
                  >
                    Edit
                  </Button>
                  <Link
                    href={urls.exportPipeline.delete(exportId)}
                    data-test="delete-export-details-button"
                  >
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
