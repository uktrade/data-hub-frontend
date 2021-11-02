import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import { FONT_WEIGHTS, LINE_HEIGHT } from '@govuk-react/constants'

import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import {
  Main,
  NewWindowLink,
  FieldRadios,
  FormStateful,
  FieldInput,
  Typeahead,
} from '../../../../client/components'
import FieldWrapper from '../../../../client/components/Form/elements/FieldWrapper'

// TODO: Move this somewhere else and share both
const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.bold};
    line-height: ${LINE_HEIGHT.SIZE_16};
  }
`

const EventForm = (props) => {
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
    {
      text: 'Add event',
    },
  ]

  return (
    <>
      <LocalHeader breadcrumbs={breadcrumbs} heading="Add event" />
      <Main>
        <GridRow data-test="eventForm">
          <GridCol setWidth="three-quarters">
            <article>
              <p data-test="trade-agreement-text">
                If your Event is set up to focus on a Trade Agreement or
                contributes to implementing a Trade Agreement then select that
                the event relates to a Trade Agreement and the relevant
                Agreement(s)
              </p>
              <NewWindowLink
                href={urls.external.helpCentre.tradeagreementGuidance()}
                data-test="trade-agreement-link"
              >
                See more guidance
              </NewWindowLink>
            </article>
            <FormStateful
              id="add-event-form"
              showErrorSummary={true}
              initialValues={{
                ...props,
              }}
            >
              <FieldRadios
                legend="Does the Event relate to a Trade Agreement?"
                name="has_related_trade_agreements"
                required="This field is required."
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' },
                ]}
                inline={true}
              />
              <FieldInput
                label="Event name"
                name="name"
                type="text"
                required="This field may not be null."
                data-test="group-field-name"
              />
              <StyledFieldWrapper
                label="Type of event"
                name=""
                hint=""
                {...props}
              >
                <Typeahead
                  name="event_type"
                  inputId="event_type"
                  options={[]}
                  placeholder="-- Select event type --"
                  required="Select at least one event type"
                  aria-label="Select an event type"
                />
              </StyledFieldWrapper>
            </FormStateful>
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

export default EventForm
