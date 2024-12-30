import React from 'react'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

// import InteractionResource from '../../../components/Resource/Interaction'
// Remove this import and delete the file once the endpoint is in place
import exportInteraction from './exportInteraction.json'
import {
  formatDate,
  DATE_FORMAT_DAY_MONTH_YEAR,
} from '../../../utils/date-utils'
import {
  SummaryTable,
  DefaultLayout,
  SecondaryButton,
} from '../../../components'
import { ExportProjectTitle } from '../Export'
import urls from '../../../../lib/urls'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ActionsContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`

const StyledLink = styled.a`
  margin-bottom: 50px;
`

const EXPORT_ID_REGEX = /\/export\/([a-f0-9-]+)\/interactions\/details/
const HELPED_REMOVE_EXPORT_BARRIER = {
  null: 'Unknown',
  true: 'Yes',
  false: 'No',
}

const ExportInteractionsDetails = () => {
  const location = useLocation()
  const matchId = location.pathname.match(EXPORT_ID_REGEX)
  const exportId = matchId && matchId[1]

  return (
    <DefaultLayout
      heading={<ExportProjectTitle id={exportId} />}
      pageTitle="Export interaction details"
      breadcrumbs={[
        { link: urls.exportPipeline.index(), text: 'Home' },
        {
          link: urls.exportPipeline.interactions.index(exportId),
          text: 'Interactions',
        },
        { text: <ExportProjectTitle id={exportId} /> },
      ]}
    >
      {/* 
       Uncomment InteractionResource and move the StyledSummaryTable up into
       the InteractionResource render function once the export projects
       interaction endpoint is in place. Warning, we may have to create a
       new Resource.

      <InteractionResource id={exportId}>
        {(exportInteraction) => ()}
      </InteractionResource> */}

      <StyledSummaryTable>
        <SummaryTable.Row heading="Company">
          <Link
            data-test="export-company-link"
            href={urls.companies.detail(exportInteraction.company.id)}
          >
            {exportInteraction.company.name.toUpperCase()}
          </Link>
        </SummaryTable.Row>
        <SummaryTable.Row heading="Contact(s)">
          <ul>
            {exportInteraction.contacts.map((contact, index) => (
              <li key={`contact-${index}`}>
                <Link href={urls.contacts.details(contact.id)}>
                  {contact.name}
                </Link>
              </li>
            ))}
          </ul>
        </SummaryTable.Row>
        <SummaryTable.Row heading="Service">
          {exportInteraction.service.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Notes">
          {exportInteraction.notes}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Date of interaction">
          {formatDate(exportInteraction.date, DATE_FORMAT_DAY_MONTH_YEAR)}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Adviser(s)">
          <ul>
            {exportInteraction.dit_participants.map((participant, index) => (
              <li key={`participant-${index}`}>
                {participant.adviser.name}, {participant.team.name}
              </li>
            ))}
          </ul>
        </SummaryTable.Row>
        <SummaryTable.Row heading="Communication channel">
          {exportInteraction.communication_channel.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Named trade agreement(s)">
          <ul>
            {exportInteraction.related_trade_agreements.map(
              (tradeAgreement, index) => (
                <li key={`trade-agreement-${index}`}>{tradeAgreement.name}</li>
              )
            )}
          </ul>
        </SummaryTable.Row>
        <SummaryTable.Row heading="Helped remove an export barrier">
          {
            HELPED_REMOVE_EXPORT_BARRIER[
              exportInteraction.helped_remove_export_barrier
            ]
          }
        </SummaryTable.Row>
      </StyledSummaryTable>
      <ActionsContainer>
        <SecondaryButton
          data-test="add-interaction"
          as={StyledLink}
          href="/"
          aria-label="Add interaction"
        >
          Add interaction
        </SecondaryButton>
        <StyledLink
          data-test="back"
          href={urls.exportPipeline.interactions.index(exportId)}
        >
          Back
        </StyledLink>
      </ActionsContainer>
    </DefaultLayout>
  )
}

export default ExportInteractionsDetails
