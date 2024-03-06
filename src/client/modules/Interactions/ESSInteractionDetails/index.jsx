import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom-v5-compat'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { TASK_GET_ESS_INTERACTION_DETAILS, ID, state2props } from './state'
import { INTERACTION__ESS_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { DefaultLayout, SummaryTable } from '../../../components'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ESSInteractionDetails = ({
  subject,
  question,
  dateOfInteraction,
  countries,
  companyName,
  enquirer,
}) => {
  const { essInteractionId } = useParams()

  const breadcrumbs = [
    {
      link: urls.dashboard.index(),
      text: 'Home',
    },
    {
      link: urls.interactions.index(),
      text: 'Interactions',
    },
    {
      text: subject,
    },
  ]

  return (
    <DefaultLayout
      heading={subject}
      pageTitle="ESS Interaction"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      {/* TODO: Use Resource */}
      <Task.Status
        name={TASK_GET_ESS_INTERACTION_DETAILS}
        id={ID}
        progressMessage="loading Export Support Service Interaction details"
        startOnRender={{
          payload: essInteractionId,
          onSuccessDispatch: INTERACTION__ESS_DETAILS_LOADED,
        }}
      >
        {() => {
          return (
            subject && (
              <>
                <GridRow data-test="essInteractionDetails">
                  <GridCol setWidth="three-quarters">
                    <StyledSummaryTable>
                      <SummaryTable.Row
                        heading="Company"
                        children={companyName}
                      />
                      <SummaryTable.Row
                        heading="Enquirer"
                        children={enquirer}
                      />
                      <SummaryTable.Row heading="Subject" children={subject} />
                      <SummaryTable.Row
                        heading="Question"
                        children={question}
                      />
                      <SummaryTable.Row
                        heading="Date of interaction"
                        children={dateOfInteraction}
                      />
                      <SummaryTable.Row
                        heading="Countries"
                        children={countries}
                      />
                      <SummaryTable.Row
                        heading="Communication channel"
                        children="Export Support Services"
                      />
                    </StyledSummaryTable>
                  </GridCol>
                </GridRow>
              </>
            )
          )
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ESSInteractionDetails)
