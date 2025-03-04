import React from 'react'
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
import {
  ExportResource,
  InteractionResource,
} from '../../../components/Resource'
import {
  transformAdvisers,
  transformArray,
  transformCompany,
  transformContacts,
} from '../../Interactions/InteractionDetails/transformers'
import { transformBoolToYesNo } from '../../../transformers'

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
const NOT_SET = 'Not set'

const ExportInteractionsDetails = () => {
  const params = useParams()
  const { exportId, interactionId } = params

  return (
    <>
      <InteractionResource id={interactionId}>
        {({
          subject,
          company,
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
          <ExportResource id={exportId}>
            {({ title }) =>
              title && (
                <DefaultLayout
                  heading={subject}
                  pageTitle="Export interaction details"
                  breadcrumbs={[
                    { link: urls.exportPipeline.index(), text: 'Home' },
                    {
                      link: urls.exportPipeline.interactions.index(exportId),
                      text: `${title}`,
                    },
                    { text: 'Interactions' },
                  ]}
                >
                  <StyledSummaryTable>
                    {company && transformCompany(company)}
                    <SummaryTable.Row
                      heading="Contact(s)"
                      hideWhenEmpty={false}
                      children={
                        contacts.length > 0
                          ? transformContacts(contacts)
                          : NOT_SET
                      }
                    />
                    <SummaryTable.Row
                      heading="Service"
                      hideWhenEmpty={false}
                      children={service ? service.name : NOT_SET}
                    />
                    <SummaryTable.Row
                      heading="Notes"
                      hideWhenEmpty={false}
                      children={notes ? notes : NOT_SET}
                    />
                    <SummaryTable.Row
                      heading="Date of interaction"
                      hideWhenEmpty={false}
                      children={
                        date
                          ? formatDate(date, DATE_FORMAT_DAY_MONTH_YEAR)
                          : NOT_SET
                      }
                    />
                    <SummaryTable.Row
                      heading="Adviser(s)"
                      hideWhenEmpty={false}
                      children={
                        !!ditParticipants && ditParticipants.length > 0
                          ? transformAdvisers(ditParticipants)
                          : NOT_SET
                      }
                    />
                    <SummaryTable.Row
                      heading="Communication channel"
                      hideWhenEmpty={false}
                      children={
                        communicationChannel
                          ? communicationChannel.name
                          : NOT_SET
                      }
                    />
                    <SummaryTable.Row
                      heading="Named trade agreement(s)"
                      hideWhenEmpty={false}
                      children={
                        !!hasRelatedTradeAgreements &&
                        hasRelatedTradeAgreements.length > 0
                          ? transformArray(relatedTradeAgreements)
                          : NOT_SET
                      }
                    />
                    <SummaryTable.Row
                      heading="Helped remove an export barrier"
                      children={
                        !!helpedRemoveExportBarrier
                          ? transformBoolToYesNo(helpedRemoveExportBarrier)
                          : NOT_SET
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
                      href={urls.exportPipeline.interactions.index(exportId)}
                    >
                      Back
                    </StyledLink>
                  </ActionsContainer>
                </DefaultLayout>
              )
            }
          </ExportResource>
        )}
      </InteractionResource>
    </>
  )
}

export default ExportInteractionsDetails
