import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { SummaryTable, FormActions } from 'data-hub-components'
import { H4, Button, Link } from 'govuk-react'
import SecondaryButton from '../../../../../client/components/SecondaryButton'

const StyledParagraph = styled('p')`
  font-size: 16px;
`

const SendReferralConfirmation = ({
  companyName,
  companyId,
  adviser,
  subject,
  contact,
  notes,
  cancelUrl,
  onBack,
  csrfToken,
}) => {
  return (
    <>
      <SummaryTable caption="Check referral details">
        <SummaryTable.Row heading="Send this company record to">
          {adviser.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Subject">{subject}</SummaryTable.Row>
        <SummaryTable.Row heading="Notes">
          {notes || 'No notes added'}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Company contact">
          {contact?.name || 'No contact added'}
        </SummaryTable.Row>
      </SummaryTable>
      <SecondaryButton onClick={onBack}>Edit referral</SecondaryButton>
      <H4>What happens next</H4>
      <StyledParagraph>
        <p>
          <p>
            Clicking “Send referral” will show the referral in the activity of{' '}
            {` ${companyName}`}, as well as in the Referrals section on both
            your Data Hub Homepage and the Homepage of the recipient.
          </p>
          <p>It might take up to 24 hours for the referral to appear.</p>
          <p>You will not be able to edit the referral after this point.</p>
        </p>
      </StyledParagraph>
      <form method="post">
        <input name="recipient" value={adviser.id} type="hidden"></input>
        <input name="subject" value={subject} type="hidden"></input>
        <input name="notes" value={notes} type="hidden"></input>
        <input name="contact" value={contact?.id} type="hidden"></input>
        <input name="company" value={companyId} type="hidden"></input>
        <input name="_csrf" value={csrfToken} type="hidden"></input>
        <FormActions>
          <Button>Send referral</Button>
          <Link href={cancelUrl}>Cancel</Link>
        </FormActions>
      </form>
    </>
  )
}

SendReferralConfirmation.propTypes = {
  companyId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default SendReferralConfirmation
