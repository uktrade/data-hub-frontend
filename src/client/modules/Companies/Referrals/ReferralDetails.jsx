import React from 'react'
import { connect } from 'react-redux'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { ID as STATE_ID } from './state'

import SecondaryButton from '../../../components/SecondaryButton'
import { DefaultLayout, SummaryTable, FormActions } from '../../../components'
import { CompanyResource, ReferralResource } from '../../../components/Resource'
import { CompanyName } from './SendReferralForm/SendReferralForm'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../../utils/date-utils')

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

const transformAdviser = ({ name, contactEmail, ditTeam }) => {
  const transformedAdviser = {
    name,
    email: contactEmail,
    team: ditTeam && ditTeam.name,
  }
  return <AdviserDetails {...transformedAdviser} />
}

const BackButton = ({ referrerUrl, companyId }) => {
  const cameFromHomePage = referrerUrl
    ? new URL(referrerUrl).pathname === urls.companies.referrals.list()
    : false
  return (
    <Link
      href={
        cameFromHomePage
          ? urls.companies.referrals.list()
          : urls.companies.detail(companyId)
      }
      data-test="back-button"
    >
      Back
    </Link>
  )
}

export default connect(({ referrerUrl, ...state }) => ({
  ...state[STATE_ID],
  referrerUrl,
}))(({ referrerUrl }) => {
  const { companyId, referralId } = useParams()
  return (
    <DefaultLayout
      heading={'Referral'}
      pageTitle={`Referral - ${(<CompanyName id={companyId} />)} - Companies`}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        {
          link: urls.companies.detail(companyId),
          text: <CompanyName id={companyId} />,
        },
        { text: 'Referral' },
      ]}
      useReactRouter={false}
    >
      <ReferralResource id={referralId}>
        {(referral) => (
          <CompanyResource id={companyId}>
            {(company) => (
              <>
                <SummaryTable
                  caption={referral.subject}
                  data-test="referral-details-table"
                >
                  <SummaryTable.Row heading="Company">
                    <Link href={urls.companies.detail(company.id)}>
                      {company.name}
                    </Link>
                  </SummaryTable.Row>
                  {referral.contact && (
                    <SummaryTable.Row heading="Contact">
                      <Link href={urls.contacts.contact(referral.contact.id)}>
                        {referral.contact.name}
                      </Link>
                    </SummaryTable.Row>
                  )}
                  <SummaryTable.Row heading="Sending adviser">
                    {referral.createdBy && transformAdviser(referral.createdBy)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Receiving adviser">
                    {referral.recipient && transformAdviser(referral.recipient)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Date of referral">
                    {formatDate(referral.createdOn, DATE_FORMAT_COMPACT)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Notes">
                    {referral.notes}
                  </SummaryTable.Row>
                </SummaryTable>
                {referral.completedOn ? (
                  <>
                    <SummaryTable
                      caption="Referral accepted"
                      data-test="complete-referral-table"
                    >
                      <SummaryTable.Row heading="Date">
                        {formatDate(referral.completedOn, DATE_FORMAT_COMPACT)}
                      </SummaryTable.Row>
                      <SummaryTable.Row heading="By">
                        <AdviserDetails {...referral.completedBy} />
                      </SummaryTable.Row>
                      <SummaryTable.Row heading="With interaction">
                        <Link
                          href={urls.interactions.detail(
                            referral.interaction?.id
                          )}
                        >
                          {referral.interaction?.subject}
                        </Link>
                      </SummaryTable.Row>
                    </SummaryTable>
                    <FormActions>
                      <BackButton
                        referrerUrl={referrerUrl}
                        companyId={companyId}
                      />
                    </FormActions>
                    <br />
                  </>
                ) : (
                  <>
                    <Details
                      summary="Why can I not edit the referral?"
                      data-test="cannot-edit-details"
                    >
                      <p>
                        For now, you can't edit the referral once it's been
                        sent.
                      </p>
                      <p>Contact the recipient if something's changed.</p>
                    </Details>
                    <FormActions>
                      <Button
                        as={'a'}
                        data-test="accept-button"
                        href={urls.companies.referrals.interactions.create(
                          company.id,
                          referralId
                        )}
                      >
                        Accept referral
                      </Button>
                      <SecondaryButton
                        as={'a'}
                        data-test="help-button"
                        href={urls.companies.referrals.help(
                          company.id,
                          referralId
                        )}
                      >
                        I cannot accept the referral
                      </SecondaryButton>
                      <BackButton
                        referrerUrl={referrerUrl}
                        companyId={companyId}
                      />
                    </FormActions>
                  </>
                )}
              </>
            )}
          </CompanyResource>
        )}
      </ReferralResource>
    </DefaultLayout>
  )
})
