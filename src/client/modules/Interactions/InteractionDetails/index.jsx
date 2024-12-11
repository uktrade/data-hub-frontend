import React from 'react'
import PropTypes from 'prop-types'
import { Button, Details, Link } from 'govuk-react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { BLACK, GREY_3 } from '../../../../client/utils/colours'
import { InteractionResource } from '../../../components/Resource'
import InteractionReferralDetails from './InteractionReferralDetails'
import { SummaryTable } from '../../../components'
import ArchivePanel from '../../../components/ArchivePanel'
import CompleteInteraction from './CompleteInteraction'

import { currencyGBP } from '../../../utils/number-utils'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'
import {
  getEditLink,
  isEditable,
  isIncomplete,
  isNotEditable,
  setReferralId,
  transformAdvisers,
  transformArray,
  transformCompany,
  transformContacts,
  transformExportCountries,
  transformKind,
  transformService,
} from './transformers'

const EXPORT = 'export'

const ButtonBar = styled.div`
  > * {
    &:first-child {
      margin-right: ${SPACING.SCALE_4};
    }
  }
`

const InteractionDetails = ({ interactionId }) => {
  return (
    <InteractionResource id={interactionId}>
      {(interaction) => (
        <>
          {interaction.archived && (
            <ArchivePanel
              archivedBy={interaction.archivedBy}
              archivedOn={interaction.archivedOn}
              archiveReason={interaction.archivedReason}
              type={transformKind(interaction.kind)}
              archiveMessage={'cancelled'}
            />
          )}
          <SummaryTable data-test="interaction-details-table">
            {transformCompany(interaction.company, interaction.companies)}
            <SummaryTable.Row
              heading="Contact(s)"
              children={transformContacts(interaction.contacts)}
            />
            {interaction.service ? (
              <SummaryTable.Row
                heading="Service"
                children={transformService(interaction.service.name)}
              />
            ) : null}
            {interaction.serviceDeliveryStatus ? (
              <SummaryTable.Row
                heading="Service status"
                children={interaction.serviceDeliveryStatus.name}
              />
            ) : null}
            {interaction.grantAmountOffered ? (
              <SummaryTable.Row
                heading="Grant offered"
                children={currencyGBP(interaction.grantAmountOffered)}
              />
            ) : null}
            {interaction.netCompanyReceipt ? (
              <SummaryTable.Row
                heading="Net receipt"
                children={currencyGBP(interaction.netCompanyReceipt)}
              />
            ) : null}
            {interaction.notes ? (
              <SummaryTable.Row heading="Notes" children={interaction.notes} />
            ) : null}
            <SummaryTable.Row
              heading={`Date of ${transformKind(interaction.kind)}`}
              children={formatDate(interaction.date, DATE_FORMAT_FULL)}
            />
            {interaction.ditParticipants ? (
              <SummaryTable.Row
                heading="Adviser(s)"
                children={transformAdvisers(interaction.ditParticipants)}
              />
            ) : null}
            {interaction.investmentProject ? (
              <SummaryTable.Row
                heading="Investment project"
                children={
                  <Link
                    href={urls.investments.projects.details(
                      interaction.investmentProject.id
                    )}
                  >
                    {interaction.investmentProject.name}
                  </Link>
                }
              />
            ) : null}
            {interaction.kind === 'service_delivery' ? (
              <SummaryTable.Row
                heading="Event"
                children={
                  interaction.isEvent ? (
                    <Link href={urls.events.details(interaction.event.id)}>
                      {interaction.event.name}
                    </Link>
                  ) : (
                    'No'
                  )
                }
              />
            ) : null}
            {interaction.communicationChannel ? (
              <SummaryTable.Row
                heading="Communication channel"
                children={interaction.communicationChannel.name}
              />
            ) : null}
            {interaction.policyFeedbackNotes ? (
              <SummaryTable.Row
                heading="Business intelligence"
                children={interaction.policyFeedbackNotes}
              />
            ) : null}
            {interaction.exportCountries?.length > 0 &&
              transformExportCountries(interaction.exportCountries)}
            {interaction.relatedTradeAgreements?.length > 0 ? (
              <SummaryTable.Row
                heading="Named trade agreement(s)"
                children={transformArray(interaction.relatedTradeAgreements)}
              />
            ) : null}
            {interaction.largeCapitalOpportunity ? (
              <SummaryTable.Row
                heading="Related large capital opportunity"
                children={
                  <Link
                    href={urls.investments.opportunities.details(
                      interaction.largeCapitalOpportunity.id
                    )}
                  >
                    {interaction.largeCapitalOpportunity.name}
                  </Link>
                }
              />
            ) : null}
            {interaction.theme === EXPORT ? (
              <>
                <SummaryTable.Row
                  heading="Helped remove an export barrier"
                  children={
                    interaction.helpedRemoveExportBarrier ? 'Yes' : 'No'
                  }
                />
                {interaction.exportBarrierTypes.length > 0 && (
                  <SummaryTable.Row
                    heading="Export barrier category"
                    children={interaction.exportBarrierTypes
                      .map((barrierType) => barrierType.name)
                      .join(', ')}
                  />
                )}
                {interaction.exportBarrierNotes.length > 0 && (
                  <SummaryTable.Row
                    heading="Export barrier - other"
                    children={interaction.exportBarrierNotes}
                  />
                )}
              </>
            ) : null}
          </SummaryTable>
          <ButtonBar>
            <Button
              as={'a'}
              href={urls.tasks.createInteraction(interaction.id)}
              data-test="add-follow-up-task-button"
            >
              Add follow up task
            </Button>

            {isEditable(interaction.status) && (
              <Button
                as={'a'}
                href={getEditLink(
                  interaction.id,
                  interaction.company,
                  interaction.companies,
                  interaction.companyReferral
                )}
                buttonColour={GREY_3}
                buttonTextColour={BLACK}
                data-test="edit-interaction-button"
              >
                Edit {transformKind(interaction.kind)}
              </Button>
            )}

            {isIncomplete(
              interaction.status,
              interaction.date,
              interaction.archived
            ) && (
              <CompleteInteraction
                interactionId={interaction.id}
                companyObject={interaction.company}
                companyArray={interaction.companies}
                kind={transformKind(interaction.kind)}
                archived={interaction.archived}
              />
            )}
          </ButtonBar>
          {isNotEditable(
            interaction.status,
            interaction.date,
            interaction.archived
          ) && (
            <Details
              summary="Why can I not complete this interaction?"
              data-test="cannot-complete-interaction"
            >
              <div>
                This is an upcoming interaction, once the meeting has taken
                place, you will see a button that will allow you to complete the
                interaction.
              </div>

              <div>
                If you think the information is incomplete or incorrect,{' '}
                <Link href={urls.support()}>
                  get in touch using the support form.
                </Link>
              </div>
            </Details>
          )}
          {interaction.companyReferral && (
            <InteractionReferralDetails
              referral={interaction.companyReferral}
              companyId={setReferralId(
                interaction.companyReferral,
                interaction.companies
              )}
            />
          )}
        </>
      )}
    </InteractionResource>
  )
}
InteractionDetails.propTypes = {
  interactionId: PropTypes.string.isRequired,
}

export default InteractionDetails
