import React from 'react'
import { Link } from 'govuk-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  formatDate,
  DATE_FORMAT_DAY_MONTH_YEAR,
} from '../../../utils/date-utils'
import {
  SummaryTable,
  DefaultLayout,
  SecondaryButton,
} from '../../../components'
import urls from '../../../../lib/urls'
import { InteractionResource } from '../../../components/Resource'
import {
  transformAdvisers,
  transformArray,
  transformContacts,
} from '../../Interactions/InteractionDetails/transformers'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'

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

const ExportInteractionsDetails = () => {
  const params = useParams()
  const { interactionId } = params

  return (
    <>
      <InteractionResource id={interactionId}>
        {({
          subject,
          company,
          companyExport,
          contacts,
          service,
          notes,
          date,
          ditParticipants,
          communicationChannel,
          hasRelatedTradeAgreements,
          relatedTradeAgreements,
          helpedRemoveExportBarrier,
        }) => (
          <DefaultLayout
            heading={subject}
            pageTitle="Export interaction details"
            breadcrumbs={[
              { link: urls.exportPipeline.index(), text: 'Home' },
              {
                link: companyExport
                  ? urls.exportPipeline.interactions.index(companyExport.id)
                  : null,
                text: companyExport ? companyExport.title : NOT_SET_TEXT,
              },
              { text: 'Interactions' },
            ]}
          >
            <StyledSummaryTable>
              <SummaryTable.Row
                heading="Company"
                hideWhenEmpty={false}
                children={
                  company ? (
                    <Link href={urls.companies.overview.index(company.id)}>
                      {company.name}
                    </Link>
                  ) : (
                    NOT_SET_TEXT
                  )
                }
              />
              <SummaryTable.Row
                heading="Contact(s)"
                hideWhenEmpty={false}
                children={
                  contacts.length > 0
                    ? transformContacts(contacts)
                    : NOT_SET_TEXT
                }
              />
              <SummaryTable.Row
                heading="Service"
                hideWhenEmpty={false}
                children={service ? service.name : NOT_SET_TEXT}
              />
              <SummaryTable.Row
                heading="Notes"
                hideWhenEmpty={false}
                children={notes ? notes : NOT_SET_TEXT}
              />
              <SummaryTable.Row
                heading="Date of interaction"
                hideWhenEmpty={false}
                children={
                  date
                    ? formatDate(date, DATE_FORMAT_DAY_MONTH_YEAR)
                    : NOT_SET_TEXT
                }
              />
              <SummaryTable.Row
                heading="Adviser(s)"
                hideWhenEmpty={false}
                children={
                  !!ditParticipants && ditParticipants?.length > 0
                    ? transformAdvisers(ditParticipants)
                    : NOT_SET_TEXT
                }
              />
              <SummaryTable.Row
                heading="Communication channel"
                hideWhenEmpty={false}
                children={
                  communicationChannel
                    ? communicationChannel.name
                    : NOT_SET_TEXT
                }
              />
              <SummaryTable.Row
                heading="Named trade agreement(s)"
                hideWhenEmpty={false}
                children={
                  hasRelatedTradeAgreements &&
                  relatedTradeAgreements?.length > 0
                    ? transformArray(relatedTradeAgreements)
                    : NOT_SET_TEXT
                }
              />
              <SummaryTable.Row
                heading="Helped remove an export barrier"
                children={
                  !!helpedRemoveExportBarrier
                    ? helpedRemoveExportBarrier
                      ? 'Yes'
                      : 'No'
                    : NOT_SET_TEXT
                }
              />
            </StyledSummaryTable>
            <ActionsContainer>
              <SecondaryButton
                data-test="edit-interaction"
                as={StyledLink}
                href={urls.interactions.edit(interactionId)}
                aria-label="Edit interaction"
              >
                Edit interaction
              </SecondaryButton>
              <StyledLink
                data-test="back"
                href={urls.exportPipeline.interactions.index(companyExport?.id)}
              >
                Back
              </StyledLink>
            </ActionsContainer>
          </DefaultLayout>
        )}
      </InteractionResource>
    </>
  )
}

export default ExportInteractionsDetails
