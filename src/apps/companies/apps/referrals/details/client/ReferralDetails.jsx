import React from 'react'
import { connect } from 'react-redux'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import { SummaryTable, FormActions, DateUtils } from 'data-hub-components'
import urls from '../../../../../../lib/urls'

import SecondaryButton from '../../../../../../client/components/SecondaryButton'
import Task from '../../../../../../client/components/Task'
import { state2props } from './state'

import { REFERRAL_DETAILS } from '../../../../../../client/actions'

export const AdviserDetails = ({ name, email, team }) => (
  <>
    {name}
    {email && (
      <>
        , <a href={`mailto:${email}`}>{email}</a>
      </>
    )}
    {team && <>, {team}</>}
  </>
)

AdviserDetails.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  team: PropTypes.string,
}

export default connect(state2props)(
  ({
    subject,
    referralId,
    company,
    companyId,
    contact,
    sendingAdviser,
    receivingAdviser,
    date,
    notes,
  }) => (
    <Task.Status
      name="Referral details"
      id="referralDetails"
      progressMessage="loading referral details"
      startOnRender={{
        payload: referralId,
        onSuccessDispatch: REFERRAL_DETAILS,
      }}
    >
      {() =>
        company && (
          <>
            <SummaryTable caption={subject}>
              <SummaryTable.Row heading="Company">{company}</SummaryTable.Row>
              <SummaryTable.Row heading="Contact">{contact}</SummaryTable.Row>
              <SummaryTable.Row heading="Sending adviser">
                {sendingAdviser && <AdviserDetails {...sendingAdviser} />}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Receiving adviser">
                {receivingAdviser && <AdviserDetails {...receivingAdviser} />}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Date of referral">
                {DateUtils.format(date)}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Notes">{notes}</SummaryTable.Row>
            </SummaryTable>
            <Details summary="Why can I not edit the referral?">
              <p>For now, you can't edit the referral once it's been sent.</p>
              <p>Contact the recipient if something's changed.</p>
            </Details>
            <FormActions>
              <Button as={Link} href="/">
                Accept referral
              </Button>
              <SecondaryButton
                as={Link}
                href={urls.companies.referrals.help(companyId, referralId)}
              >
                I cannot accept the referral
              </SecondaryButton>
              <Link href="/">Back</Link>
            </FormActions>
          </>
        )
      }
    </Task.Status>
  )
)
