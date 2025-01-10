import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import StepReferralDetails from './StepReferralDetails'
import StepReferralConfirmation from './StepReferralConfirmation'
import Step from '../../../../components/Form/elements/Step'
import urls from '../../../../../lib/urls'
import Task from '../../../../components/Task'
import Form from '../../../../components/Form'
import { DefaultLayout } from '../../../../components'
import {
  AdviserResource,
  CompanyResource,
} from '../../../../components/Resource'
import State from '../../../../components/State'

import { ID as STATE_ID, TASK_SAVE_REFERRAL } from './state'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../../components/ContactForm/state'

export const CompanyName = ({ id }) => (
  <CompanyResource.Inline id={id}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const AdviserTeamName = ({ id }) => (
  <AdviserResource.Inline id={id}>
    {(adviser) => (adviser && adviser.dit_team ? adviser.dit_team.name : '')}
  </AdviserResource.Inline>
)

const SendReferralForm = ({ flashMessages }) => {
  const { companyId } = useParams()
  return (
    <DefaultLayout
      heading={'Send a referral'}
      pageTitle={`Send a referral - ${(<CompanyName id={companyId} />)} - Companies`}
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
        { text: 'Send a referral' },
      ]}
      useReactRouter={false}
      flashMessages={flashMessages}
    >
      <CompanyResource id={companyId}>
        {(company) => (
          <State>
            {({ currentAdviserId }) => (
              <Form
                id={STATE_ID}
                transformPayload={(values) => ({
                  values,
                  companyId,
                })}
                submissionTaskName={TASK_SAVE_REFERRAL}
                analyticsFormName="sendReferralForm"
                analyticsData={({ adviser, subject }) => ({
                  event: 'send_referral',
                  sendingAdviserTeam: <AdviserTeamName id={currentAdviserId} />,
                  receivingAdviserTeam: adviser.label?.split(', ')[1],
                  referralSubject: subject,
                })}
                initialValuesTaskName="Get send referral initial values"
                redirectTo={() => urls.companies.detail(companyId)}
                flashMessage={() => [
                  'Referral sent',
                  `You can <a href=${urls.companies.referrals.list()}>see all of your referrals on your Homepage</a>.`,
                ]}
              >
                <Step name="referral_details" forwardButton={null}>
                  <Task>
                    {(getTask) => {
                      const openContactFormTask = getTask(
                        TASK_REDIRECT_TO_CONTACT_FORM,
                        STATE_ID
                      )

                      return (
                        <StepReferralDetails
                          companyContacts={company.contacts}
                          companyId={companyId}
                          openContactFormTask={openContactFormTask}
                        />
                      )
                    }}
                  </Task>
                </Step>
                <Step
                  name="referral_confirmation"
                  forwardButton={null}
                  backButton={null}
                >
                  <StepReferralConfirmation
                    cancelUrl={urls.companies.detail(companyId)}
                  />
                </Step>
              </Form>
            )}
          </State>
        )}
      </CompanyResource>
    </DefaultLayout>
  )
}

export default connect(({ values, ...state }) => ({
  ...state[STATE_ID],
  values,
}))(({ ...props }) => <SendReferralForm {...props} />)
