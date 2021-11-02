import React from 'react'
import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main, NewWindowLink } from '../../../../client/components'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

const EventForm = ({}) => {
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
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

export default EventForm
