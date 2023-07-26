import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import StepReferralDetails from './StepReferralDetails'
import StepReferralConfirmation from './StepReferralConfirmation'
import Step from '../../../../../../client/components/Form/elements/Step.jsx'
import LocalHeader from '../../../../../../client/components/LocalHeader/LocalHeader'
import { Main } from '../../../../../../client/components/'
import urls from '../../../../../../lib/urls'
import Task from '../../../../../../client/components/Task'
import Form from '../../../../../../client/components/Form'

import { ID as STATE_ID, TASK_SAVE_REFERRAL } from './state'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../../../../client/components/ContactForm/state'

const SendReferralForm = ({
  cancelUrl,
  companyContacts,
  companyName,
  companyId,
  sendingAdviserTeamName,
  flashMessages,
}) => (
  <>
    <LocalHeader
      heading={'Send a referral'}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        { link: urls.companies.detail(companyId), text: companyName },
        { text: 'Send a referral' },
      ]}
      flashMessages={flashMessages}
    />

    <Main>
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
          sendingAdviserTeam: sendingAdviserTeamName,
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
                  cancelUrl={cancelUrl}
                  companyContacts={companyContacts}
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
          <StepReferralConfirmation cancelUrl={cancelUrl} />
        </Step>
      </Form>
    </Main>
  </>
)

SendReferralForm.propTypes = {
  companyContacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  cancelUrl: PropTypes.string.isRequired,
  sendingAdviserTeamName: PropTypes.string,
}

export default connect(({ values, ...state }) => ({
  ...state[STATE_ID],
  values,
}))(({ ...props }) => <SendReferralForm {...props} />)
