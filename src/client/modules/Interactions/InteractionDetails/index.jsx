import React from 'react'
import PropTypes from 'prop-types'
import { Button, Details, Link } from 'govuk-react'
import { BLACK, GREY_3 } from '../../../../client/utils/colours'

import InteractionResource from '../../../components/Resource/Interaction'
import InteractionReferralDetails from './InteractionReferralDetails'
import { NewWindowLink, SummaryTable } from '../../../components'
import ArchivePanel from '../../../components/ArchivePanel'
import CompleteInteraction from './CompleteInteraction'

import { currencyGBP } from '../../../utils/number-utils'
import { formatLongDate } from '../../../utils/date'
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

const InteractionDetails = ({ interactionId, archivedDocumentPath }) => {
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
            {interaction.service && (
              <SummaryTable.Row
                heading="Service"
                children={transformService(interaction.service.name)}
              />
            )}
            {interaction.serviceDeliveryStatus && (
              <SummaryTable.Row
                heading="Service status"
                children={interaction.serviceDeliveryStatus.name}
              />
            )}
            {interaction.grantAmountOffered && (
              <SummaryTable.Row
                heading="Grant offered"
                children={currencyGBP(interaction.grantAmountOffered)}
              />
            )}
            {interaction.netCompanyReceipt && (
              <SummaryTable.Row
                heading="Net receipt"
                children={currencyGBP(interaction.netCompanyReceipt)}
              />
            )}
            {interaction.notes && (
              <SummaryTable.Row heading="Notes" children={interaction.notes} />
            )}
            <SummaryTable.Row
              heading={`Date of ${transformKind(interaction.kind)}`}
              children={formatLongDate(interaction.date)}
            />
            {interaction.ditParticipants && (
              <SummaryTable.Row
                heading="Adviser(s)"
                children={transformAdvisers(interaction.ditParticipants)}
              />
            )}
            {interaction.investmentProject && (
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
            )}
            {interaction.kind === 'service_delivery' && (
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
            )}
            {interaction.communicationChannel && (
              <SummaryTable.Row
                heading="Communication channel"
                children={interaction.communicationChannel.name}
              />
            )}
            {interaction.policyIssueTypes.length > 0 && (
              <SummaryTable.Row
                heading="Policy issue types"
                children={transformArray(interaction.policyIssueTypes)}
              />
            )}
            {interaction.policyAreas.length > 0 && (
              <SummaryTable.Row
                heading="Policy areas"
                children={transformArray(interaction.policyAreas)}
              />
            )}
            {interaction.policyFeedbackNotes && (
              <SummaryTable.Row
                heading="Business intelligence"
                children={interaction.policyFeedbackNotes}
              />
            )}
            {interaction.exportCountries?.length > 0 &&
              transformExportCountries(interaction.exportCountries)}
            {interaction.relatedTradeAgreements?.length > 0 && (
              <SummaryTable.Row
                heading="Named trade agreement(s)"
                children={transformArray(interaction.relatedTradeAgreements)}
              />
            )}
            {interaction.largeCapitalOpportunity && (
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
            )}
            {interaction.archivedDocumentsUrlPath && (
              <SummaryTable.Row
                heading="Documents"
                children={
                  <NewWindowLink
                    href={
                      archivedDocumentPath +
                      interaction.archivedDocumentsUrlPath
                    }
                  >
                    View files and documents
                  </NewWindowLink>
                }
              />
            )}
            {interaction.theme === EXPORT && (
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
            )}
          </SummaryTable>
          {isEditable(interaction.status) && (
            <Button
              as={Link}
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
                <Link href={urls.support}>
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
