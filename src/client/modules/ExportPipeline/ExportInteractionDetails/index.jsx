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
                    {contacts && (
                      <SummaryTable.Row
                        heading="Contact(s)"
                        children={transformContacts(contacts)}
                      />
                    )}
                    {service && (
                      <SummaryTable.Row
                        heading="Service"
                        children={service.name}
                      />
                    )}
                    {notes && (
                      <SummaryTable.Row heading="Notes" children={notes} />
                    )}
                    {date && (
                      <SummaryTable.Row
                        heading="Date of interaction"
                        children={formatDate(date, DATE_FORMAT_DAY_MONTH_YEAR)}
                      />
                    )}
                    {ditParticipants && (
                      <SummaryTable.Row
                        heading="Adviser(s)"
                        children={transformAdvisers(ditParticipants)}
                      />
                    )}
                    {communicationChannel && (
                      <SummaryTable.Row
                        heading="Communication channel"
                        children={communicationChannel.name}
                      />
                    )}
                    {hasRelatedTradeAgreements && (
                      <SummaryTable.Row
                        heading="Named trade agreement(s)"
                        children={transformArray(relatedTradeAgreements)}
                      />
                    )}
                    {
                      <SummaryTable.Row
                        heading="Helped remove an export barrier"
                        children={transformBoolToYesNo(
                          helpedRemoveExportBarrier
                        )}
                      />
                    }
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
