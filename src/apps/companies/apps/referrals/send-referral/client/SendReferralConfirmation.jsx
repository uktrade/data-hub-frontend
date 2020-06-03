import React from 'react'
import PropTypes from 'prop-types'

import { SummaryTable, FormActions } from 'data-hub-components'
import { H4, Button, Link } from 'govuk-react'
import UnorderedList from '@govuk-react/unordered-list'
import ListItem from '@govuk-react/list-item'

import SecondaryButton from '../../../../../../client/components/SecondaryButton'
import LocalHeader from '../../../../../../client/components/LocalHeader/LocalHeader'
import { Main } from '../../../../../../client/components/'
import { companies, dashboard } from '../../../../../../lib/urls'

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
      <LocalHeader
        heading={'Send a referral'}
        breadcrumbs={[
          { link: dashboard(), text: 'Home' },
          { link: companies.index(), text: 'Companies' },
          { link: companies.detail(companyId), text: companyName },
          { text: 'Send a referral' },
        ]}
      />

      <Main>
        <SummaryTable caption="Check referral details">
          <SummaryTable.Row heading="Refer this company to">
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
        <UnorderedList listStyleType="bullet">
          <ListItem>
            You won't be able to edit the referral after this point
          </ListItem>
          <ListItem>
            A link to the referral will appear on the company record, your
            homepage and the recipient's homepage
          </ListItem>
          <ListItem>The referral might take 24 hours to appear</ListItem>
        </UnorderedList>
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
      </Main>
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
