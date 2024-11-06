import React from 'react'
import { connect } from 'react-redux'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import { DefaultLayout, NewWindowLink } from '../../../../components'
import urls from '../../../../../lib/urls'

import Task from '../../../../components/Task'
import { state2props } from './state'

import { REFERRAL_DETAILS } from '../../../../actions'

import { buildCompanyBreadcrumbs } from '../../utils'

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

export default connect(state2props)(({ company, sendingAdviser }) => {
  const { companyId, referralId } = useParams()

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
          <DefaultLayout
            pageTitle={`I cannot accept this referral - Referral - ${company.name} - Companies`}
            heading="I cannot accept this referral"
            breadcrumbs={buildCompanyBreadcrumbs(
              [
                {
                  link: urls.companies.referrals.details(companyId, referralId),
                  text: 'Referral',
                },
                { text: 'I cannot accept this referral' },
              ],
              companyId,
              company.name
            )}
          >
            <H2 size={LEVEL_SIZE[3]}>I need more information</H2>

            <p>
              Contact the sender for more info:{' '}
              <AdviserDetails {...sendingAdviser} />
            </p>
            <p>
              Or{' '}
              <NewWindowLink href={urls.external.digitalWorkspace.teams}>
                find their contact details on the Intranet
              </NewWindowLink>
            </p>
            <H2 size={LEVEL_SIZE[3]}>I'm not the right adviser for this</H2>

            <p>
              Forward this referral onto someone else. Paste this URL into an
              email: <Link href={relReferralLink}>{absReferralLink}</Link>
            </p>
            <Link href={relReferralLink}>Back to the referral</Link>
            <br />
            <br />
          </DefaultLayout>
        )
      }
    </Task.Status>
  )
})
