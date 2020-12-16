import React from 'react'
import { H2, Button, Link } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import UnorderedList from '@govuk-react/unordered-list'
import ListItem from '@govuk-react/list-item'

import { useFormContext } from '../../../../../../client/components/Form/hooks'

import {
  SummaryTable,
  FormActions,
  SecondaryButton,
  FieldInput,
} from '../../../../../../client/components'

const StepReferralConfirmation = ({ cancelUrl }) => {
  const { values = {}, goBack } = useFormContext()

  return (
    <>
      {/* TODO: remove when bug with Steps not pulling data from form context is fixed */}
      <FieldInput name="confirmed" type="hidden" />
      <H2 size={LEVEL_SIZE[3]}>Check referral details</H2>
      <SummaryTable>
        <SummaryTable.Row heading="Refer this company to">
          {values.adviser.label}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Subject">{values.subject}</SummaryTable.Row>
        <SummaryTable.Row heading="Notes">
          {values.notes || 'No notes added'}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Company contact">
          {values.contact?.label || 'No contact added'}
        </SummaryTable.Row>
      </SummaryTable>
      <SecondaryButton name="back" onClick={goBack}>
        Edit Referral
      </SecondaryButton>
      <H2 size={LEVEL_SIZE[3]}>What happens next</H2>
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
      <FormActions>
        <Button name="forward">Send referral</Button>
        <Link href={cancelUrl}>Cancel</Link>
      </FormActions>
    </>
  )
}

export default StepReferralConfirmation
