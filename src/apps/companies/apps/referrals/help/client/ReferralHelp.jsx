import React from 'react'
import { connect } from 'react-redux'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'
import urls from '../../../../../../lib/urls'

import Task from '../../../../../../client/components/Task'
import { state2props } from './state'

import { REFERRAL_DETAILS } from '../../../../../../client/actions'

const AdviserDetails = ({ name, email }) => (
  <>
    {name}
    {email && (
      <>
        , <a href={`mailto:${email}`}>{email}</a>
      </>
    )}
  </>
)

export default connect(state2props)(
  ({ companyId, referralId, company, sendingAdviser }) => {
    // Although this input creates impurity I think for simplicity its ok in this context
    const host = `${window.location.protocol}//${window.location.host}`
    const relReferralLink = urls.companies.referrals.details(
      companyId,
      referralId
    )
    const absReferralLink = `${host}${urls.companies.referrals.details(
      companyId,
      referralId
    )}`
    return (
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
              <H2 size={LEVEL_SIZE[3]}>More information needed</H2>
              <p>
                If you need additional details or information about the
                referral, contact the adviser who sent the referral by email:{' '}
                <AdviserDetails {...sendingAdviser} />, Or find more contact
                details on{' '}
                <Link href={urls.external.digitalWorkspace.teams}>
                  Digital Workspace
                </Link>
                .
              </p>
              <H2 size={LEVEL_SIZE[3]}>
                A different adviser should follow up on this referral
              </H2>
              <p>
                If you are not the right person to help this business, ask a
                colleague to complete the referral. You can copy and send them a
                direct link to the referral:{' '}
                <Link href={relReferralLink}>{absReferralLink}</Link>.
              </p>
              <Link href={relReferralLink}>Go back to the referral</Link>
            </>
          )
        }
      </Task.Status>
    )
  }
)
