import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { TASK_GET_ESS_INTERACTION_DETAILS, ID, state2props } from './state'
import { INTERACTION_ESS_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import {
  DefaultLayout,
  LocalNav,
  LocalNavLink,
  NewWindowLink,
  SummaryTable,
} from '../../../components'

import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ESSInteractionDetails = ({
  name,
  // eventDate,
  // location,
  // fullAddress,
  // registrationStatusCounts,
}) => {
  const { essInteractionId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.interactions.index(),
      text: 'Interactions',
    },
    {
      text: name,
    },
  ]

  return (
    <DefaultLayout
      heading={name}
      pageTitle="Interaction ESS"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <Task.Status
        name={TASK_GET_ESS_INTERACTION_DETAILS}
        id={ID}
        progressMessage="loading Export Support Service Interaction details"
        startOnRender={{
          payload: essInteractionId,
          onSuccessDispatch: INTERACTION_ESS_DETAILS_LOADED,
        }}
      >
        {() => {

          return (
            name && (
              <>
                <GridRow data-test="eventEssDetails">
                  <GridCol setWidth="one-quarter">
                  </GridCol>
                  <GridCol setWidth="three-quarters">
                    <StyledSummaryTable>
                      <SummaryTable.Row
                        heading="Interaction date"
                        children={"Test"}
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
